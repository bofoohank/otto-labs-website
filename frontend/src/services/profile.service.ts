import { apiJson } from "@/lib/api";
import type { User } from "@/types/user";

type UserResponse = {
  message?: string;
  user: User;
};

type MessageResponse = {
  message: string;
};

export type ProfilePayload = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
};

export function getProfile(token: string) {
  return apiJson<UserResponse>("/api/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateProfile(token: string, payload: ProfilePayload) {
  return apiJson<UserResponse>("/api/users/me", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function sendEmailVerifyCode(token: string) {
  return apiJson<MessageResponse>("/api/users/verify/email/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function verifyEmailCode(token: string, code: string) {
  return apiJson<UserResponse>("/api/users/verify/email/check", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });
}

export function sendPhoneVerifyCode(token: string) {
  return apiJson<MessageResponse>("/api/users/verify/phone/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function verifyPhoneCode(token: string, code: string) {
  return apiJson<UserResponse>("/api/users/verify/phone/check", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });
}