"use client";

import { Loader2 } from "lucide-react";

import { theme } from "@/constants/theme";

type Variant =
  | "primary"
  | "outline"
  | "pill"
  | "outline-pill";

type Props =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
    variant?: Variant;
  };

export function AppButton({
  children,
  className = "",
  loading,
  variant = "primary",
  ...props
}: Props) {
  const variantClass =
    variant === "outline"
      ? theme.outlineButton
      : variant === "pill"
        ? theme.pillButton
        : variant === "outline-pill"
          ? theme.outlinePill
          : theme.button;

  return (
    <button
      {...props}
      className={`${variantClass} ${className}`}
    >
      {loading && (
        <Loader2 className="animate-spin" size={18} />
      )}

      {children}
    </button>
  );
}

/*Áp dụng AppButton, AppInput, AppTextarea vào các form trong ứng dụng để đảm bảo tính nhất quán về giao diện và trải nghiệm người dùng. Ví dụ, trong form đăng nhập hoặc đăng ký, thay vì sử dụng thẻ button, input, textarea mặc định, hãy thay thế bằng AppButton, AppInput và AppTextarea để tận dụng các kiểu dáng và trạng thái đã được định nghĩa sẵn trong theme. Điều này sẽ giúp giao diện của bạn trở nên chuyên nghiệp hơn và dễ dàng bảo trì hơn trong tương lai.*/