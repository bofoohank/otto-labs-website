"use client";

type Props = {
  icon: React.ReactNode;
  title: string;

  center?: React.ReactNode;

  toolbar?: React.ReactNode;
};

export function AdminTabHeader({
  icon,
  title,
  center,
  toolbar,
}: Props) {
  return (
    <div className="shrink-0 border-b border-white/10">
      {/* HEADER */}
      <div className="grid min-h-[44px] grid-cols-1 items-center gap-2 pb-[5px] xl:grid-cols-[1fr_minmax(320px,560px)]">
        <div className="flex min-w-0 items-center gap-2">
          <div className="shrink-0 text-orange-500">
            {icon}
          </div>

          <h2 className="truncate text-xl font-black leading-tight text-white">
            {title}
          </h2>
        </div>

        <div className="flex min-w-0 justify-start xl:justify-end">
          {center}
        </div>
      </div>

      {/* TOOLBAR */}
      {toolbar && (
        <div className="flex min-h-[40px] items-center justify-between gap-2 border-t border-white/5 py-1.5">
          {toolbar}
        </div>
      )}
    </div>
  );
}
