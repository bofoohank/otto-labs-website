"use client";

import { useState } from "react";
import type { ToastType } from "@/types/toast";

export type Toast = {
  id: number;
  type: ToastType;
  message: string;
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(type: ToastType, message: string) {
    const id = Date.now() + Math.random();

    setToasts((prev) => [
      ...prev,
      {
        id,
        type,
        message,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }

  return {
    toasts,
    showToast,
  };
}