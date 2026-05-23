import { apiForm, apiJson } from "@/lib/api";
import type { User } from "@/types/user";
import type { ChatConversation } from "@/types/chat";
import type { BotSetting } from "@/types/admin";

type UsersResponse = {
  users: User[];
};

type UserResponse = {
  message: string;
  user: User;
};

type BotSettingResponse = {
  setting: BotSetting;
};

type SaveBotSettingResponse = {
  message: string;
  setting: BotSetting;
};

type TicketsResponse = {
  tickets: ChatConversation[];
};

type TicketResponse = {
  message?: string;
  ticket: ChatConversation;
};

type MessageResponse = {
  message: string;
};

export function getAdminUsers(token: string) {
  return apiJson<UsersResponse>("/api/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateUserRole(
  token: string,
  userId: string,
  role: "Member" | "Mod" | "Admin",
) {
  return apiJson<UserResponse>(`/api/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      role,
    }),
  });
}

export function getAdminBotSetting(token: string) {
  return apiJson<BotSettingResponse>("/api/admin/bot-setting", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function saveAdminBotSetting(token: string, setting: BotSetting) {
  return apiJson<SaveBotSettingResponse>("/api/admin/bot-setting", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...setting,
      botAvatar: setting.avatar,
    }),
  });
}

export function getTickets(token: string, status: string) {
  return apiJson<TicketsResponse>(`/api/admin/tickets?status=${status}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function assignTicket(token: string, ticketId: string) {
  return apiJson<TicketResponse>(`/api/admin/tickets/${ticketId}/assign`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function openTicket(token: string, ticketId: string) {
  return apiJson<TicketResponse>(`/api/admin/tickets/${ticketId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function closeTicket(token: string, ticketId: string) {
  return apiJson<MessageResponse>(`/api/admin/tickets/${ticketId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function replyTicket(
  token: string,
  ticketId: string,
  content: string,
  files: File[],
  mediaUrl: string,
) {
  const form = new FormData();

  form.append("content", content);

  if (mediaUrl.trim()) {
    form.append("mediaUrl", mediaUrl.trim());
  }

  files.forEach((file) => {
    form.append("files", file);
  });

  return apiForm<TicketResponse>(
    `/api/admin/tickets/${ticketId}/reply`,
    form,
    token,
  );
}

export function uploadAvatar(token: string, file: File) {
  const form = new FormData();
  form.append("avatar", file);

  return apiForm<{ url: string }>("/api/upload/avatar", form, token);
}

export function uploadMedia(token: string, file: File) {
  const form = new FormData();
  form.append("media", file);

  return apiForm<{ url: string }>("/api/upload/media", form, token);
}