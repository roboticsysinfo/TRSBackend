const Story = require('../models/Story'); // adjust path if needed
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Make sure it's in .env

// Generate JWT
const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc Register Admin
const registerAdmin = async (req, res) => {
  try {
    const { name, phoneNumber, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    const admin = new Admin({ name, phoneNumber, email, password });
    await admin.save();

    return res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        token: generateToken(admin),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @desc Login Admin
const loginAdmin = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const admin = await Admin.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }]
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin not found' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        role: admin.role,
        token: generateToken(admin),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};


// @desc    Update story verification status
// @route   PATCH /api/admin/stories/:id/verify
// @access  Admin
const updateStoryStatus = async (req, res) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  try {
    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    story.isVerified = isVerified;
    await story.save();

    return res.status(200).json({
      success: true,
      message: `Story has been ${isVerified ? 'verified' : 'unverified'}.`,
      story,
    });
  } catch (error) {
    console.error('Error verifying story:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = {
  loginAdmin,
  registerAdmin,
  updateStoryStatus,
};
