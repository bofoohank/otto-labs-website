import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

import ChatConversation from "../models/ChatConversation.js";
import User from "../models/User.js";
import BotSetting from "../models/BotSetting.js";
import {
  authMiddleware,
  requireRole,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads", "chat");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 5,
  },
});

router.use(authMiddleware);
router.use(requireRole(["Mod", "Admin"]));

async function getBotSetting() {
  let setting = await BotSetting.findOne();

  if (!setting) {
    setting = await BotSetting.create({});
  }

  return setting;
}

function emitToUser(req, userId, eventName, payload) {
  if (req.io) {
    req.io.to(`user-${userId}`).emit(eventName, payload);
  }
}

function emitToAdmins(req, eventName, payload) {
  if (req.io) {
    req.io.to("admin-room").emit(eventName, payload);
  }
}

function syncConversationSenderAvatar(conversation, userId, avatar) {
  conversation.messages.forEach((message) => {
    if (message.senderId?.toString() === userId.toString()) {
      message.senderAvatar = avatar || "";
    }
  });
}

async function getPopulatedConversation(conversationId) {
  return ChatConversation.findById(conversationId)
    .populate("userId", "name username email phone role avatar")
    .populate("assignedTo", "name username role avatar");
}

async function syncBotAvatar(req, avatar) {
  const conversations = await ChatConversation.find({
    "messages.senderRole": "Bot",
  }).select("_id");

  if (conversations.length === 0) {
    return;
  }

  await ChatConversation.updateMany(
    {
      "messages.senderRole": "Bot",
    },
    {
      $set: {
        "messages.$[message].senderAvatar": avatar || "",
      },
    },
    {
      arrayFilters: [
        {
          "message.senderRole": "Bot",
        },
      ],
    },
  );

  const populatedConversations = await Promise.all(
    conversations.map((conversation) =>
      getPopulatedConversation(conversation._id),
    ),
  );

  populatedConversations.filter(Boolean).forEach((conversation) => {
    emitToUser(req, conversation.userId._id, "chat:updated", conversation);
    emitToAdmins(req, "chat:updated", conversation);
    emitToAdmins(req, "ticket:updated", conversation);
  });
}

router.get("/me", async (req, res) => {
  return res.json({
    user: req.user,
  });
});

router.get("/users", async (req, res) => {
  const users = await User.find()
    .select("-password")
    .sort({
      createdAt: -1,
    });

  return res.json({
    users,
  });
});

router.patch("/users/:id/role", requireRole(["Admin"]), async (req, res) => {
  try {
    const { role } = req.body;

    if (!["Member", "Mod", "Admin"].includes(role)) {
      return res.status(400).json({
        message: "Role không hợp lệ.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        role,
      },
      {
        new: true,
      },
    ).select("-password");

    return res.json({
      message: "Cập nhật role thành công.",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Không thể cập nhật role.",
    });
  }
});

router.get("/bot-setting", async (req, res) => {
  const setting = await getBotSetting();

  return res.json({
    setting,
  });
});

router.patch("/bot-setting", async (req, res) => {
  try {
    const {
      botName,
      botAvatar,
      enabled,
      delaySeconds,
      fallbackMessage,
      allowCustomerMedia,
      keywordReplies,
      adminKeywordReplies,
      suggestions,
      avatar,
    } = req.body;

    const setting = await getBotSetting();
    const previousBotAvatar = setting.botAvatar || "";

    if (botName !== undefined) {
      setting.botName = botName;
    }

    if (botAvatar !== undefined || avatar !== undefined) {
      setting.botAvatar = botAvatar ?? avatar;
    }

    if (typeof enabled === "boolean") {
      setting.enabled = enabled;
    }

    if (delaySeconds !== undefined) {
      setting.delaySeconds = Number(delaySeconds);
    }

    if (fallbackMessage !== undefined) {
      setting.fallbackMessage = fallbackMessage;
    }

    if (typeof allowCustomerMedia === "boolean") {
      setting.allowCustomerMedia = allowCustomerMedia;
    }

    if (Array.isArray(keywordReplies)) {
      setting.keywordReplies = keywordReplies
        .filter((item) => item.keyword && (item.reply || item.mediaUrl))
        .map((item) => ({
          keyword: item.keyword,
          reply: item.reply || "",
          mediaUrl: item.mediaUrl || "",
        }));
    }

    if (Array.isArray(adminKeywordReplies)) {
      setting.adminKeywordReplies = adminKeywordReplies
        .filter((item) => item.keyword)
        .map((item) => ({
          keyword: item.keyword,
          reply: item.reply || "",
          mediaUrl: item.mediaUrl || "",
        }));
    }

    if (Array.isArray(suggestions)) {
      setting.suggestions = suggestions
        .filter((item) => item.label && item.message)
        .map((item) => ({
          label: item.label,
          message: item.message,
        }));
    }

    await setting.save();

    if (
      (botAvatar !== undefined || avatar !== undefined) &&
      setting.botAvatar !== previousBotAvatar
    ) {
      await syncBotAvatar(req, setting.botAvatar);
    }

    return res.json({
      message: "Lưu setup bot thành công.",
      setting,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Không thể lưu setup bot.",
    });
  }
});

router.get("/tickets", async (req, res) => {
  const { status = "all" } = req.query;

  const query = {
    messages: {
      $elemMatch: {
        senderRole: "Member",
      },
    },
  };

  if (status !== "all") {
    query.status = status;
  }

  const conversations = await ChatConversation.find(query)
    .populate("userId", "name username email phone role avatar")
    .populate("assignedTo", "name username role avatar")
    .sort({
      updatedAt: -1,
    });

  return res.json({
    tickets: conversations,
  });
});

router.get("/tickets/:id", async (req, res) => {
  try {
    const conversation = await getPopulatedConversation(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        message: "Không tìm thấy ticket.",
      });
    }

    return res.json({
      ticket: conversation,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Không thể đọc ticket.",
    });
  }
});

router.post("/tickets/:id/assign", async (req, res) => {
  try {
    const conversation = await ChatConversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        message: "Không tìm thấy ticket.",
      });
    }

    if (
      conversation.assignedTo &&
      conversation.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(409).json({
        message: "Ticket này đã có người nhận xử lý.",
      });
    }

    const isFirstAssign = !conversation.assignedTo;

    conversation.assignedTo = req.user._id;
    conversation.assignedAt = new Date();

    conversation.messages.forEach((message) => {
      if (message.senderRole === "Member") {
        message.readByStaff = true;
      }
    });

    conversation.unreadForStaff = 0;

    if (isFirstAssign) {
      conversation.messages.push({

        senderRole: "System",
        senderName: "Hệ thống",
        senderAvatar: "",
        content: `Bạn đang được hỗ trợ bởi ${req.user.role} ${req.user.name}.`,
        attachments: [],
        readByStaff: true,
        readByMember: false,
      });

      conversation.unreadForMember += 1;
    }

    await conversation.save();

    const populatedConversation = await getPopulatedConversation(
      conversation._id,
    );

    emitToUser(
      req,
      populatedConversation.userId._id,
      "chat:updated",
      populatedConversation,
    );

    emitToAdmins(req, "ticket:assigned", populatedConversation);
    emitToAdmins(req, "ticket:updated", populatedConversation);

    return res.json({
      message: "Đã nhận xử lý ticket.",
      ticket: populatedConversation,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Không thể nhận xử lý ticket.",
    });
  }
});

function getLinkedMediaMimeType(url) {
  const cleanUrl = url.split("?")[0].toLowerCase();

  if (cleanUrl.endsWith(".gif")) return "image/gif";
  if (cleanUrl.endsWith(".webp")) return "image/webp";
  if (cleanUrl.endsWith(".png")) return "image/png";
  if (cleanUrl.endsWith(".jpg") || cleanUrl.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  return "image/*";
}

function getLinkedMediaName(url) {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split("/").filter(Boolean).pop();
    return filename || "linked-image";
  } catch (error) {
    return "linked-image";
  }
}

router.post("/tickets/:id/reply", upload.array("files", 5), async (req, res) => {
  try {
    const { content = "", mediaUrl = "" } = req.body;
    const files = req.files || [];

    if (!content.trim() && files.length === 0 && !mediaUrl.trim()) {
      return res.status(400).json({
        message: "Vui lòng nhập nội dung trả lời hoặc chọn file.",
      });
    }

    const conversation = await ChatConversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        message: "Không tìm thấy ticket.",
      });
    }

    if (!conversation.assignedTo) {
      return res.status(403).json({
        message: "Bạn cần nhận xử lý trước.",
      });
    }

    if (conversation.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Bạn không phải người đang xử lý ticket này.",
      });
    }

    if (conversation.status === "closed") {
      return res.status(400).json({
        message: "Ticket đã đóng.",
      });
    }

    const attachments = files.map((file) => ({
      originalName: file.originalname,
      filename: file.filename,
      url: `/uploads/chat/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size,
    }));

    if (mediaUrl.trim()) {
      attachments.push({
        originalName: getLinkedMediaName(mediaUrl.trim()),
        filename: getLinkedMediaName(mediaUrl.trim()),
        url: mediaUrl.trim(),
        mimeType: getLinkedMediaMimeType(mediaUrl.trim()),
        size: 0,
      });
    }

    syncConversationSenderAvatar(conversation, req.user._id, req.user.avatar);

    conversation.messages.push({
      senderRole: req.user.role,
      senderId: req.user._id,
      senderName: req.user.name,
      senderAvatar: req.user.avatar || "",
      content,
      attachments,
      readByStaff: true,
      readByMember: false,
    });

    conversation.status = "answered";
    conversation.unreadForMember += 1;
    conversation.unreadForStaff = 0;
    conversation.lastStaffMessageAt = new Date();

    await conversation.save();

    const populatedConversation = await getPopulatedConversation(
      conversation._id,
    );

    emitToUser(
      req,
      populatedConversation.userId._id,
      "chat:updated",
      populatedConversation,
    );

    emitToAdmins(req, "ticket:updated", populatedConversation);

    return res.json({
      message: "Đã trả lời.",
      ticket: populatedConversation,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Không thể trả lời ticket.",
    });
  }
});

router.delete("/tickets/:id", async (req, res) => {
  try {
    const conversation = await ChatConversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        message: "Không tìm thấy ticket.",
      });
    }

    if (
      conversation.assignedTo &&
      conversation.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Bạn không phải người đang xử lý ticket này.",
      });
    }

    await ChatConversation.findByIdAndDelete(req.params.id);

    emitToUser(req, conversation.userId, "chat:closed", {
      ticketId: req.params.id,
    });

    emitToAdmins(req, "ticket:deleted", {
      ticketId: req.params.id,
    });

    return res.json({
      message: "Đã đóng và xoá ticket.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Không thể đóng ticket.",
    });
  }
});

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "File không được vượt quá 20MB."
          : "Upload file thất bại.",
    });
  }

  if (error) {
    return res.status(400).json({
      message: error.message || "Upload file thất bại.",
    });
  }

  next();
});

export default router;
