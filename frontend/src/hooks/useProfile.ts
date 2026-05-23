"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getProfile,
  sendEmailVerifyCode,
  sendPhoneVerifyCode,
  updateProfile as updateProfileApi,
  verifyEmailCode as verifyEmailCodeApi,
  verifyPhoneCode as verifyPhoneCodeApi,
  type ProfilePayload,
} from "@/services/profile.service";

import {
  clearSession,
  getToken,
  saveStoredUser,
} from "@/lib/storage";

import type { ToastType } from "@/types/toast";
import type { User } from "@/types/user";

type ShowToast = (type: ToastType, message: string) => void;

type Props = {
  showToast: ShowToast;
};

const initialFormData: ProfilePayload = {
  name: "",
  email: "",
  phone: "",
  avatar: "",
};

export function useProfile({ showToast }: Props) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [sendingEmailCode, setSendingEmailCode] = useState(false);
  const [sendingPhoneCode, setSendingPhoneCode] = useState(false);

  const [showEmailCodeInput, setShowEmailCodeInput] = useState(false);
  const [showPhoneCodeInput, setShowPhoneCodeInput] = useState(false);

  const [emailCooldown, setEmailCooldown] = useState(0);
  const [phoneCooldown, setPhoneCooldown] = useState(0);

  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");

  const [formData, setFormData] =
    useState<ProfilePayload>(initialFormData);

  function logoutAndRedirect() {
    clearSession();
    window.location.href = "/";
  }

  function syncUser(nextUser: User) {
    setUser(nextUser);
    saveStoredUser(nextUser);

    setFormData({
      name: nextUser.name || "",
      email: nextUser.email || "",
      phone: nextUser.phone || "",
      avatar: nextUser.avatar || "",
    });
  }

  const fetchProfile = useCallback(async () => {
    const token = getToken();

    if (!token) {
      logoutAndRedirect();
      return;
    }

    try {
      const data = await getProfile(token);
      syncUser(data.user);
    } catch (error) {
      console.error(error);
      showToast("error", "Không thể tải hồ sơ.");
      logoutAndRedirect();
      return;
    }

    setPageLoading(false);
  }, [showToast]);

  useEffect(() => {
    void Promise.resolve().then(fetchProfile);
  }, [fetchProfile]);

  useEffect(() => {
    if (emailCooldown <= 0) return;

    const timer = setInterval(() => {
      setEmailCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [emailCooldown]);

  useEffect(() => {
    if (phoneCooldown <= 0) return;

    const timer = setInterval(() => {
      setPhoneCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [phoneCooldown]);

  async function updateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      logoutAndRedirect();
      return;
    }

    setLoading(true);

    try {
      const data = await updateProfileApi(token, formData);

      syncUser(data.user);

      showToast(
        "success",
        data.message || "Cập nhật hồ sơ thành công.",
      );
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error ? error.message : "Cập nhật thất bại.",
      );
    }

    setLoading(false);
  }

  function handleAvatarFile(file: File, croppedDataUrl?: string) {
    if (!file.type.startsWith("image/")) {
      showToast("error", "Vui lòng chọn file ảnh.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("error", "Ảnh tối đa 2MB.");
      return;
    }

    if (croppedDataUrl) {
      void updateAvatar(croppedDataUrl);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      void updateAvatar(String(reader.result));
    };

    reader.readAsDataURL(file);
  }

  async function updateAvatar(avatar: string) {
      const token = getToken();

      if (!token) {
        logoutAndRedirect();
        return;
      }

      const nextFormData = {
        ...formData,
        avatar,
      };

      setFormData(nextFormData);

      try {
        const data = await updateProfileApi(token, nextFormData);

        syncUser(data.user);

        showToast("success", "Cập nhật avatar thành công.");
      } catch (error) {
        console.error(error);

        showToast(
          "error",
          error instanceof Error
            ? error.message
            : "Không thể cập nhật avatar.",
        );
      }
  }

  async function sendEmailCode() {
    const token = getToken();

    if (!token) {
      logoutAndRedirect();
      return;
    }

    if (emailCooldown > 0) {
      showToast("info", `Vui lòng chờ ${emailCooldown}s để gửi lại mã.`);
      return;
    }

    setSendingEmailCode(true);

    try {
      const data = await sendEmailVerifyCode(token);

      setShowEmailCodeInput(true);
      setEmailCooldown(30);

      showToast(
        "success",
        data.message || "Đã gửi mã xác nhận về Gmail.",
      );
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error ? error.message : "Không thể gửi mã Gmail.",
      );
    }

    setSendingEmailCode(false);
  }

  async function verifyEmailCode() {
    const token = getToken();

    if (!token) {
      logoutAndRedirect();
      return;
    }

    if (!emailCode.trim()) {
      showToast("error", "Vui lòng nhập mã xác nhận Gmail.");
      return;
    }

    try {
      const data = await verifyEmailCodeApi(token, emailCode);

      syncUser(data.user);

      setEmailCode("");
      setShowEmailCodeInput(false);

      showToast(
        "success",
        data.message || "Xác nhận Gmail thành công.",
      );

      fetchProfile();
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Xác nhận Gmail thất bại.",
      );
    }
  }

  async function sendPhoneCode() {
    const token = getToken();

    if (!token) {
      logoutAndRedirect();
      return;
    }

    if (!formData.phone.trim()) {
      showToast("error", "Vui lòng nhập số điện thoại trước.");
      return;
    }

    if (phoneCooldown > 0) {
      showToast("info", `Vui lòng chờ ${phoneCooldown}s để gửi lại mã.`);
      return;
    }

    setSendingPhoneCode(true);

    try {
      const data = await sendPhoneVerifyCode(token);

      setShowPhoneCodeInput(true);
      setPhoneCooldown(30);

      showToast("info", data.message || "Đã tạo mã xác nhận SĐT.");
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error ? error.message : "Không thể gửi mã SĐT.",
      );
    }

    setSendingPhoneCode(false);
  }

  async function verifyPhoneCode() {
    const token = getToken();

    if (!token) {
      logoutAndRedirect();
      return;
    }

    if (!phoneCode.trim()) {
      showToast("error", "Vui lòng nhập mã xác nhận số điện thoại.");
      return;
    }

    try {
      const data = await verifyPhoneCodeApi(token, phoneCode);

      syncUser(data.user);

      setPhoneCode("");
      setShowPhoneCodeInput(false);

      showToast(
        "success",
        data.message || "Xác nhận SĐT thành công.",
      );

      fetchProfile();
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Xác nhận SĐT thất bại.",
      );
    }
  }

  return {
    user,
    pageLoading,
    loading,

    formData,
    setFormData,

    sendingEmailCode,
    sendingPhoneCode,

    showEmailCodeInput,
    showPhoneCodeInput,

    emailCooldown,
    phoneCooldown,

    emailCode,
    setEmailCode,

    phoneCode,
    setPhoneCode,

    updateProfile,
    handleAvatarFile,

    sendEmailCode,
    verifyEmailCode,

    sendPhoneCode,
    verifyPhoneCode,
  };
}
