"use client";

import { theme } from "@/constants/theme";

type Props =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function AppTextarea({
  className = "",
  ...props
}: Props) {
  return (
    <textarea
      {...props}
      className={`${theme.input} ${className}`}
    />
  );
}