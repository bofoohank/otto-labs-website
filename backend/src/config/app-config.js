import dotenv from "dotenv";

dotenv.config({
  path: new URL("../../../.env", import.meta.url),
});

export const FRONTEND_HOST = process.env.FRONTEND_HOST || "localhost";
export const FRONTEND_PORT = Number(process.env.FRONTEND_PORT || 3000);
export const FRONTEND_URL =
  process.env.FRONTEND_URL || `http://${FRONTEND_HOST}:${FRONTEND_PORT}`;

export const BACKEND_HOST = process.env.HOST || process.env.BACKEND_HOST || "localhost";
export const BACKEND_PORT = Number(process.env.PORT || process.env.BACKEND_PORT || 4000);
export const BACKEND_URL =
  process.env.BACKEND_URL || `http://${BACKEND_HOST}:${BACKEND_PORT}`;
