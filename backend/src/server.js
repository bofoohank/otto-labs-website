import dotenv from "dotenv";

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";

import { connectDatabase } from "./config/database.js";
import {
  BACKEND_HOST,
  BACKEND_PORT,
  FRONTEND_URL,
} from "./config/app-config.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middlewares/error.middleware.js";

dotenv.config({
  path: new URL("../../.env", import.meta.url),
});

const app = express();

const PORT = Number(process.env.PORT || BACKEND_PORT);
const HOST = process.env.HOST || BACKEND_HOST;
const allowedOrigins = Array.from(
  new Set(
    [
      process.env.FRONTEND_URL || FRONTEND_URL,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://0.0.0.0:3000",
    ].filter(Boolean),
  ),
);

function resolveCorsOrigin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error(`Origin ${origin} is not allowed by CORS.`));
}

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH"],
  },
});

connectDatabase();

app.use(
  cors({
    origin: resolveCorsOrigin,
  }),
);

app.use(express.json({ limit: "10mb" }));

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads")),
);

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  socket.on("user:join", (userId) => {
    if (userId) {
      socket.join(`user-${userId}`);
    }
  });

  socket.on("admin:join", () => {
    socket.join("admin-room");
  });

  socket.on("disconnect", () => {});
});

app.get("/", (req, res) => {
  res.json({
    message: "Otto Labs API running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
