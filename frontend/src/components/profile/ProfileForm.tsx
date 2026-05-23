"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import type { User } from "@/types/user";
import type {
  PasswordPayload,
  ProfilePayload,
} from "@/services/profile.service";

type Props = {
  user: User;

  formData: ProfilePayload;
  onChangeFormData: (data: ProfilePayload) => void;
  passwordData: PasswordPayload;
  passwordLoading: boolean;
  onChangePasswordData: (data: PasswordPayload) => void;

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
  onSubmitPassword: (e: React.FormEvent<HTMLFormElement>) => void;

  onSendEmailCode: () => void;
  onVerifyEmailCode: () => void;

  onSendPhoneCode: () => void;
  onVerifyPhoneCode: () => void;
};

export function ProfileForm({
  user,
  formData,
  onChangeFormData,
  passwordData,
  passwordLoading,
  onChangePasswordData,
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
  onSubmitPassword,
  onSendEmailCode,
  onVerifyEmailCode,
  onSendPhoneCode,
  onVerifyPhoneCode,
}: Props) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-black p-4">
      <form id="profile-info-form" onSubmit={onSubmit} className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
            Tài khoản
          </p>
          <h3 className="mt-1 text-lg font-black text-white">
            Thông tin đăng nhập
          </h3>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-black text-neutral-400">
              Tên hiển thị
            </label>

            <input
              placeholder="Tên hiển thị"
              value={formData.name}
              onChange={(e) =>
                onChangeFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-neutral-400">
              Tên đăng nhập
            </label>

            <input
              disabled
              value={user.username}
              className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-neutral-500 outline-none"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
              Liên hệ
            </p>
            <h3 className="mt-1 text-lg font-black text-white">
              Xác thực tài khoản
            </h3>
          </div>

          <p className="text-xs font-bold text-neutral-500">
            Gmail và số điện thoại dùng để nhận cập nhật đơn hàng.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
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
      </section>

      <section className="rounded-2xl border border-white/10 bg-neutral-950 p-4">
        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
            Nhận hàng
          </p>
          <h3 className="mt-1 text-lg font-black text-white">
            Địa chỉ giao hàng
          </h3>
        </div>

        <label className="mb-2 block text-sm font-black text-neutral-400">
          Địa chỉ nhận hàng
        </label>

        <textarea
          rows={4}
          placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
          value={formData.address}
          onChange={(e) =>
            onChangeFormData({
              ...formData,
              address: e.target.value,
            })
          }
          className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-orange-500"
        />
      </section>
      </form>

      <form
        onSubmit={onSubmitPassword}
        className="rounded-2xl border border-white/10 bg-neutral-950 p-4"
      >
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
              Bảo mật
            </p>
            <h3 className="mt-1 text-lg font-black text-white">
              Đổi mật khẩu
            </h3>
          </div>

          <p className="text-xs font-bold text-neutral-500">
            Mật khẩu mới tối thiểu 6 ký tự.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <PasswordField
            label="Mật khẩu cũ"
            value={passwordData.currentPassword}
            onChange={(value) =>
              onChangePasswordData({
                ...passwordData,
                currentPassword: value,
              })
            }
          />

          <PasswordField
            label="Mật khẩu mới"
            value={passwordData.newPassword}
            onChange={(value) =>
              onChangePasswordData({
                ...passwordData,
                newPassword: value,
              })
            }
          />

          <PasswordField
            label="Nhập lại mật khẩu mới"
            value={passwordData.confirmPassword}
            onChange={(value) =>
              onChangePasswordData({
                ...passwordData,
                confirmPassword: value,
              })
            }
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={passwordLoading}
            className="flex h-11 items-center justify-center rounded-xl border border-orange-500/30 px-5 text-sm font-black text-orange-500 transition hover:bg-orange-500 hover:text-white disabled:opacity-60"
          >
            {passwordLoading && (
              <Loader2 className="mr-2 animate-spin" size={18} />
            )}
            Đổi mật khẩu
          </button>
        </div>
      </form>
    </div>
  );
}

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function PasswordField({ label, value, onChange }: PasswordFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-neutral-400">
        {label}
      </label>

      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-orange-500"
      />
    </div>
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
    <div className="rounded-xl border border-white/10 bg-black p-3">
      <label className="mb-2 flex items-center justify-between text-sm font-black text-neutral-400">
        <span>{label}</span>

        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] ${
            verified
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-orange-500/30 bg-orange-500/10 text-orange-400"
          }`}
        >
          {verified ? "Đã xác nhận" : "Chưa xác nhận"}
        </span>
      </label>

      <div className="grid gap-2 xl:grid-cols-[1fr_auto]">
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeValue(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-orange-500"
        />

        <button
          type="button"
          onClick={onSendCode}
          disabled={sending || cooldown > 0}
          className="h-12 rounded-xl bg-orange-500 px-4 text-sm font-black text-white transition hover:bg-orange-400 disabled:opacity-60"
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
          className="mt-2 grid gap-2 xl:grid-cols-[1fr_auto]"
        >
          <input
            placeholder={codePlaceholder}
            value={codeValue}
            onChange={(e) => onChangeCode(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-orange-500"
          />

          <button
            type="button"
            onClick={onVerifyCode}
            className="h-12 rounded-xl border border-orange-500/30 px-4 text-sm font-black text-orange-500 transition hover:bg-orange-500 hover:text-white"
          >
            Xác nhận
          </button>
        </motion.div>
      )}
    </div>
  );
}
