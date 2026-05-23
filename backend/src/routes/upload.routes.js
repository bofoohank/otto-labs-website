import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

import {
  authMiddleware,
  requireRole,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

const avatarUploadDir = path.join(process.cwd(), "uploads", "avatars");

if (!fs.existsSync(avatarUploadDir)) {
  fs.mkdirSync(avatarUploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, avatarUploadDir);
  },

  filename(req, file, cb) {
    const ext = path.extname(file.originalname) || ".jpg";
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Chỉ hỗ trợ upload file ảnh."));
      return;
    }

    cb(null, true);
  },
});

router.use(authMiddleware);
router.use(requireRole(["Mod", "Admin"]));

router.post("/avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Vui lòng chọn ảnh để upload.",
    });
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  return res.json({
    url: `${baseUrl}/uploads/avatars/${req.file.filename}`,
  });
});

router.post("/media", upload.single("media"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Vui lòng chọn ảnh hoặc GIF để upload.",
    });
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  return res.json({
    url: `${baseUrl}/uploads/avatars/${req.file.filename}`,
  });
});

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Ảnh không được vượt quá 5MB."
          : "Upload ảnh thất bại.",
    });
  }

  if (error) {
    return res.status(400).json({
      message: error.message || "Upload ảnh thất bại.",
    });
  }

  next();
});

export default router;
