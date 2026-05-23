"use client";

import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { AppModal } from "@/components/ui/AppModal";

type AuthFormData = {
  name: string;
  username: string;
  email: string;
  phone: string;
  referralCode: string;
  identifier: string;
  password: string;
};

type Props = {
  open: boolean;
  isLogin: boolean;
  loading: boolean;
  message: string;
  formData: AuthFormData;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeForm: (data: AuthFormData) => void;
  onToggleMode: () => void;
  onForgotPassword: () => void;
};

export function AuthModal({
  open,
  isLogin,
  loading,
  message,
  formData,
  onClose,
  onSubmit,
  onChangeForm,
  onToggleMode,
  onForgotPassword,
}: Props) {
  return (
    <AppModal
      open={open}
      title={isLogin ? "Đăng nhập" : "Đăng ký"}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {isLogin ? (
          <AppInput
            type="text"
            placeholder="Tên đăng nhập / Gmail / Số điện thoại"
            required
            value={formData.identifier}
            onChange={(e) =>
              onChangeForm({
                ...formData,
                identifier: e.target.value,
              })
            }
          />
        ) : (
          <>
            <AppInput
              type="text"
              placeholder="Họ tên"
              required
              value={formData.name}
              onChange={(e) =>
                onChangeForm({
                  ...formData,
                  name: e.target.value,
                })
              }
            />

            <AppInput
              type="text"
              placeholder="Tên đăng nhập"
              required
              value={formData.username}
              onChange={(e) =>
                onChangeForm({
                  ...formData,
                  username: e.target.value,
                })
              }
            />

            <AppInput
              type="email"
              placeholder="Gmail"
              required
              value={formData.email}
              onChange={(e) =>
                onChangeForm({
                  ...formData,
                  email: e.target.value,
                })
              }
            />

            <AppInput
              type="tel"
              placeholder="Số điện thoại (Không bắt buộc)"
              value={formData.phone}
              onChange={(e) =>
                onChangeForm({
                  ...formData,
                  phone: e.target.value,
                })
              }
            />

            <AppInput
              type="text"
              placeholder="Mã giới thiệu (Không bắt buộc)"
              value={formData.referralCode}
              onChange={(e) =>
                onChangeForm({
                  ...formData,
                  referralCode: e.target.value,
                })
              }
            />
          </>
        )}

        <AppInput
          type="password"
          placeholder="Mật khẩu"
          required
          value={formData.password}
          onChange={(e) =>
            onChangeForm({
              ...formData,
              password: e.target.value,
            })
          }
        />

        {message && (
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm font-bold text-orange-400">
            {message}
          </div>
        )}

        <AppButton
          type="submit"
          loading={loading}
          className="flex w-full items-center justify-center gap-3"
        >
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </AppButton>

        {isLogin && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="w-full text-sm font-bold text-orange-500 transition hover:text-orange-400"
          >
            Quên mật khẩu?
          </button>
        )}

        <button
          type="button"
          onClick={onToggleMode}
          className="w-full text-sm font-bold text-neutral-400 transition hover:text-orange-500"
        >
          {isLogin
            ? "Chưa có tài khoản? Đăng ký"
            : "Đã có tài khoản? Đăng nhập"}
        </button>
      </form>
    </AppModal>
  );
}