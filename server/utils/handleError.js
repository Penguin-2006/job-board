const handleError = (res, error) => {
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ message });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid input" });
  }
  console.error(error);
  res.status(500).json({ message: "Server error" });
};

export default handleError;