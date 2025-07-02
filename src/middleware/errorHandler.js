const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: "Validation error", details: err.message });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired" });
  }


  if (req.originalUrl && !res.headersSent) {
    return res.status(404).json({ error: "Route not found" });
  }

  res.status(500).json({ error: "Internal server error" });
};

module.exports = errorHandler;
