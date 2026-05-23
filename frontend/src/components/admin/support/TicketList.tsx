"use client";

import Image from "next/image";

import type { Ticket } from "@/types/admin";

type Props = {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  onSelectTicket: (ticket: Ticket) => void;
};

function statusLabel(status: string) {
  if (status === "waiting") return "Chờ";
  if (status === "answered") return "Đã trả lời";
  return "Đã đóng";
}

function statusClass(status: string) {
  if (status === "waiting") {
    return "border-blue-500/40 bg-blue-500/10 text-blue-400";
  }

  if (status === "answered") {
    return "border-green-500/40 bg-green-500/10 text-green-400";
  }

  return "border-white/10 bg-white/5 text-neutral-400";
}

function getTicketTime(ticket: Ticket) {
  const date = ticket.updatedAt || ticket.createdAt;

  if (!date) return "";

  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.max(Math.floor(diff / 60000), 1);

  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} giờ trước`;

  return `${Math.floor(hours / 24)} ngày trước`;
}

export function TicketList({
  tickets,
  selectedTicket,
  onSelectTicket,
}: Props) {
  if (tickets.length === 0) {
    return (
      <div className="grid min-h-0 place-items-center rounded-2xl border border-white/10 bg-black p-4 text-center text-sm font-bold text-neutral-500">
        Không có ticket phù hợp.
      </div>
    );
  }

  return (
    <div className="min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-black">
      <div className="otto-scrollbar h-full overflow-y-auto">
        {tickets.map((ticket) => {
          const active = selectedTicket?._id === ticket._id;
          const user = ticket.userId || ticket.user || {};
          const hasUnread = ticket.unreadForStaff > 0;

          return (
            <button
              key={ticket._id}
              type="button"
              onClick={() => onSelectTicket(ticket)}
              className={`block w-full border-b border-white/10 p-3 text-left transition last:border-b-0 ${
                active ? "bg-white/10" : "bg-black hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-orange-500 text-base font-black text-white">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      sizes="40px"
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0) || "U"
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-black text-white">
                          {user.name || "Người dùng"}
                        </h3>

                        {hasUnread && (
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.85)]" />
                        )}
                      </div>

                      <p className="mt-1 truncate text-xs text-neutral-400">
                        Ticket #{ticket.ticketCode || ticket._id}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end justify-center gap-1.5">
                      <span className="text-xs font-bold text-neutral-500">
                        {getTicketTime(ticket)}
                      </span>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-black ${statusClass(
                          ticket.status,
                        )}`}
                      >
                        {statusLabel(ticket.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
