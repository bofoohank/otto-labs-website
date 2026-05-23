"use client";

import { theme } from "@/constants/theme";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function AppInput({ className = "", ...props }: Props) {
  return (
    <input
      {...props}
      className={`${theme.input} ${className}`}
    />
  );
}