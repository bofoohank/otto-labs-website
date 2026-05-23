"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, MessageCircle, Minimize2, X } from "lucide-react";

import { DiscordChat } from "@/components/chat/discord/DiscordChat";

import type { User } from "@/types/user";
import type { ChatConversation } from "@/types/chat";
import type { BotPublicSetting } from "@/types/bot";

type Props = {
  user: User | null;
  openChat: boolean;
  hasNewChat: boolean;
  chatLoading: boolean;
  chatMessage: string;
  chatFiles: File[];
  conversation: ChatConversation | null;
  botSetting: BotPublicSetting;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  chatBodyRef: React.RefObject<HTMLDivElement | null>;
  onOpenChat: () => void;
  onCloseChat: () => void;
  onOpenLogin: () => void;
  onChangeMessage: (message: string) => void;
  onChangeFiles: (files: File[]) => void;
  onSendMessage: (e?: React.FormEvent<HTMLFormElement>) => void;
  onSendSuggestion: (message: string) => void;
};

export function ChatWidget({
  user,
  openChat,
  hasNewChat,
  chatLoading,
  chatMessage,
  chatFiles,
  conversation,
  botSetting,
  fileInputRef,
  chatBodyRef,
  onOpenChat,
  onCloseChat,
  onOpenLogin,
  onChangeMessage,
  onChangeFiles,
  onSendMessage,
  onSendSuggestion,
}: Props) {
  const [fullChatOpen, setFullChatOpen] = useState(false);

  const chatContent = user ? (
    <DiscordChat
      messages={conversation?.messages || []}
      bodyRef={chatBodyRef}
      fileInputRef={fileInputRef}
      inputValue={chatMessage}
      files={chatFiles}
      loading={chatLoading}
      botName={botSetting.botName}
      botAvatar={botSetting.botAvatar}
      currentUserAvatar={user.avatar || ""}
      allowMedia={botSetting.allowCustomerMedia !== false}
      suggestions={botSetting.suggestions || []}
      placeholder="Nhập tin nhắn..."
      onChangeInput={onChangeMessage}
      onChangeFiles={onChangeFiles}
      onSubmit={onSendMessage}
      onSelectSuggestion={(suggestion) =>
        onSendSuggestion(suggestion.message)
      }
    />
  ) : (
    <div className="grid flex-1 place-items-center p-6 text-center">
      <div>
        <p className="font-bold text-neutral-300">
          Vui lòng đăng nhập để chat.
        </p>

        <button
          type="button"
          onClick={onOpenLogin}
          className="mt-4 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white transition hover:bg-orange-400"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );

  const header = (
    <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-2xl bg-orange-500 text-sm font-black text-white">
          {botSetting.botAvatar ? (
            <Image
              src={botSetting.botAvatar}
              alt={botSetting.botName}
              fill
              sizes="40px"
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            botSetting.botName.charAt(0)
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-xl font-black text-white">
            {botSetting.botName}
          </h3>

          <p className="truncate text-sm text-neutral-400">
            Hỗ trợ tự động và thủ công
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => setFullChatOpen((current) => !current)}
          className="grid h-9 w-9 place-items-center rounded-xl text-neutral-500 transition hover:bg-white/5 hover:text-white"
        >
          {fullChatOpen ? <Minimize2 size={21} /> : <Maximize2 size={21} />}
        </button>

        <button
          type="button"
          onClick={onCloseChat}
          className="grid h-9 w-9 place-items-center rounded-xl text-neutral-500 transition hover:bg-white/5 hover:text-white"
        >
          <X size={26} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-5 right-5 z-[100]">
      <AnimatePresence>
        {openChat ? (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="flex h-[min(680px,calc(100vh-96px))] w-[clamp(320px,30vw,430px)] flex-col overflow-hidden rounded-[2rem] border border-orange-500/10 bg-[#151515] shadow-[0_0_50px_rgba(249,115,22,0.18)] max-sm:h-[82vh] max-sm:w-[calc(100vw-32px)]"
          >
            {header}
            {chatContent}
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenChat}
            className="relative flex items-center gap-3 rounded-[1.4rem] bg-orange-500 px-5 py-4 shadow-[0_0_40px_rgba(249,115,22,0.3)] transition hover:bg-orange-400"
          >
            {hasNewChat && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
                !
              </span>
            )}

            <MessageCircle size={22} className="text-white" />
            <span className="text-lg font-black text-white">Chat ngay</span>
          </motion.button>
        )}
      </AnimatePresence>

      {openChat && fullChatOpen && (
        <div className="fixed inset-0 z-[120] bg-black/80 p-[clamp(8px,1.5vw,24px)] backdrop-blur">
          <div className="mx-auto flex h-full max-w-[min(900px,100%)] flex-col overflow-hidden rounded-[2rem] border border-orange-500/20 bg-[#151515] shadow-2xl">
            {header}
            {chatContent}
          </div>
        </div>
      )}
    </div>
  );
}
