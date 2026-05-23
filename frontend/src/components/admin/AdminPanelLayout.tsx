"use client";

import { AdminTabHeader } from "./AdminTabHeader";

type Props = {
  icon: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
};

export function AdminPanelLayout({
  icon,
  title,
  actions,
  children,
  contentClassName = "",
}: Props) {
  return (
    <div className="flex h-full flex-col">
      <AdminTabHeader icon={icon} title={title} center={actions} />

      <div
        className={`min-h-0 flex-1 overflow-y-auto pr-1 pt-2 ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
