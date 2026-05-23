"use client";

import Link from "next/link";
import { Crown, ShieldCheck } from "lucide-react";
import type { User } from "@/types/user";

type Props = {
  user: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
};

export function Header({ user, onOpenLogin, onLogout }: Props) {
  function roleIcon() {
    if (user?.role === "Admin") {
      return <Crown className="text-orange-500" size={20} />;
    }

    if (user?.role === "Mod") {
      return <ShieldCheck className="text-blue-400" size={20} />;
    }

    return null;
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-orange-500/10 bg-black/80 px-6 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a
          href="#"
          className="inline-flex items-center text-2xl font-black leading-none tracking-[-0.05em]"
        >
          <span className="text-white">Otto</span>
          <span className="-ml-1 translate-y-[1px] text-orange-500">
            Labs
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-neutral-400 md:flex">
          <a href="#dichvu" className="transition hover:text-orange-500">
            Dịch vụ
          </a>

          <a href="#vatlieu" className="transition hover:text-orange-500">
            Vật liệu
          </a>

          <a href="#quytrinh" className="transition hover:text-orange-500">
            Quy trình
          </a>

          <a href="#lienhe" className="transition hover:text-orange-500">
            Liên hệ
          </a>
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-sm font-bold text-white md:flex">
              {roleIcon()}
              Xin chào, {user.name}
            </span>

            <Link
              href="/profile"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-orange-500/30 px-5 text-sm font-black text-orange-500 transition hover:bg-orange-500 hover:text-white"
            >
              Trang cá nhân
            </Link>

            {(user.role === "Mod" || user.role === "Admin") && (
              <Link
                href="/admin"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-blue-500/30 px-5 text-sm font-black text-blue-400 transition hover:bg-blue-500 hover:text-white"
              >
                Panel
              </Link>
            )}

            <button
              onClick={onLogout}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-orange-500 px-5 text-sm font-black text-white transition hover:bg-orange-400"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-orange-500 px-5 text-sm font-black text-white transition hover:bg-orange-400"
          >
            Đăng kí / Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}
