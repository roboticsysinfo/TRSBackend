const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const adminAuthMiddleware = async (req, res, next) => {
  
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin only' });
    }

    req.admin = admin; // Attach admin to request
    next();
  } catch (err) {
    console.error('Admin auth error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = adminAuthMiddleware;
