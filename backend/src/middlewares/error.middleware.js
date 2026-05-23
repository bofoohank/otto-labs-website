export function notFoundMiddleware(req, res, next) {
  return res.status(404).json({
    message: "Không tìm thấy API endpoint.",
  });
}

export function errorMiddleware(error, req, res, next) {
  console.error("API error:", error);

  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || error.status || 500;

  return res.status(statusCode).json({
    message: error.message || "Lỗi server.",
  });
}