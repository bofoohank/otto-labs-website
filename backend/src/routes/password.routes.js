import express from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import { sendMail } from "../services/mail.service.js";

const router = express.Router();

function createCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/forgot", async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({
        message: "Vui lòng nhập Gmail, tên đăng nhập hoặc số điện thoại.",
      });
    }

    const value = identifier.toLowerCase();

    const user = await User.findOne({
      $or: [{ email: value }, { username: value }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản.",
      });
    }

    const code = createCode();

    user.resetPasswordCode = code;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await sendMail({
      to: user.email,
      subject: "Mã đặt lại mật khẩu Otto Labs",
      html: `
        <h2>Đặt lại mật khẩu</h2>
        <p>Mã xác nhận của bạn là:</p>
        <h1>${code}</h1>
        <p>Mã có hiệu lực trong 10 phút.</p>
      `,
    });

    return res.json({
      message: "Đã gửi mã đặt lại mật khẩu về Gmail.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Không thể gửi mã đặt lại mật khẩu.",
    });
  }
});

router.post("/reset", async (req, res) => {
  try {
    const { identifier, code, newPassword } = req.body;

    if (!identifier || !code || !newPassword) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
      });
    }

    const value = identifier.toLowerCase();

    const user = await User.findOne({
      $or: [{ email: value }, { username: value }, { phone: identifier }],
    });

    if (
      !user ||
      user.resetPasswordCode !== code ||
      user.resetPasswordExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Mã xác nhận không hợp lệ hoặc đã hết hạn.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({
      message: "Đổi mật khẩu thành công.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Không thể đổi mật khẩu.",
    });
  }
});

export default router;