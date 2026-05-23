"use client";

type Props = {
  date?: string;
};

export function DiscordDateDivider({ date }: Props) {
  if (!date) return null;

  const label = new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

  return (
    <div className="my-3 flex items-center gap-3">
      <div className="h-px flex-1 bg-white/10" />

      <span className="text-[11px] font-black text-neutral-500">
        {label}
      </span>

      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}
