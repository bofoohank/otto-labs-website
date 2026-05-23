"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import type { User } from "@/types/user";
import type { ProfilePayload } from "@/services/profile.service";

type Props = {
  user: User;
  loading: boolean;

  formData: ProfilePayload;
  onChangeFormData: (data: ProfilePayload) => void;

  sendingEmailCode: boolean;
  sendingPhoneCode: boolean;

  showEmailCodeInput: boolean;
  showPhoneCodeInput: boolean;

  emailCooldown: number;
  phoneCooldown: number;

  emailCode: string;
  phoneCode: string;

  onChangeEmailCode: (value: string) => void;
  onChangePhoneCode: (value: string) => void;

  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

  onSendEmailCode: () => void;
  onVerifyEmailCode: () => void;

  onSendPhoneCode: () => void;
  onVerifyPhoneCode: () => void;
};

export function ProfileForm({
  user,
  loading,
  formData,
  onChangeFormData,
  sendingEmailCode,
  sendingPhoneCode,
  showEmailCodeInput,
  showPhoneCodeInput,
  emailCooldown,
  phoneCooldown,
  emailCode,
  phoneCode,
  onChangeEmailCode,
  onChangePhoneCode,
  onSubmit,
  onSendEmailCode,
  onVerifyEmailCode,
  onSendPhoneCode,
  onVerifyPhoneCode,
}: Props) {
  return (
    <section className="min-h-0 overflow-hidden rounded-[1.5rem] border border-orange-500/20 bg-neutral-950">
      <form onSubmit={onSubmit} className="flex h-full flex-col p-5">
        <div className="shrink-0 border-b border-white/10 pb-4">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">
            Hồ sơ cá nhân
          </p>

          <h2 className="mt-1 text-3xl font-black">
            Thông tin tài khoản
          </h2>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto py-5 pr-1">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-black text-neutral-400">
                Tên
              </label>

              <input
                placeholder="Tên"
                value={formData.name}
                onChange={(e) =>
                  onChangeFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none transition focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-neutral-400">
                Tên đăng nhập
              </label>

              <input
                disabled
                value={user.username}
                className="w-full cursor-not-allowed rounded-2xl border border-white/10 bg-neutral-900 px-5 py-4 text-neutral-500 outline-none"
              />
            </div>
          </div>

          <VerifyField
            label="Gmail"
            verified={!!user.emailVerified}
            value={formData.email}
            placeholder="Gmail"
            codeValue={emailCode}
            codePlaceholder="Nhập mã Gmail"
            showCodeInput={showEmailCodeInput}
            sending={sendingEmailCode}
            cooldown={emailCooldown}
            onChangeValue={(value) =>
              onChangeFormData({
                ...formData,
                email: value,
              })
            }
            onSendCode={onSendEmailCode}
            onChangeCode={onChangeEmailCode}
            onVerifyCode={onVerifyEmailCode}
          />

          <VerifyField
            label="Số điện thoại"
            verified={!!user.phoneVerified}
            value={formData.phone}
            placeholder="Số điện thoại"
            codeValue={phoneCode}
            codePlaceholder="Nhập mã SĐT"
            showCodeInput={showPhoneCodeInput}
            sending={sendingPhoneCode}
            cooldown={phoneCooldown}
            onChangeValue={(value) =>
              onChangeFormData({
                ...formData,
                phone: value,
              })
            }
            onSendCode={onSendPhoneCode}
            onChangeCode={onChangePhoneCode}
            onVerifyCode={onVerifyPhoneCode}
          />
        </div>

        <div className="shrink-0 border-t border-white/10 pt-4">
          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-4 font-black text-white transition hover:bg-orange-400 disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin" />}
            Lưu
          </button>
        </div>
      </form>
    </section>
  );
}

type VerifyFieldProps = {
  label: string;
  verified: boolean;

  value: string;
  placeholder: string;

  codeValue: string;
  codePlaceholder: string;

  showCodeInput: boolean;
  sending: boolean;
  cooldown: number;

  onChangeValue: (value: string) => void;
  onSendCode: () => void;

  onChangeCode: (value: string) => void;
  onVerifyCode: () => void;
};

function VerifyField({
  label,
  verified,
  value,
  placeholder,
  codeValue,
  codePlaceholder,
  showCodeInput,
  sending,
  cooldown,
  onChangeValue,
  onSendCode,
  onChangeCode,
  onVerifyCode,
}: VerifyFieldProps) {
  return (
    <div>
      <label className="mb-2 flex items-center justify-between text-sm font-black text-neutral-400">
        <span>{label}</span>

        <span className={verified ? "text-green-400" : "text-orange-500"}>
          {verified ? "Đã xác nhận" : "Chưa xác nhận"}
        </span>
      </label>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeValue(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none transition focus:border-orange-500"
        />

        <button
          type="button"
          onClick={onSendCode}
          disabled={sending || cooldown > 0}
          className="rounded-2xl bg-orange-500 px-5 py-4 font-black text-white transition hover:bg-orange-400 disabled:opacity-60"
        >
          {sending
            ? "Đang gửi..."
            : cooldown > 0
              ? `Gửi lại sau ${cooldown}s`
              : "Gửi mã"}
        </button>
      </div>

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
          className="mt-3 grid gap-3 lg:grid-cols-[1fr_auto]"
        >
          <input
            placeholder={codePlaceholder}
            value={codeValue}
            onChange={(e) => onChangeCode(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none transition focus:border-orange-500"
          />

          <button
            type="button"
            onClick={onVerifyCode}
            className="rounded-2xl border border-orange-500/30 px-5 py-4 font-black text-orange-500 transition hover:bg-orange-500 hover:text-white"
          >
            Xác nhận
          </button>
        </motion.div>
      )}
    </div>
  );
}