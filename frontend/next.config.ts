import type { NextConfig } from "next";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const appConfigPath = path.resolve(configDir, "../app.config.json");
const appConfig = JSON.parse(fs.readFileSync(appConfigPath, "utf8"));

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_FRONTEND_HOST:
      process.env.NEXT_PUBLIC_FRONTEND_HOST || appConfig.frontend.host,
    NEXT_PUBLIC_FRONTEND_PORT:
      process.env.NEXT_PUBLIC_FRONTEND_PORT || String(appConfig.frontend.port),
    NEXT_PUBLIC_FRONTEND_URL:
      process.env.NEXT_PUBLIC_FRONTEND_URL || appConfig.frontend.url,
    NEXT_PUBLIC_BACKEND_HOST:
      process.env.NEXT_PUBLIC_BACKEND_HOST || appConfig.backend.host,
    NEXT_PUBLIC_BACKEND_PORT:
      process.env.NEXT_PUBLIC_BACKEND_PORT || String(appConfig.backend.port),
    NEXT_PUBLIC_BACKEND_URL:
      process.env.NEXT_PUBLIC_BACKEND_URL || appConfig.backend.url,
  },
};

export default nextConfig;
