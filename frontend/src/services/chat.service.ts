import { apiForm, apiJson } from "@/lib/api";
import type { BotPublicSetting } from "@/types/bot";
import type { ChatConversation } from "@/types/chat";

type BotSettingResponse = {
  setting: BotPublicSetting;
};

type ChatResponse = {
  message?: string;
  conversation: ChatConversation;
};

export function getPublicBotSetting() {
  return apiJson<BotSettingResponse>("/api/chat/bot-setting");
}

export function getMyChat(token: string) {
  return apiJson<ChatResponse>("/api/chat/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function sendChat(
  token: string | null,
  content: string,
  files: File[] = [],
  mediaUrl = "",
) {
  const form = new FormData();

  form.append("content", content);

  if (mediaUrl.trim()) {
    form.append("mediaUrl", mediaUrl.trim());
  }

  files.forEach((file) => {
    form.append("files", file);
  });

  return apiForm<ChatResponse>("/api/chat/send", form, token || "");
}
