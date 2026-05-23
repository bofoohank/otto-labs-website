export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: number;
  type: ToastType;
  message: string;
};