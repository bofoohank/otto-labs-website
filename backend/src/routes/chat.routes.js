import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import ChatConversation from "../models/ChatConversation.js";
import BotSetting from "../models/BotSetting.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

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

async function getBotSetting() {
  let setting = await BotSetting.findOne();

  if (!setting) {
    setting = await BotSetting.create({});
  }

  return setting;
}

function getBotReply(content, setting) {
  const lowerContent = content.toLowerCase();

  const matchedReply = setting.keywordReplies.find((item) =>
    lowerContent.includes(item.keyword.toLowerCase()),
  );

  if (matchedReply) {
    return {
      content: matchedReply.reply,
      mediaUrl: matchedReply.mediaUrl || "",
    };
  }

  return {
    content: setting.fallbackMessage,
    mediaUrl: "",
  };
}

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

function getStandaloneMediaUrl(content) {
  const trimmedContent = content.trim();

  if (!/^https?:\/\//i.test(trimmedContent)) {
    return "";
  }

  const cleanUrl = trimmedContent.split("?")[0].toLowerCase();

  if (/\.(gif|webp|png|jpe?g)$/.test(cleanUrl)) {
    return trimmedContent;
  }

  return "";
}

function removeUploadedFiles(files) {
  files.forEach((file) => {
    fs.unlink(file.path, (error) => {
      if (error) console.error(error);
    });
  });
}

function sendDelayedBotReply(req, conversationId, userId, content, setting) {
  const delayMs = Math.max(Number(setting.delaySeconds) || 0, 0) * 1000;

  setTimeout(async () => {
    try {
      const conversation = await ChatConversation.findById(conversationId);

      if (!conversation || conversation.assignedTo || conversation.status === "closed") {
        return;
      }

      const botReply = getBotReply(content, setting);
      const botAttachments = botReply.mediaUrl
        ? [
            {
              originalName: getLinkedMediaName(botReply.mediaUrl),
              filename: getLinkedMediaName(botReply.mediaUrl),
              url: botReply.mediaUrl,
              mimeType: getLinkedMediaMimeType(botReply.mediaUrl),
              size: 0,
            },
          ]
        : [];

      conversation.messages.push({
        senderRole: "Bot",
        senderName: setting.botName,
        senderAvatar: setting.botAvatar,
        content: botReply.content,
        attachments: botAttachments,
        readByStaff: true,
        readByMember: false,
      });

      conversation.unreadForMember += 1;
      conversation.botRepliedAt = new Date();

      await conversation.save();

      const populatedConversation = await getPopulatedConversation(conversation._id);

      emitToAdmins(req, "chat:updated", populatedConversation);
      emitToUser(req, userId, "chat:updated", populatedConversation);
    } catch (error) {
      console.error(error);
    }
  }, delayMs);
}

function emitToAdmins(req, eventName, payload) {
  if (req.io) {
    req.io.to("admin-room").emit(eventName, payload);
  }
}

function emitToUser(req, userId, eventName, payload) {
  if (req.io) {
    req.io.to(`user-${userId}`).emit(eventName, payload);
  }
}

async function getPopulatedConversation(conversationId) {
  return ChatConversation.findById(conversationId)
    .populate("userId", "name username email phone role avatar")
    .populate("assignedTo", "name username role avatar");
}

router.get("/bot-setting", async (req, res) => {
  try {
    const setting = await getBotSetting();

    return res.json({
      setting: {
        botName: setting.botName,
        botAvatar: setting.botAvatar,
        allowCustomerMedia: setting.allowCustomerMedia,
        suggestions: setting.suggestions,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Không thể tải gợi ý bot.",
    });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    let conversation = await ChatConversation.findOne({
      userId: req.user._id,
    })
      .populate("userId", "name username email phone role avatar")
      .populate("assignedTo", "name username role avatar");

    if (!conversation) {
      conversation = await ChatConversation.create({
        userId: req.user._id,
        status: "waiting",
        messages: [],
      });

      conversation = await getPopulatedConversation(conversation._id);
    }

    conversation.messages.forEach((message) => {
      if (
        message.senderRole === "Mod" ||
        message.senderRole === "Admin" ||
        message.senderRole === "Bot"
      ) {
        message.readByMember = true;
      }
    });

    conversation.unreadForMember = 0;

    await conversation.save();

    return res.json({
      conversation,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Không thể tải đoạn chat.",
    });
  }
});

router.post(
  "/send",
  authMiddleware,
  upload.array("files", 5),
  async (req, res) => {
    try {
      const { content = "", mediaUrl = "" } = req.body;
      const files = req.files || [];
      const botSetting = await getBotSetting();

      if (!content.trim() && files.length === 0 && !mediaUrl.trim()) {
        return res.status(400).json({
          message: "Vui lòng nhập tin nhắn hoặc gửi file.",
        });
      }

      if (botSetting.allowCustomerMedia === false && files.length > 0) {
        removeUploadedFiles(files);

        return res.status(403).json({
          message: "Chat ngay hiện không cho phép gửi ảnh/file đính kèm.",
        });
      }

      const finalMediaUrl = botSetting.allowCustomerMedia === false ? "" : mediaUrl;

      let conversation = await ChatConversation.findOne({
        userId: req.user._id,
      });

      if (!conversation) {
        conversation = await ChatConversation.create({
          userId: req.user._id,
          status: "waiting",
          messages: [],
        });
      }

      if (conversation.status === "closed") {
        conversation.status = "waiting";
        conversation.assignedTo = null;
        conversation.assignedAt = null;
      }

      const attachments = files.map((file) => ({
        originalName: file.originalname,
        filename: file.filename,
        url: `/uploads/chat/${file.filename}`,
        mimeType: file.mimetype,
        size: file.size,
      }));

      if (finalMediaUrl.trim()) {
        attachments.push({
          originalName: getLinkedMediaName(finalMediaUrl.trim()),
          filename: getLinkedMediaName(finalMediaUrl.trim()),
          url: finalMediaUrl.trim(),
          mimeType: getLinkedMediaMimeType(finalMediaUrl.trim()),
          size: 0,
        });
      }

      conversation.messages.push({
        senderRole: "Member",
        senderId: req.user._id,
        senderName: req.user.name,
        senderAvatar: req.user.avatar || "",
        content,
        attachments,
        readByStaff: false,
        readByMember: true,
      });

      conversation.status = "waiting";
      conversation.unreadForStaff += 1;
      conversation.lastCustomerMessageAt = new Date();

      await conversation.save();

      const populatedConversation = await getPopulatedConversation(
        conversation._id,
      );

      emitToAdmins(req, "chat:new-ticket", populatedConversation);
      emitToAdmins(req, "chat:updated", populatedConversation);
      emitToUser(req, req.user._id, "chat:updated", populatedConversation);

      if (botSetting.enabled && !conversation.assignedTo) {
        sendDelayedBotReply(
          req,
          conversation._id,
          req.user._id,
          content,
          botSetting.toObject(),
        );
      }

      return res.json({
        message: "Đã gửi tin nhắn.",
        conversation: populatedConversation,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: error.message || "Lỗi gửi tin nhắn.",
      });
    }
  },
);

export default router;
