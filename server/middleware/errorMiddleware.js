const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large" });
  }

  const statusCode = err.status || err.statusCode || 500;
  if (statusCode >= 500) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
  res.status(statusCode).json({ message: "Bad request" });
};

export default errorHandler;