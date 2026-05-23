"use client";

import { motion } from "framer-motion";

import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { AppModal } from "@/components/ui/AppModal";

type ForgotData = {
  identifier: string;
  code: string;
  newPassword: string;
};

type Props = {
  open: boolean;
  loading: boolean;
  showCodeInput: boolean;
  cooldown: number;
  forgotData: ForgotData;

  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeForgotData: (data: ForgotData) => void;
  onSendCode: () => void;
  onBackToLogin: () => void;
};

export function ForgotPasswordModal({
  open,
  loading,
  showCodeInput,
  cooldown,
  forgotData,
  onClose,
  onSubmit,
  onChangeForgotData,
  onSendCode,
  onBackToLogin,
}: Props) {
  return (
    <AppModal
      open={open}
      title="Quên mật khẩu"
      onClose={onClose}
      zIndexClassName="z-[220]"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AppInput
          type="text"
          placeholder="Tên đăng nhập / Gmail / Số điện thoại"
          required
          value={forgotData.identifier}
          onChange={(e) =>
            onChangeForgotData({
              ...forgotData,
              identifier: e.target.value,
            })
          }
        />

        <AppButton
          type="button"
          variant="outline"
          loading={loading}
          disabled={loading || !forgotData.identifier || cooldown > 0}
          className="flex w-full items-center justify-center gap-3"
          onClick={onSendCode}
        >
          {cooldown > 0 ? `Gửi lại mã sau ${cooldown}s` : "Gửi mã đặt lại mật khẩu"}
        </AppButton>

        {showCodeInput && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="space-y-4"
          >
            <AppInput
              type="text"
              placeholder="Mã xác nhận"
              required
              value={forgotData.code}
              onChange={(e) =>
                onChangeForgotData({
                  ...forgotData,
                  code: e.target.value,
                })
              }
            />

            <AppInput
              type="password"
              placeholder="Mật khẩu mới"
              required
              value={forgotData.newPassword}
              onChange={(e) =>
                onChangeForgotData({
                  ...forgotData,
                  newPassword: e.target.value,
                })
              }
            />

            <AppButton
              type="submit"
              loading={loading}
              className="flex w-full items-center justify-center gap-3"
            >
              Đặt lại mật khẩu
            </AppButton>
          </motion.div>
        )}

        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full text-sm font-bold text-neutral-400 transition hover:text-orange-500"
        >
          Quay lại đăng nhập
        </button>
      </form>
    </AppModal>
  );
}