const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../models/User");
const Admin = require("../models/Admin");

const authMiddleware = async (req, res, next) => {
  
  try {
    // ✅ Parse cookie from header
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided in cookie" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let currentUser = await Admin.findById(decoded.userId).select("-password");

    if (!currentUser) {
      currentUser = await User.findById(decoded.userId).select("-password");
    }

    if (!currentUser) {
      return res.status(401).json({ message: "User or Admin not found" });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
