"use client";

import type { DiscordReaction } from "@/types/discord-chat";

type Props = {
  reactions?: DiscordReaction[];
  onReact?: (emoji: string) => void;
};

const quickEmojis = ["👍", "❤️", "😂", "😮"];

export function DiscordReactions({ reactions = [], onReact }: Props) {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5">
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          type="button"
          onClick={() => onReact?.(reaction.emoji)}
          className={`rounded-full border px-2 py-0.5 text-xs font-bold transition ${
            reaction.reacted
              ? "border-orange-500/50 bg-orange-500/20 text-orange-300"
              : "border-white/10 bg-white/5 text-neutral-300 hover:border-orange-500/40"
          }`}
        >
          {reaction.emoji} {reaction.count}
        </button>
      ))}

      {onReact && (
        <div className="hidden gap-1 group-hover:flex">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onReact(emoji)}
              className="rounded-full bg-white/5 px-1.5 py-0.5 text-xs transition hover:bg-white/10"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}