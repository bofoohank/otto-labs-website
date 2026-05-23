"use client";

import Image from "next/image";
import {
  MessageCircleReply,
  MoreHorizontal,
  SmilePlus,
} from "lucide-react";

import { ChatAttachments } from "@/components/chat/ChatAttachments";
import type { DiscordMessage as DiscordMessageType } from "@/types/discord-chat";

import { DiscordReactions } from "./DiscordReactions";
import { DiscordSystemMessage } from "./DiscordSystemMessage";

type Props = {
  message: DiscordMessageType;
  compact?: boolean;
  botName?: string;
  botAvatar?: string;
  currentUserAvatar?: string;
  dense?: boolean;
  onReply?: (message: DiscordMessageType) => void;
  onReact?: (message: DiscordMessageType, emoji: string) => void;
};

function formatTime(date?: string) {
  if (!date) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(date));
}

function getSenderName(
  message: DiscordMessageType,
  botName?: string,
) {
  if (message.senderRole === "Bot") {
    return message.senderName || botName || "Otto Bot";
  }

  if (message.senderRole === "System") {
    return "Hệ thống";
  }

  return message.senderName || message.senderRole;
}

function getAvatar(
  message: DiscordMessageType,
  botAvatar?: string,
  currentUserAvatar?: string,
) {
  if (message.senderAvatar) return message.senderAvatar;
  if (message.senderRole === "Bot") return botAvatar || "";
  if (message.senderRole === "Member") return currentUserAvatar || "";
  return "";
}

function renderContent(content: string) {
  const urlPattern = /(?:https?:\/\/|www\.)[^\s]+/i;
  const parts = content.split(new RegExp(`(${urlPattern.source})`, "gi"));

  return parts.map((part, index) => {
    if (!part) return null;
    if (urlPattern.test(part)) {
      const href = part.startsWith("http") ? part : `https://${part}`;
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {part}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

export function DiscordMessage({
  message,
  compact = false,
  botName,
  botAvatar,
  currentUserAvatar,
  dense = false,
  onReply,
  onReact,
}: Props) {
  if (message.senderRole === "System") {
    return <DiscordSystemMessage content={message.content} />;
  }

  const senderName = getSenderName(message, botName);
  const avatar = getAvatar(message, botAvatar, currentUserAvatar);
  const time = formatTime(message.createdAt);
  const nameClass = dense ? "text-[16px] leading-[18px]" : "text-[18px] leading-[20px]";
  const timeClass = dense
    ? "text-[12px] leading-[15px]"
    : "translate-y-[2px] text-[14px] leading-[17px]";
  const textClass = dense
    ? "text-[15px] leading-[22px]"
    : "translate-y-[1px] text-[17px] leading-[26px]";
  const compactTextClass = dense
    ? "text-[15px] leading-[21px]"
    : "text-[17px] leading-[24px]";

  return (
  <div
    className={`group relative flex transition-colors hover:bg-white/[0.035] ${
      compact
        ? `${dense ? "min-h-[26px]" : "min-h-[30px]"} px-4`
        : `mb-[2px] ${dense ? "min-h-[40px]" : "min-h-[46px]"} gap-3 px-4`
    }`}
  >
    {/* AVATAR MODE */}
    {!compact && (
      <>
        {/* Avatar */}
        <div className={`${dense ? "h-10 w-9" : "h-[46px] w-10"} flex shrink-0 items-center justify-center`}>
          <div className={`${dense ? "h-9 w-9 translate-y-[7px]" : "h-10 w-10 translate-y-[10px]"} relative overflow-hidden rounded-full`}>
            {avatar ? (
              <Image
                src={avatar}
                alt={senderName}
                fill
                sizes={dense ? "36px" : "40px"}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-orange-500 text-sm font-black text-white">
                {senderName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={`${dense ? "mt-[5px] py-[2px]" : "mt-[8px] py-[3px]"} flex min-w-0 flex-1 flex-col justify-center self-center`}>
          {/* Header */}
          <div className="translate-y-[2px] mb-[4px] flex items-center gap-[10px] leading-none">
            <span className={`${nameClass} font-extrabold text-white`}>
              {senderName}
            </span>

            {time && (
              <span className={`${timeClass} font-medium text-neutral-500`}>
                {time}
              </span>
            )}
          </div>

          {/* Text */}
          {message.content && (
            <p className={`${textClass} whitespace-pre-wrap break-words text-neutral-200`}>
              {renderContent(message.content)}
            </p>
          )}
          <ChatAttachments attachments={message.attachments} />
          <DiscordReactions
            reactions={message.reactions}
            onReact={onReact ? (emoji) => onReact(message, emoji) : undefined}
          />
        </div>
      </>
    )}

    {/* COMPACT MODE */}
    {compact && (
      <>
        {/* Spacer */}
        <div className={`${dense ? "w-[48px]" : "w-[52px]"} shrink-0`} />

        {/* Compact content */}
        <div className={`${dense ? "min-h-[26px] py-[2px]" : "min-h-[30px] py-[3px]"} flex min-w-0 flex-1 flex-col justify-center self-center`}>
          {message.content && (
            <p className={`${compactTextClass} whitespace-pre-wrap break-words text-neutral-200`}>
              {renderContent(message.content)}
            </p>
          )}
          <ChatAttachments attachments={message.attachments} />
          <DiscordReactions
            reactions={message.reactions}
            onReact={onReact ? (emoji) => onReact(message, emoji) : undefined}
          />
        </div>
      </>
    )}

    {/* Actions */}
    {(onReply || onReact) && (
      <div className="absolute right-3 top-0 hidden items-center rounded-lg border border-white/10 bg-neutral-950 shadow-xl group-hover:flex">
        {onReply && (
          <button
            type="button"
            onClick={() => onReply(message)}
            className="grid h-8 w-8 place-items-center text-neutral-400 transition hover:text-white"
            title="Trả lời"
          >
            <MessageCircleReply size={17} />
          </button>
        )}

        {onReact && (
          <button
            type="button"
            onClick={() => onReact(message, "👍")}
            className="grid h-8 w-8 place-items-center text-neutral-400 transition hover:text-white"
            title="Thả cảm xúc"
          >
            <SmilePlus size={17} />
          </button>
        )}

        <MoreHorizontal className="mx-2 text-neutral-600" size={16} />
      </div>
    )}
  </div>
);
}
