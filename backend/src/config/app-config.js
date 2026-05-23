import fs from "fs";

const configUrl = new URL("../../../app.config.json", import.meta.url);
const appConfig = JSON.parse(fs.readFileSync(configUrl, "utf8"));

export const FRONTEND_HOST = appConfig.frontend.host;
export const FRONTEND_PORT = appConfig.frontend.port;
export const FRONTEND_URL = appConfig.frontend.url;

export const BACKEND_HOST = appConfig.backend.host;
export const BACKEND_PORT = appConfig.backend.port;
export const BACKEND_URL = appConfig.backend.url;
