"use client";

import type { RefObject } from "react";
import Image from "next/image";
import { Camera, Crown, ShieldCheck } from "lucide-react";

import type { User } from "@/types/user";

type Props = {
  user: User;
  avatar: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onAvatarFile: (file: File, dataUrl?: string) => void;
};

export function ProfileSidebar({
  user,
  avatar,
  fileInputRef,
  onAvatarFile,
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

  return (
    <aside className="flex min-h-0 flex-col rounded-[1.5rem] border border-orange-500/20 bg-neutral-950 p-5">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative grid h-36 w-36 overflow-hidden rounded-[2rem] bg-orange-500 text-5xl font-black transition hover:scale-105"
        >
          {avatar ? (
            <Image
              src={avatar}
              alt="Avatar"
              fill
              sizes="144px"
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

        <div className="mt-5">
          <div className="flex items-center justify-center gap-3">
            {roleIcon()}
            <h1 className="text-3xl font-black">{user.name}</h1>
          </div>

          <p className="mt-2 text-neutral-400">@{user.username}</p>

          <div className="mt-5 inline-flex rounded-full border border-white/10 bg-black px-4 py-2 text-sm font-black text-neutral-300">
            {user.role || "Member"}
          </div>
        </div>
      </div>
    </aside>
  );
}
