import express from "express";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/token.js";

import User from "../models/User.js";
import { sendMail } from "../services/mail.service.js";

const router = express.Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9+\-\s]{8,15}$/.test(phone);
}

function isValidUsername(username) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

router.post("/register", async (req, res) => {
  try {
    const { name, username, email, phone, referralCode, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập họ tên, tên đăng nhập, Gmail và mật khẩu.",
      });
    }

    if (!isValidUsername(username)) {
      return res.status(400).json({
        message:
          "Tên đăng nhập phải từ 3-20 ký tự, chỉ gồm chữ, số hoặc dấu gạch dưới.",
      });
    }

    if (!isValidEmail(email) || !email.endsWith("@gmail.com")) {
      return res.status(400).json({
        message: "Vui lòng nhập địa chỉ Gmail hợp lệ.",
      });
    }

    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({
        message: "Số điện thoại không hợp lệ.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 6 ký tự.",
      });
    }

    const existedUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (existedUser) {
      return res.status(409).json({
        message: "Gmail, tên đăng nhập hoặc số điện thoại đã được sử dụng.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      phone: phone || undefined,
      referralCode: referralCode || "",
      password: hashedPassword,
    });

    try {
      await sendMail({
        to: email,
        subject: "Đăng ký tài khoản Otto Labs thành công",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Xin chào ${name},</h2>
            <p>Bạn đã đăng ký tài khoản Otto Labs thành công.</p>
            <p><strong>Tên đăng nhập:</strong> ${username}</p>
            <p><strong>Gmail:</strong> ${email}</p>
            ${phone ? `<p><strong>Số điện thoại:</strong> ${phone}</p>` : ""}
            ${
              referralCode
                ? `<p><strong>Mã giới thiệu:</strong> ${referralCode}</p>`
                : ""
            }
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Send mail error:", mailError.message);
    }

    return res.status(201).json({
      message: "Đăng ký thành công.",
      user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      referralCode: user.referralCode,
      avatar: user.avatar,
      role: user.role,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,

},
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi server khi đăng ký tài khoản.",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập tên đăng nhập, Gmail hoặc số điện thoại.",
      });
    }

    const value = identifier.toLowerCase();

    const user = await User.findOne({
      $or: [{ email: value }, { username: value }, { phone: identifier }],
    });

    if (!user) {
      return res.status(401).json({
        message: "Thông tin đăng nhập hoặc mật khẩu không đúng.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Thông tin đăng nhập hoặc mật khẩu không đúng.",
      });
    }

    const token = signToken(user);

    return res.json({
      message: "Đăng nhập thành công.",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        referralCode: user.referralCode,
        avatar: user.avatar,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi server khi đăng nhập.",
    });
  }
});

export default router;