"use client";

import { useEffect, useState } from "react";

import {
  assignTicket as assignTicketApi,
  closeTicket as closeTicketApi,
  getAdminBotSetting,
  getAdminUsers,
  getTickets,
  openTicket as openTicketApi,
  replyTicket,
  saveAdminBotSetting,
  updateUserRole,
  uploadAvatar,
  uploadMedia,
} from "@/services/admin.service";
import { getStandaloneImageUrl } from "@/lib/media-url";

import type { ToastType } from "@/types/toast";
import type { Role } from "@/types/user";
import type {
  AdminKeywordReply,
  AdminUser,
  BotSetting,
  Ticket,
  TicketStatus,
} from "@/types/admin";

type ShowToast = (type: ToastType, message: string) => void;

type Props = {
  token: string;
  showToast: ShowToast;
  adminMessagesRef: React.RefObject<HTMLDivElement | null>;
  replyFileInputRef: React.RefObject<HTMLInputElement | null>;
};

const initialBotSetting: BotSetting = {
  botName: "Otto Bot",
  avatar: "",
  enabled: true,
  delaySeconds: 0,
  allowCustomerMedia: true,
  fallbackMessage:
    "Cảm ơn bạn đã nhắn tin cho Otto Labs. Nhân viên hỗ trợ sẽ trả lời bạn sớm nhất có thể.",
  keywordReplies: [],
  adminKeywordReplies: [],
  suggestions: [],
};

export function useAdminData({
  token,
  showToast,
  adminMessagesRef,
  replyFileInputRef,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [savingBot, setSavingBot] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [openedTicket, setOpenedTicket] = useState<Ticket | null>(null);

  const [replyMessage, setReplyMessage] = useState("");
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const [replyMediaUrl, setReplyMediaUrl] = useState("");

  const [botSetting, setBotSetting] = useState<BotSetting>(initialBotSetting);

  function scrollAdminChatToBottom() {
    setTimeout(() => {
      if (adminMessagesRef.current) {
        adminMessagesRef.current.scrollTop =
          adminMessagesRef.current.scrollHeight;
      }
    }, 50);
  }

  async function fetchUsers() {
    const data = await getAdminUsers(token);
    setUsers(data.users as AdminUser[]);
  }

  async function fetchTickets(status: TicketStatus = "all") {
    const data = await getTickets(token, status);
    const nextTickets = data.tickets as Ticket[];

    setTickets(nextTickets);

    if (nextTickets.length > 0) {
      setSelectedTicket((current) => {
        const stillSelected = nextTickets.find(
          (item) => item._id === current?._id,
        );

        return stillSelected || nextTickets[0];
      });
    } else {
      setSelectedTicket(null);
      setOpenedTicket(null);
    }
  }

  async function fetchBotSetting() {
    const data = await getAdminBotSetting(token);

    setBotSetting({
      ...data.setting,
      avatar: data.setting.botAvatar || data.setting.avatar || "",
      adminKeywordReplies: data.setting.adminKeywordReplies || [],
    });
  }

  async function fetchAdminData(ticketStatus: TicketStatus) {
    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      await Promise.all([
        fetchUsers(),
        fetchTickets(ticketStatus),
        fetchBotSetting(),
      ]);
    } catch (error) {
      console.error(error);
      showToast("error", "Không có quyền truy cập Admin Panel.");
      window.location.href = "/";
      return;
    }

    setLoading(false);
  }

  useEffect(() => {
    if (!openedTicket) return;

    const timer = window.setTimeout(() => {
      if (adminMessagesRef.current) {
        adminMessagesRef.current.scrollTop =
          adminMessagesRef.current.scrollHeight;
      }
    }, 50);

    return () => window.clearTimeout(timer);
  }, [adminMessagesRef, openedTicket]);

  async function updateRole(userId: string, role: Role) {
    try {
      const data = await updateUserRole(token, userId, role);

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? {
                ...user,
                role,
              }
            : user,
        ),
      );

      showToast("success", data.message || "Cập nhật role thành công.");
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error ? error.message : "Không thể cập nhật role.",
      );
    }
  }

  async function saveBotSetting() {
    setSavingBot(true);

    try {
      const data = await saveAdminBotSetting(token, botSetting);

      setBotSetting({
        ...data.setting,
        avatar: data.setting.botAvatar || data.setting.avatar || "",
        adminKeywordReplies: data.setting.adminKeywordReplies || [],
      });

      showToast("success", data.message || "Lưu setup bot thành công.");
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error ? error.message : "Không thể lưu setup bot.",
      );
    }

    setSavingBot(false);
  }

  async function assignTicket(ticket: Ticket) {
    try {
      const data = await assignTicketApi(token, ticket._id);
      const nextTicket = data.ticket as Ticket;

      setSelectedTicket(nextTicket);
      setOpenedTicket(nextTicket);
      scrollAdminChatToBottom();

      setTickets((prev) =>
        prev.map((item) => (item._id === nextTicket._id ? nextTicket : item)),
      );

      showToast("success", data.message || "Đã nhận xử lý ticket.");
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error ? error.message : "Không thể nhận xử lý.",
      );
    }
  }

  async function openTicket(ticket: Ticket) {
    setSelectedTicket(ticket);

    try {
      const data = await openTicketApi(token, ticket._id);
      const nextTicket = data.ticket as Ticket;

      setOpenedTicket(nextTicket);

      setTickets((prev) =>
        prev.map((item) => (item._id === nextTicket._id ? nextTicket : item)),
      );
    } catch (error) {
      console.error(error);
      setOpenedTicket(null);

      showToast(
        "error",
        error instanceof Error ? error.message : "Không thể đọc ticket.",
      );
    }
  }

  async function sendReply(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();

    if (!openedTicket) return;

    const typedMediaUrl = getStandaloneImageUrl(replyMessage);
    const nextMediaUrl = replyMediaUrl.trim() || typedMediaUrl;
    const nextMessage = typedMediaUrl ? "" : replyMessage;

    if (!nextMessage.trim() && replyFiles.length === 0 && !nextMediaUrl) {
      showToast("error", "Vui lòng nhập nội dung trả lời hoặc chọn file.");
      return;
    }

    setReplyLoading(true);

    try {
      const data = await replyTicket(
        token,
        openedTicket._id,
        nextMessage,
        replyFiles,
        nextMediaUrl,
      );

      const nextTicket = data.ticket as Ticket;

      setReplyMessage("");
      setReplyFiles([]);
      setReplyMediaUrl("");

      if (replyFileInputRef.current) {
        replyFileInputRef.current.value = "";
      }

      setOpenedTicket(nextTicket);
      setSelectedTicket(nextTicket);

      setTickets((prev) =>
        prev.map((item) => (item._id === nextTicket._id ? nextTicket : item)),
      );

      showToast("success", "Đã gửi phản hồi.");
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error ? error.message : "Không thể trả lời.",
      );
    }

    setReplyLoading(false);
  }

  async function sendAdminSuggestion(item: AdminKeywordReply) {
    if (!openedTicket) return;

    if (!openedTicket.assignedTo) {
      showToast("info", "Bấm Giao cho tôi để gửi phản hồi.");
      return;
    }

    setReplyLoading(true);

    try {
      const data = await replyTicket(
        token,
        openedTicket._id,
        item.reply || "",
        [],
        item.mediaUrl || "",
      );

      const nextTicket = data.ticket as Ticket;

      setOpenedTicket(nextTicket);
      setSelectedTicket(nextTicket);

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === nextTicket._id ? nextTicket : ticket,
        ),
      );

      showToast("success", "Đã gửi gợi ý phản hồi.");
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error ? error.message : "Không thể gửi gợi ý.",
      );
    }

    setReplyLoading(false);
  }

  async function closeTicket() {
    const target = openedTicket || selectedTicket;

    if (!target) return;

    try {
      const data = await closeTicketApi(token, target._id);

      setTickets((prev) => prev.filter((item) => item._id !== target._id));
      setOpenedTicket(null);
      setSelectedTicket(null);

      showToast("success", data.message || "Đã đóng ticket.");
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error ? error.message : "Không thể đóng ticket.",
      );
    }
  }

  function applyAdminKeywordReply(item: AdminKeywordReply) {
    setReplyMessage(item.reply || "");
    setReplyMediaUrl(item.mediaUrl || "");
    showToast("info", "Đã chèn gợi ý phản hồi.");
  }

  async function uploadKeywordMedia(
    target: "bot" | "admin",
    index: number,
    file: File,
  ) {
    try {
      const data = await uploadMedia(token, file);

      if (target === "bot") {
        setBotSetting((prev) => ({
          ...prev,
          keywordReplies: prev.keywordReplies.map((item, itemIndex) =>
            itemIndex === index
              ? {
                  ...item,
                  mediaUrl: data.url,
                }
              : item,
          ),
        }));
      } else {
        setBotSetting((prev) => ({
          ...prev,
          adminKeywordReplies: prev.adminKeywordReplies.map(
            (item, itemIndex) =>
              itemIndex === index
                ? {
                    ...item,
                    mediaUrl: data.url,
                  }
                : item,
          ),
        }));
      }

      showToast("success", "Đã upload ảnh/GIF.");
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error ? error.message : "Không thể upload ảnh/GIF.",
      );
    }
  }

  async function handleBotAvatarUpload(file: File) {
    try {
      const data = await uploadAvatar(token, file);

      setBotSetting((prev) => ({
        ...prev,
        avatar: data.url,
      }));

      showToast("success", "Đã cập nhật avatar bot.");
    } catch (error) {
      console.error(error);

      showToast(
        "error",
        error instanceof Error ? error.message : "Không thể upload avatar.",
      );
    }
  }

  return {
    loading,
    savingBot,
    replyLoading,

    users,
    tickets,
    setTickets,

    selectedTicket,
    setSelectedTicket,

    openedTicket,
    setOpenedTicket,

    replyMessage,
    setReplyMessage,

    replyFiles,
    setReplyFiles,

    replyMediaUrl,
    setReplyMediaUrl,

    botSetting,
    setBotSetting,

    fetchAdminData,
    fetchTickets,

    updateRole,
    saveBotSetting,

    assignTicket,
    openTicket,
    sendReply,
    sendAdminSuggestion,
    closeTicket,

    applyAdminKeywordReply,

    uploadKeywordMedia,
    handleBotAvatarUpload,
  };
}
