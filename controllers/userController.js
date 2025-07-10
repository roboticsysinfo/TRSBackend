const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const cookie = require('cookie');


// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};


// POST /api/users/signup
exports.signup = async (req, res) => {
  try {
    const { name, phoneNumber, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
        data: null,
        error: null,
      });
    }

    const user = new User({ name, phoneNumber, email, password });
    await user.save();

    const token = generateToken(user._id);

    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    }));

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user, token },
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Signup failed',
      data: null,
      error: err.message,
    });
  }
};

// POST /api/users/signin
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        data: null,
        error: null,
      });
    }

    const token = generateToken(user._id);

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,        // Prevent JS access (secure)
        secure: process.env.NODE_ENV === 'production', // True in prod
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    );

    // Optional: Also send user in response body
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user, token },
      error: null,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Signin failed',
      data: null,
      error: err.message,
    });
  }
};


exports.logoutUser = (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // expires immediately
    })
  );

  res.status(200).json({ message: "Logged out successfully" });
};


// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ],
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-password") // Don't send password
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: {
        users,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Fetching users failed",
      data: null,
      error: err.message,
    });
  }
};



// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null,
        error: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Fetching user failed',
      data: null,
      error: err.message,
    });
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null,
        error: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Update failed',
      data: null,
      error: err.message,
    });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null,
        error: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: null,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      data: null,
      error: err.message,
    });
  }
};
