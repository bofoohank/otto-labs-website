"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  sidebarCollapsed?: boolean;
};

export function AdminShell({
  sidebar,
  children,
  sidebarCollapsed = false,
}: Props) {
  const [uiScale, setUiScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      const widthScale = window.innerWidth / 1440;
      const heightScale = window.innerHeight / 900;
      setUiScale(Math.min(1, Math.max(0.72, Math.min(widthScale, heightScale))));
    }

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <main className="h-dvh overflow-hidden bg-black text-white">
      <div
        className="flex origin-top-left flex-col p-[clamp(6px,0.65vw,12px)]"
        style={{
          width: `${100 / uiScale}%`,
          height: `${100 / uiScale}%`,
          transform: `scale(${uiScale})`,
        }}
      >
        <div className="mb-2 flex h-[clamp(54px,8dvh,72px)] shrink-0 items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
              Otto Labs
            </p>

            <h1 className="text-[clamp(1.35rem,2.3vw,1.8rem)] font-black leading-tight">
              Admin Panel
            </h1>
          </div>

          <Link
            href="/"
            className="inline-flex h-10 shrink-0 items-center rounded-xl border border-orange-500/30 px-4 text-sm font-black text-orange-500 transition hover:bg-orange-500 hover:text-white"
          >
            Về trang chủ
          </Link>
        </div>

        <div
          className={`relative grid min-h-0 flex-1 gap-[clamp(6px,0.65vw,10px)] ${
            sidebarCollapsed
              ? "lg:grid-cols-[84px_1fr]"
              : "lg:grid-cols-[clamp(260px,16vw,320px)_1fr]"
          }`}
        >
          {sidebar}

          <section className="min-h-0 overflow-hidden rounded-2xl border border-orange-500/20 bg-neutral-950 p-[clamp(6px,0.65vw,8px)]">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
