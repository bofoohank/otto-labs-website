"use client";

import { X } from "lucide-react";

import type { DiscordReplyTo } from "@/types/discord-chat";

type Props = {
  replyTo: DiscordReplyTo | null;
  onCancel: () => void;
};

export function DiscordReplyPreview({ replyTo, onCancel }: Props) {
  if (!replyTo) return null;

  return (
    <div className="border-t border-white/10 bg-[#121212] px-4 py-2">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black px-3 py-2">
        <div className="min-w-0">
          <p className="text-xs font-black text-orange-400">
            Đang trả lời {replyTo.senderName}
          </p>

          <p className="truncate text-xs text-neutral-400">
            {replyTo.content || "Tin nhắn đính kèm"}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-neutral-500 transition hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}