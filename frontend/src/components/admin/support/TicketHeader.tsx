"use client";

import { useEffect, useRef, useState } from "react";
import {
  EllipsisVertical,
  Eye,
  Maximize2,
  Trash2,
  UserPlus,
} from "lucide-react";

import type { Ticket } from "@/types/admin";

type Props = {
  selectedTicket: Ticket;
  openedTicket: Ticket | null;
  onAssignTicket: (ticket: Ticket) => void;
  onOpenTicket: (ticket: Ticket) => void;
  onOpenFullChat?: () => void;
  onCloseTicket: () => void;
};

export function TicketHeader({
  selectedTicket,
  openedTicket,
  onAssignTicket,
  onOpenTicket,
  onOpenFullChat,
  onCloseTicket,
}: Props) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const user = selectedTicket.userId || selectedTicket.user || {};
  const ticketCode = selectedTicket.ticketCode || selectedTicket._id;

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div className="shrink-0 border-b border-white/10 px-4 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-black text-white">
            Ticket #{ticketCode} • {user.name || "Người dùng"}
          </h3>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {!selectedTicket.assignedTo && (
            <button
              type="button"
              onClick={() => onAssignTicket(selectedTicket)}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-orange-500/30 px-3 text-xs font-black text-neutral-300 transition hover:bg-orange-500 hover:text-white"
            >
              <UserPlus size={16} />
              Giao cho tôi
            </button>
          )}

          {selectedTicket.assignedTo && !openedTicket && (
            <button
              type="button"
              onClick={() => onOpenTicket(selectedTicket)}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-orange-500 px-3 text-xs font-black text-white transition hover:bg-orange-400"
            >
              <Eye size={16} />
              Mở ticket
            </button>
          )}

          <button
            type="button"
            onClick={onCloseTicket}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-red-500/30 px-3 text-xs font-black text-red-400 transition hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={16} />
            Đóng ticket
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu((current) => !current)}
              className="grid h-9 w-9 place-items-center rounded-xl text-neutral-500 transition hover:bg-white/5 hover:text-white"
            >
              <EllipsisVertical size={18} />
            </button>

            {openMenu && onOpenFullChat && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-44 overflow-hidden rounded-xl border border-white/10 bg-neutral-950 p-1 shadow-2xl">
                <button
                  type="button"
                  onClick={() => {
                    onOpenFullChat();
                    setOpenMenu(false);
                  }}
                  className="flex h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-xs font-black text-neutral-300 transition hover:bg-white/5 hover:text-white"
                >
                  <Maximize2 size={15} />
                  Mở full chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
