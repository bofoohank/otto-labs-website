"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "@/lib/api";
import { getToken } from "@/lib/storage";
import { getStandaloneImageUrl } from "@/lib/media-url";
import {
  getMyChat,
  getPublicBotSetting,
  sendChat,
} from "@/services/chat.service";
import type { User } from "@/types/user";
import type { ChatConversation } from "@/types/chat";
import type { BotPublicSetting } from "@/types/bot";
import type { ToastType } from "@/types/toast";

type ShowToast = (type: ToastType, message: string) => void;

type Props = {
  user: User | null;
  showToast: ShowToast;
};

export function useHomeChat({ user, showToast }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  const [openChat, setOpenChat] = useState(false);
  const [hasNewChat, setHasNewChat] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatFiles, setChatFiles] = useState<File[]>([]);
  const [conversation, setConversation] = useState<ChatConversation | null>(
    null,
  );

  const [botSetting, setBotSetting] = useState<BotPublicSetting>({
    botName: "Otto Bot",
    botAvatar: "",
    suggestions: [],
  });

  function getUserId(currentUser: User) {
    return currentUser.id || currentUser._id || "";
  }

  function scrollChatToBottom() {
    setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, 60);
  }

  const fetchBotSetting = useCallback(async () => {
    try {
      const data = await getPublicBotSetting();
      setBotSetting(data.setting);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchChat = useCallback(async () => {
    const token = getToken();

    if (!token) return;

    try {
      const data = await getMyChat(token);
      setConversation(data.conversation);
      scrollChatToBottom();
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchBotSetting);
  }, [fetchBotSetting]);

  useEffect(() => {
    if (!user || !API_URL) return;

    const socket: Socket = io(API_URL, {
      transports: ["websocket"],
    });

    socket.emit("user:join", getUserId(user));

    socket.on("chat:updated", (updatedConversation: ChatConversation) => {
      setConversation(updatedConversation);

      if (openChat) {
        setHasNewChat(false);
        scrollChatToBottom();
      } else {
        setHasNewChat(true);
      }
    });

    socket.on("chat:closed", () => {
      setConversation(null);
      setChatMessage("");
      setChatFiles([]);
      setHasNewChat(false);

      showToast(
        "info",
        "Ticket hỗ trợ đã được đóng. Bạn có thể gửi tin nhắn mới nếu cần.",
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [user, openChat, showToast]);

  useEffect(() => {
    if (user) {
      void Promise.resolve().then(fetchChat);
    }
  }, [fetchChat, user]);

  useEffect(() => {
    if (openChat) {
      scrollChatToBottom();
      void Promise.resolve().then(fetchBotSetting);
    }
  }, [openChat, fetchBotSetting]);

  useEffect(() => {
    if (openChat) {
      scrollChatToBottom();
    }
  }, [conversation?.messages?.length, openChat]);

  async function sendChatMessage(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();

    if (!user) {
      showToast("info", "Vui lòng đăng nhập để chat với Otto Labs.");
      return;
    }

    const standaloneMediaUrl = getStandaloneImageUrl(chatMessage);

    const mediaUrl =
      botSetting.allowCustomerMedia === false ? "" : standaloneMediaUrl;
    const content = mediaUrl ? "" : chatMessage;

    if (!content.trim() && chatFiles.length === 0 && !mediaUrl) {
      showToast("error", "Vui lòng nhập tin nhắn hoặc chọn file.");
      return;
    }

    setChatLoading(true);

    try {
      const token = getToken();
      const data = await sendChat(
        token,
        content,
        botSetting.allowCustomerMedia === false ? [] : chatFiles,
        mediaUrl,
      );

      setConversation(data.conversation);
      setChatMessage("");
      setChatFiles([]);
      setHasNewChat(false);
      scrollChatToBottom();
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Không thể gửi tin nhắn.",
      );
    }

    setChatLoading(false);
  }

  async function sendSuggestion(messageText: string) {
    if (!user) {
      showToast("info", "Vui lòng đăng nhập để chat với Otto Labs.");
      return;
    }

    setChatLoading(true);

    try {
      const token = getToken();
      const data = await sendChat(token, messageText);

      setConversation(data.conversation);
      setChatMessage("");
      setChatFiles([]);
      setHasNewChat(false);
      scrollChatToBottom();
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Không thể gửi tin nhắn.",
      );
    }

    setChatLoading(false);
  }

  function clearChatState() {
    setConversation(null);
    setChatFiles([]);
    setChatMessage("");
    setHasNewChat(false);
  }

  return {
    fileInputRef,
    chatBodyRef,
    openChat,
    setOpenChat,
    hasNewChat,
    setHasNewChat,
    chatLoading,
    chatMessage,
    setChatMessage,
    chatFiles,
    setChatFiles,
    conversation,
    setConversation,
    botSetting,
    sendChatMessage,
    sendSuggestion,
    clearChatState,
  };
}
