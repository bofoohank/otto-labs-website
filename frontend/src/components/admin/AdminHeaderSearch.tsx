"use client";

import { Search, X } from "lucide-react";

type Props = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function AdminHeaderSearch({
  value,
  placeholder = "Tìm kiếm...",
  onChange,
}: Props) {
  return (
    <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-white/10 bg-black px-3 text-sm font-bold text-white transition focus-within:border-orange-500">
      <Search size={17} className="shrink-0 text-orange-500" />

      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-neutral-500"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="shrink-0 text-neutral-500 transition hover:text-orange-500"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
