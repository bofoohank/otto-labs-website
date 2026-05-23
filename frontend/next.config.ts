import type { NextConfig } from "next";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const rootEnvPath = path.resolve(configDir, "../.env");

function stripEnvQuotes(value: string) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

if (fs.existsSync(rootEnvPath)) {
  const rootEnv = fs.readFileSync(rootEnvPath, "utf8");

  rootEnv.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) return;

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = stripEnvQuotes(trimmed.slice(separatorIndex + 1));

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_FRONTEND_HOST:
      process.env.NEXT_PUBLIC_FRONTEND_HOST || "localhost",
    NEXT_PUBLIC_FRONTEND_PORT:
      process.env.NEXT_PUBLIC_FRONTEND_PORT || "3000",
    NEXT_PUBLIC_FRONTEND_URL:
      process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
    NEXT_PUBLIC_BACKEND_HOST:
      process.env.NEXT_PUBLIC_BACKEND_HOST || "localhost",
    NEXT_PUBLIC_BACKEND_PORT:
      process.env.NEXT_PUBLIC_BACKEND_PORT || "4000",
    NEXT_PUBLIC_BACKEND_URL:
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000",
  },
};

export default nextConfig;
