"use client";

import { useEffect, useRef } from "react";

import type { DiscordSuggestion } from "@/types/discord-chat";

type Props = {
  title?: string;
  items: DiscordSuggestion[];
  loading?: boolean;
  dense?: boolean;
  onSelect: (suggestion: DiscordSuggestion) => void;
};

export function DiscordSuggestions({
  items,
  loading = false,
  dense = false,
  onSelect,
}: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    function handleWheel(e: WheelEvent) {
      if (!container) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      e.preventDefault();
      container.scrollLeft += e.deltaY * 2.8;
    }

    container.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className={`shrink-0 border-t border-white/10 bg-[#121212] px-4 ${dense ? "py-2" : "py-2.5"}`}>
      <div
        ref={scrollRef}
        className="otto-scrollbar flex gap-2 overflow-x-auto overflow-y-hidden pb-1"
      >
        {items.map((item) => (
          <button
            key={item._id || item.label}
            type="button"
            disabled={loading}
            onClick={() => onSelect(item)}
            className={`shrink-0 whitespace-nowrap rounded-xl border border-orange-500/25 bg-orange-500/10 px-3 text-xs font-black text-orange-400 transition hover:bg-orange-500 hover:text-white disabled:opacity-60 ${
              dense ? "py-1" : "py-1.5"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
