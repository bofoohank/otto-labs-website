import express from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sendMail } from "../services/mail.service.js";

const router = express.Router();

function createCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9+\-\s]{8,15}$/.test(phone);
}

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
  };
}

router.get("/me", authMiddleware, async (req, res) => {
  return res.json({
    user: req.user,
  });
});

router.patch("/me", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, address, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản.",
      });
    }

    if (name) user.name = name;
    if (address !== undefined) user.address = address;
    if (avatar !== undefined) user.avatar = avatar;

    if (email && email !== user.email) {
      if (!isValidEmail(email) || !email.endsWith("@gmail.com")) {
        return res.status(400).json({
          message: "Gmail không hợp lệ.",
        });
      }

      const existedEmail = await User.findOne({
        email: email.toLowerCase(),
      });

      if (existedEmail && existedEmail._id.toString() !== user._id.toString()) {
        return res.status(409).json({
          message: "Gmail này đã được sử dụng.",
        });
      }

      user.email = email.toLowerCase();
      user.emailVerified = false;
    }

    if (phone !== undefined && phone !== user.phone) {
      if (phone && !isValidPhone(phone)) {
        return res.status(400).json({
          message: "Số điện thoại không hợp lệ.",
        });
      }

      if (phone) {
        const existedPhone = await User.findOne({ phone });

        if (existedPhone && existedPhone._id.toString() !== user._id.toString()) {
          return res.status(409).json({
            message: "Số điện thoại này đã được sử dụng.",
          });
        }
      }

      user.phone = phone || undefined;
      user.phoneVerified = false;
    }

    await user.save();

    return res.json({
      message: "Cập nhật hồ sơ thành công.",
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi server khi cập nhật hồ sơ.",
    });
  }
});

router.patch("/me/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin đổi mật khẩu.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Mật khẩu mới nhập lại không khớp.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Mật khẩu cũ không đúng.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

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

router.post("/verify/email/send", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản.",
      });
    }

    const code = createCode();

    user.emailVerifyCode = code;
    user.emailVerifyExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await sendMail({
      to: user.email,
      subject: "Mã xác nhận Gmail Otto Labs",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Mã xác nhận Gmail</h2>
          <p>Mã xác nhận của bạn là:</p>
          <h1>${code}</h1>
          <p>Mã có hiệu lực trong 10 phút.</p>
        </div>
      `,
    });

    return res.json({
      message: "Đã gửi mã xác nhận về Gmail.",
    });
  } catch (error) {
    console.error("Send email verify error:", error);

    return res.status(500).json({
      message: "Không thể gửi mã Gmail. Kiểm tra MAIL_USER và MAIL_PASS.",
    });
  }
});

router.post("/verify/email/check", authMiddleware, async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findById(req.user._id);

    if (
      !user ||
      !user.emailVerifyCode ||
      user.emailVerifyCode !== code ||
      user.emailVerifyExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Mã xác nhận không hợp lệ hoặc đã hết hạn.",
      });
    }

    user.emailVerified = true;
    user.emailVerifyCode = undefined;
    user.emailVerifyExpires = undefined;

    await user.save();

    return res.json({
      message: "Xác nhận Gmail thành công.",
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi xác nhận Gmail.",
    });
  }
});

router.post("/verify/phone/send", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.phone) {
      return res.status(400).json({
        message: "Bạn chưa thêm số điện thoại.",
      });
    }

    const code = createCode();

    user.phoneVerifyCode = code;
    user.phoneVerifyExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    console.log(`Mã xác nhận SĐT ${user.phone}: ${code}`);

    return res.json({
      message: "Đã tạo mã xác nhận SĐT. Xem mã trong terminal backend.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Không thể tạo mã xác nhận số điện thoại.",
    });
  }
});

router.post("/verify/phone/check", authMiddleware, async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findById(req.user._id);

    if (
      !user ||
      !user.phoneVerifyCode ||
      user.phoneVerifyCode !== code ||
      user.phoneVerifyExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Mã xác nhận không hợp lệ hoặc đã hết hạn.",
      });
    }

    user.phoneVerified = true;
    user.phoneVerifyCode = undefined;
    user.phoneVerifyExpires = undefined;

    await user.save();

    return res.json({
      message: "Xác nhận số điện thoại thành công.",
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi xác nhận số điện thoại.",
    });
  }
});

export default router;