export function success(res, data = {}, message = "Thành công.", statusCode = 200) {
  return res.status(statusCode).json({
    message,
    ...data,
  });
}

export function created(res, data = {}, message = "Tạo thành công.") {
  return success(res, data, message, 201);
}