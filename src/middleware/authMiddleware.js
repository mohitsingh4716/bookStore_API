const jwt = require("jsonwebtoken");
const { readJSON } = require("../utils/fileHandler");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    // console.log("Auth Header:", authHeader);

    const token = authHeader?.replace("Bearer ", "");
    // console.log("Token:", token);

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const users = await readJSON("users.json");
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid token. User not found." });
    }

    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = authMiddleware;
