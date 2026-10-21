const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  if (statusCode >= 500) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
  res.status(statusCode).json({ message: "Bad request" });
};

export default errorHandler;