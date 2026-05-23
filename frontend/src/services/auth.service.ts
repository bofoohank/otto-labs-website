import { apiJson } from "@/lib/api";
import type { User } from "@/types/user";

type MessageResponse = {
  message: string;
};

type LoginResponse = {
  message: string;
  token: string;
  user: User;
};

type RegisterPayload = {
  name: string;
  username: string;
  email: string;
  phone?: string;
  referralCode?: string;
  password: string;
};

type LoginPayload = {
  identifier: string;
  password: string;
};

type ForgotPayload = {
  identifier: string;
};

type ResetPasswordPayload = {
  identifier: string;
  code: string;
  newPassword: string;
};

export function login(payload: LoginPayload) {
  return apiJson<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterPayload) {
  return apiJson<MessageResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function sendForgotPasswordCode(payload: ForgotPayload) {
  return apiJson<MessageResponse>("/api/password/forgot", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiJson<MessageResponse>("/api/password/reset", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}