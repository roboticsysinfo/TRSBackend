const Company = require('../models/Company');


exports.createCompany = async (req, res) => {

  try {
    
    const userId = req.user.id;

    console.log("userid", userId)

    // Check if user already listed a company
    const existing = await Company.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already listed a company',
        data: null,
        error: null,
      });
    }

    const newCompany = await Company.create({
      ...req.body,
      user: userId,
    });

    res.status(201).json({
      success: true,
      message: 'Company listed successfully',
      data: newCompany,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to list company',
      data: null,
      error: err.message,
    });
  }
};


// Get All Companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('user category');

    res.status(200).json({
      success: true,
      message: 'Companies fetched successfully',
      data: companies,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch companies',
      data: null,
      error: err.message,
    });
  }
};

// Update Company by ID
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
        data: null,
        error: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: company,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update company',
      data: null,
      error: err.message,
    });
  }
};

// Delete Company
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
        data: null,
        error: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
      data: null,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete company',
      data: null,
      error: err.message,
    });
  }
};

// Get Company by User ID
exports.getCompanyByUserId = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.params.userId }).populate('category user');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found for this user',
        data: null,
        error: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company fetched successfully',
      data: company,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company by user ID',
      data: null,
      error: err.message,
    });
  }
};

// Get Company by Company ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('category user');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
        data: null,
        error: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company fetched successfully',
      data: company,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company by ID',
      data: null,
      error: err.message,
    });
  }
};


// ✅ Verify a Company by ID (Set isVerified: true)
exports.verifyCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).populate('user category');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
        data: null,
        error: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company verified successfully',
      data: company,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify company',
      data: null,
      error: err.message,
    });
  }
};
