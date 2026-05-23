export const FRONTEND_HOST =
  process.env.NEXT_PUBLIC_FRONTEND_HOST || "localhost";
export const FRONTEND_PORT = Number(process.env.NEXT_PUBLIC_FRONTEND_PORT || 3000);
export const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export const BACKEND_HOST =
  process.env.NEXT_PUBLIC_BACKEND_HOST || "localhost";
export const BACKEND_PORT = Number(process.env.NEXT_PUBLIC_BACKEND_PORT || 4000);
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
