"use client";

import { AppFilter } from "@/components/ui/AppFilter";

type TicketStatus = "all" | "waiting" | "answered" | "closed";

type Props = {
  value: TicketStatus;
  onChange: (status: TicketStatus) => void;
  size?: "sm" | "md" | "lg";
};

const items = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ", value: "waiting" },
  { label: "Đã trả lời", value: "answered" },
  { label: "Đã đóng", value: "closed" },
] satisfies {
  label: string;
  value: TicketStatus;
}[];

export function TicketStatusFilter({ value, onChange, size = "md" }: Props) {
  return (
    <AppFilter<TicketStatus>
      value={value}
      items={items}
      onChange={onChange}
      size={size}
    />
  );
}