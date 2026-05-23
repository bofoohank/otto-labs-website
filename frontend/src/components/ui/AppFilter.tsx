"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Filter } from "lucide-react";

type FilterSize = "sm" | "md" | "lg";

export type FilterItem<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  value: T;
  items: FilterItem<T>[];
  onChange: (value: T) => void;
  size?: FilterSize;
  className?: string;
};

const sizeClasses: Record<FilterSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function AppFilter<T extends string>({
  value,
  items,
  onChange,
  size = "md",
  className = "",
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const selectedItem = items.find((item) => item.value === value);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-orange-500 font-black text-white transition hover:bg-orange-400 ${sizeClasses[size]}`}
        title={selectedItem ? `Đang lọc: ${selectedItem.label}` : "Fillter"}
      >
        <Filter size={17} />
        {selectedItem?.label || "Tất cả"}
        <ChevronDown
          size={16}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-950 p-1 shadow-2xl">
          {items.map((item) => {
            const active = value === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
                className={`flex h-10 w-full items-center rounded-lg px-3 text-left text-sm font-black transition ${
                  active
                    ? "bg-orange-500 text-white"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
