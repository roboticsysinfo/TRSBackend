const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../models/User");
const Admin = require("../models/Admin");

const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    // 🔍 First: Try token from Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 🔍 Second: Try token from cookies
    if (!token) {
      const cookies = cookie.parse(req.headers.cookie || "");
      token = cookies.token;
    }

    // ❌ No token found
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔁 Try finding Admin first
    const admin = await Admin.findById(decoded.id).select("-password");
    if (admin) {
      req.admin = admin;
      return next();
    }

    // 🔁 Fallback to User
    const user = await User.findById(decoded.userId).select("-password");
    if (user) {
      req.user = user;
      return next();
    }

    return res.status(401).json({ message: "User or Admin not found" });
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
