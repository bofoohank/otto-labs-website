"use client";

import {
  Bot,
  Maximize2,
  MessageCircle,
  Minimize2,
  Package,
  Users,
} from "lucide-react";
import type { AdminTab } from "@/types/admin";

type Props = {
  activeTab: AdminTab;
  supportUnreadCount: number;
  onChangeTab: (tab: AdminTab) => void;
  onToggleMenu?: () => void;
  collapsed?: boolean;
};

export function AdminSidebar({
  activeTab,
  supportUnreadCount,
  onChangeTab,
  onToggleMenu,
  collapsed = false,
}: Props) {
  function sidebarButton(tab: AdminTab, label: string, icon: React.ReactNode) {
    const active = activeTab === tab;

    return (
      <button
        onClick={() => onChangeTab(tab)}
        title={label}
        className={`flex h-12 w-full items-center rounded-xl text-left text-sm font-black transition ${
          collapsed ? "justify-center px-0" : "gap-2 px-3"
        } ${
          active
            ? "bg-orange-500 text-white shadow-[0_0_35px_rgba(249,115,22,0.25)]"
            : "text-neutral-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        {icon}
        {!collapsed && label}
      </button>
    );
  }

  return (
    <aside
      className={`admin-menu-slide-in relative min-h-0 rounded-2xl border border-orange-500/20 bg-neutral-950 p-3 ${
        collapsed ? "" : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2 px-1 py-1">
        {!collapsed && (
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
            Menu
          </p>
        )}

        {onToggleMenu && (
          <button
            type="button"
            onClick={onToggleMenu}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-orange-500/30 bg-black text-orange-500 transition hover:bg-orange-500 hover:text-white ${
              collapsed ? "mx-auto" : "ml-auto"
            }`}
          >
            {collapsed ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        {sidebarButton("members", "Member", <Users size={20} />)}
        {sidebarButton("orders", "Đơn hàng", <Package size={20} />)}
        {sidebarButton("bot", "Setup", <Bot size={20} />)}

        <button
          onClick={() => onChangeTab("support")}
          title="Hỗ trợ khách hàng"
          className={`relative flex h-12 w-full items-center rounded-xl text-left text-sm font-black transition ${
            collapsed ? "justify-center px-0" : "gap-2 px-3"
          } ${
            activeTab === "support"
              ? "bg-orange-500 text-white shadow-[0_0_35px_rgba(249,115,22,0.25)]"
              : "text-neutral-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <MessageCircle size={20} />
          {!collapsed && "Hỗ trợ khách hàng"}

          {supportUnreadCount > 0 && (
            <span className={`${collapsed ? "absolute -right-1 -top-1" : "ml-auto"} grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white`}>
              {supportUnreadCount > 99 ? "99+" : supportUnreadCount}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
