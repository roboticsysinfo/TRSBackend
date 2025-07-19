const Company = require('../models/Company');
const imagekit = require('../utils/imagekit');


exports.createCompany = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Prevent duplicate
    const existing = await Company.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already listed a company',
        data: null,
      });
    }

    let imageURL = '';

    // ✅ Upload logo if present
    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}_${req.file.originalname}`,
      });
      imageURL = uploadedImage.url;
    }

    // ✅ Parse JSON strings from FormData
    const parsedCoreTeam = req.body.coreTeam ? JSON.parse(req.body.coreTeam) : [];
    const parsedSocialMedia = req.body.socialMedia ? JSON.parse(req.body.socialMedia) : {};

    const newCompany = await Company.create({
      name: req.body.name,
      about: req.body.about,
      legalName: req.body.legalName,
      headquarter: req.body.headquarter,
      foundingDate: req.body.foundingDate,
      businessModel: req.body.businessModel,
      noOfEmployees: req.body.noOfEmployees,
      category: req.body.category,
      user: userId,
      logo: imageURL,
      coreTeam: parsedCoreTeam,
      socialMedia: parsedSocialMedia,
    });

    res.status(201).json({
      success: true,
      message: 'Company listed successfully',
      data: newCompany,
    });
  } catch (err) {
    console.error('Company create error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to list company',
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
// Update Company by ID (with logo upload)
exports.updateCompany = async (req, res) => {
  try {
    let imageURL = '';

    // ✅ Upload new logo if present
    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}_${req.file.originalname}`,
      });
      imageURL = uploadedImage.url;
    }

    // ✅ Parse JSON fields if present
    const parsedCoreTeam = req.body.coreTeam ? JSON.parse(req.body.coreTeam) : undefined;
    const parsedSocialMedia = req.body.socialMedia ? JSON.parse(req.body.socialMedia) : undefined;

    const updateData = {
      ...req.body,
    };

    if (imageURL) updateData.logo = imageURL;
    if (parsedCoreTeam) updateData.coreTeam = parsedCoreTeam;
    if (parsedSocialMedia) updateData.socialMedia = parsedSocialMedia;

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
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
    console.error('Company update error:', err);
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
