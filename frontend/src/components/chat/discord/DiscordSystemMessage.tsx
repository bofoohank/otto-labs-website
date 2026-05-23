"use client";

type Props = {
  content?: string;
};

export function DiscordSystemMessage({ content }: Props) {
  if (!content) return null;

  return (
    <div className="my-2.5 flex items-center gap-3">
      <div className="h-px flex-1 bg-orange-500/20" />

      <p className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-[11px] font-black text-orange-300">
        {content}
      </p>

      <div className="h-px flex-1 bg-orange-500/20" />
    </div>
  );
}
