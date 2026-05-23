"use client";

import { X } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  zIndexClassName?: string;
};

export function AppModal({
  open,
  title,
  children,
  onClose,
  zIndexClassName = "z-[200]",
}: Props) {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 ${zIndexClassName} flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm`}
    >
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[2rem] border border-orange-500/20 bg-[#151515] p-7">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-black text-white">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 transition hover:text-white"
          >
            <X size={28} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}