"use client";

import { useEffect, useState } from "react";
import { clearSession, saveSession } from "@/lib/storage";
import {
  login,
  register,
  resetPassword as requestResetPassword,
  sendForgotPasswordCode as requestForgotPasswordCode,
} from "@/services/auth.service";
import type { User } from "@/types/user";
import type { ToastType } from "@/types/toast";

export const initialFormData = {
  name: "",
  username: "",
  email: "",
  phone: "",
  referralCode: "",
  identifier: "",
  password: "",
};

export const initialForgotData = {
  identifier: "",
  code: "",
  newPassword: "",
};

type ShowToast = (type: ToastType, message: string) => void;

type Props = {
  showToast: ShowToast;
  setUser: (user: User | null) => void;
  onLogoutCleanup: () => void;
};

export function useHomeAuth({
  showToast,
  setUser,
  onLogoutCleanup,
}: Props) {
  const [openAuth, setOpenAuth] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showForgotCodeInput, setShowForgotCodeInput] = useState(false);
  const [forgotCooldown, setForgotCooldown] = useState(0);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [forgotData, setForgotData] = useState(initialForgotData);

  useEffect(() => {
    if (forgotCooldown <= 0) return;

    const timer = setInterval(() => {
      setForgotCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [forgotCooldown]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const data = await login({
          identifier: formData.identifier,
          password: formData.password,
        });

        saveSession(data.token, data.user);
        setUser(data.user);
        showToast("success", data.message || "Đăng nhập thành công.");
      } else {
        const data = await register({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          referralCode: formData.referralCode,
          password: formData.password,
        });

        showToast("success", data.message || "Đăng ký thành công.");
      }

      setFormData(initialFormData);

      setTimeout(() => {
        setOpenAuth(false);
        setMessage("");
      }, 900);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra.";

      setMessage(errorMessage);
      showToast("error", errorMessage);
    }

    setLoading(false);
  }

  async function sendForgotPasswordCode() {
    if (!forgotData.identifier.trim()) {
      showToast(
        "error",
        "Vui lòng nhập tên đăng nhập, Gmail hoặc số điện thoại.",
      );
      return;
    }

    if (forgotCooldown > 0) {
      showToast("info", `Vui lòng chờ ${forgotCooldown}s để gửi lại mã.`);
      return;
    }

    setForgotLoading(true);

    try {
      const data = await requestForgotPasswordCode({
        identifier: forgotData.identifier,
      });

      setShowForgotCodeInput(true);
      setForgotCooldown(30);
      showToast("success", data.message || "Đã gửi mã đặt lại mật khẩu.");
    } catch (error) {
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Không thể gửi mã đặt lại mật khẩu.",
      );
    }

    setForgotLoading(false);
  }

  async function resetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!showForgotCodeInput) {
      showToast("error", "Vui lòng gửi mã xác nhận trước.");
      return;
    }

    setForgotLoading(true);

    try {
      const data = await requestResetPassword(forgotData);

      showToast("success", data.message || "Đặt lại mật khẩu thành công.");

      setForgotData(initialForgotData);
      setShowForgotCodeInput(false);
      setForgotCooldown(0);

      setTimeout(() => {
        setOpenForgotPassword(false);
        setOpenAuth(true);
        setIsLogin(true);
      }, 1000);
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Không thể đặt lại mật khẩu.",
      );
    }

    setForgotLoading(false);
  }

  function openLogin() {
    setOpenAuth(true);
    setIsLogin(true);
    setMessage("");
  }

  function openRegister() {
    setOpenAuth(true);
    setIsLogin(false);
    setMessage("");
  }

  function openForgot() {
    setOpenAuth(false);
    setOpenForgotPassword(true);
    setShowForgotCodeInput(false);
    setForgotCooldown(0);
    setForgotData(initialForgotData);
  }

  function toggleAuthMode() {
    setIsLogin((prev) => !prev);
    setMessage("");
    setFormData(initialFormData);
  }

  function backToLogin() {
    setOpenForgotPassword(false);
    setOpenAuth(true);
    setIsLogin(true);
  }

  function handleLogout() {
    clearSession();
    setUser(null);
    onLogoutCleanup();
    showToast("success", "Đã đăng xuất.");
  }

  return {
    openAuth,
    setOpenAuth,
    openForgotPassword,
    setOpenForgotPassword,
    isLogin,
    loading,
    forgotLoading,
    showForgotCodeInput,
    forgotCooldown,
    message,
    formData,
    setFormData,
    forgotData,
    setForgotData,
    handleSubmit,
    sendForgotPasswordCode,
    resetPassword,
    openLogin,
    openRegister,
    openForgot,
    toggleAuthMode,
    backToLogin,
    handleLogout,
  };
}