// frontend/src/components/ui/ToastStack.tsx

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import type { Toast } from "@/types/toast";

type ToastStackProps = {
  toasts: Toast[];
};

export function ToastStack({ toasts }: ToastStackProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex w-[calc(100vw-32px)] max-w-sm flex-col-reverse gap-3 sm:w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 24,
              scale: 0.96,
            }}
            className="flex items-start gap-3 rounded-2xl border border-orange-500/20 bg-[#151515] p-5 shadow-[0_0_45px_rgba(249,115,22,0.18)]"
          >
            <div>
              {toast.type === "success" ? (
                <CheckCircle className="text-green-400" size={24} />
              ) : toast.type === "error" ? (
                <XCircle className="text-red-400" size={24} />
              ) : (
                <CheckCircle className="text-orange-500" size={24} />
              )}
            </div>

            <p className="text-sm font-bold leading-6 text-white">
              {toast.message}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}