"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

import { API_URL } from "@/lib/api";
import type { Ticket } from "@/types/admin";

type Props = {
  token: string;
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  setSelectedTicket: React.Dispatch<React.SetStateAction<Ticket | null>>;
  setOpenedTicket: React.Dispatch<React.SetStateAction<Ticket | null>>;
};

export function useAdminSocket({
  token,
  setTickets,
  setSelectedTicket,
  setOpenedTicket,
}: Props) {
  useEffect(() => {
    if (!token || !API_URL) return;

    const socket: Socket = io(API_URL, {
      transports: ["websocket"],
    });

    socket.emit("admin:join");

    function upsertTicket(ticket: Ticket) {
      setTickets((prev) => {
        const existed = prev.some((item) => item._id === ticket._id);

        if (existed) {
          return prev.map((item) =>
            item._id === ticket._id ? ticket : item,
          );
        }

        return [ticket, ...prev];
      });
    }

    function syncOpenedTicket(ticket: Ticket) {
      setSelectedTicket((current) =>
        current?._id === ticket._id ? ticket : current,
      );

      setOpenedTicket((current) =>
        current?._id === ticket._id ? ticket : current,
      );
    }

    socket.on("chat:new-ticket", (ticket: Ticket) => {
      upsertTicket(ticket);
      setSelectedTicket((current) => current || ticket);
    });

    socket.on("chat:updated", (ticket: Ticket) => {
      upsertTicket(ticket);
      syncOpenedTicket(ticket);
    });

    socket.on("ticket:assigned", (ticket: Ticket) => {
      upsertTicket(ticket);
      syncOpenedTicket(ticket);
    });

    socket.on("ticket:updated", (ticket: Ticket) => {
      upsertTicket(ticket);
      syncOpenedTicket(ticket);
    });

    socket.on("ticket:deleted", ({ ticketId }: { ticketId: string }) => {
      setTickets((prev) => prev.filter((item) => item._id !== ticketId));

      setSelectedTicket((current) =>
        current?._id === ticketId ? null : current,
      );

      setOpenedTicket((current) =>
        current?._id === ticketId ? null : current,
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [token, setTickets, setSelectedTicket, setOpenedTicket]);
}