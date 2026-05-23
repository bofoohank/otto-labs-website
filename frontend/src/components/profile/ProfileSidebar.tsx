"use client";

import type { RefObject } from "react";
import Image from "next/image";
import {
  Camera,
  Crown,
  Package,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import type { User } from "@/types/user";

export type ProfileTab = "info" | "orders";

type Props = {
  user: User;
  avatar: string;
  activeTab: ProfileTab;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onAvatarFile: (file: File, dataUrl?: string) => void;
  onChangeTab: (tab: ProfileTab) => void;
};

export function ProfileSidebar({
  user,
  avatar,
  activeTab,
  fileInputRef,
  onAvatarFile,
  onChangeTab,
}: Props) {
  function roleIcon() {
    if (user.role === "Admin") {
      return <Crown className="text-orange-500" size={24} />;
    }

    if (user.role === "Mod") {
      return <ShieldCheck className="text-blue-400" size={24} />;
    }

    return null;
  }

  function sidebarButton(tab: ProfileTab, label: string, icon: React.ReactNode) {
    const active = activeTab === tab;

    return (
      <button
        type="button"
        onClick={() => onChangeTab(tab)}
        className={`flex h-12 w-full items-center gap-2 rounded-xl px-3 text-left text-sm font-black transition ${
          active
            ? "bg-orange-500 text-white shadow-[0_0_35px_rgba(249,115,22,0.25)]"
            : "text-neutral-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        {icon}
        {label}
      </button>
    );
  }

  return (
    <aside className="admin-menu-slide-in flex min-h-0 flex-col rounded-2xl border border-orange-500/20 bg-neutral-950 p-3">
      <div className="rounded-xl border border-white/10 bg-black p-4 text-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative mx-auto grid h-28 w-28 overflow-hidden rounded-2xl bg-orange-500 text-4xl font-black transition hover:scale-105"
        >
          {avatar ? (
            <Image
              src={avatar}
              alt="Avatar"
              fill
              sizes="112px"
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="m-auto">{user.name.charAt(0)}</span>
          )}

          <div className="absolute inset-0 grid place-items-center bg-black/55 opacity-0 transition group-hover:opacity-100">
            <Camera size={32} />
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              onAvatarFile(file);
            }

            e.target.value = "";
          }}
        />

        <div className="mt-4">
          <div className="flex items-center justify-center gap-3">
            {roleIcon()}
            <h1 className="min-w-0 truncate text-xl font-black">{user.name}</h1>
          </div>

          <p className="mt-1 truncate text-sm text-neutral-400">
            @{user.username}
          </p>

          <div className="mt-4 inline-flex rounded-full border border-white/10 bg-neutral-950 px-4 py-2 text-xs font-black text-neutral-300">
            {user.role || "Member"}
          </div>
        </div>
      </div>

      <div className="mt-3 px-1 py-1">
        <p className="mb-3 px-1 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
          Menu
        </p>

        <div className="space-y-1.5">
          {sidebarButton("info", "Thông tin", <UserRound size={20} />)}
          {sidebarButton("orders", "Đơn hàng", <Package size={20} />)}
        </div>
      </div>
    </aside>
  );
}
