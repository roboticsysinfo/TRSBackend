const Interview = require('../models/Interview');
const imagekit = require('../utils/imagekit');


// Helper for consistent response
const sendResponse = (res, success, message, data = null) => {
  res.status(success ? 200 : 400).json({ success, message, data });
};

// Upload image to ImageKit
const uploadToImageKit = async (fileBuffer, originalname) => {
  const uploaded = await imagekit.upload({
    file: fileBuffer,
    fileName: originalname,
    folder: "/interviews"
  });
  return uploaded.url;
};

// Add Interview
exports.addInterview = async (req, res) => {
  try {
    const { personName, designation, excerpt, qa } = req.body;
    const parsedQa = JSON.parse(qa); // qa comes as string from form-data

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToImageKit(req.file.buffer, req.file.originalname);
    }

    const newInterview = new Interview({
      personName,
      designation,
      profileImage: imageUrl,
      excerpt,
      qa: parsedQa
    });

    const saved = await newInterview.save();
    sendResponse(res, true, "Interview added successfully", saved);
  } catch (error) {
    sendResponse(res, false, "Failed to add interview", error.message);
  }
};


// Get all with pagination and search
exports.getAllInterviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const query = {
      $or: [
        { personName: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } }
      ]
    };

    const interviews = await Interview.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Interview.countDocuments(query);

    sendResponse(res, true, "Interviews fetched", {
      interviews,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (err) {
    sendResponse(res, false, "Failed to fetch interviews", err.message);
  }
};



// Get one
exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return sendResponse(res, false, "Interview not found");
    sendResponse(res, true, "Interview fetched", interview);
  } catch (err) {
    sendResponse(res, false, "Error", err.message);
  }
};

// Update
exports.updateInterview = async (req, res) => {
  try {
    const { personName, designation, excerpt, qa } = req.body;
    const parsedQa = qa ? JSON.parse(qa) : [];

    const interview = await Interview.findById(req.params.id);
    if (!interview) return sendResponse(res, false, "Interview not found");

    if (req.file) {
      const newUrl = await uploadToImageKit(req.file.buffer, req.file.originalname);
      interview.profileImage = newUrl;
    }

    interview.personName = personName || interview.personName;
    interview.designation = designation || interview.designation;
    interview.excerpt = excerpt || interview.excerpt;
    interview.qa = parsedQa.length > 0 ? parsedQa : interview.qa;

    const updated = await interview.save();
    sendResponse(res, true, "Interview updated", updated);
  } catch (err) {
    sendResponse(res, false, "Failed to update", err.message);
  }
};


// Delete
exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) return sendResponse(res, false, "Interview not found");
    sendResponse(res, true, "Interview deleted", interview);
  } catch (err) {
    sendResponse(res, false, "Failed to delete", err.message);
  }
};
