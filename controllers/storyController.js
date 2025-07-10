const Story = require('../models/Story');
const Category = require('../models/Category');
const imagekit = require('../utils/imagekit');

const sendResponse = (res, success, message, data = null, status = 200) => {
  res.status(status).json({ success, message, data });
};

// ✅ Add Story
exports.addStory = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    let imageUrl = "";

    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `story_${Date.now()}`,
        folder: "stories"
      });

      imageUrl = uploadResponse.url;
    }

    const story = await Story.create({
      title,
      description,
      category,
      user: req.user._id,
      storyImage: imageUrl
    });

    sendResponse(res, true, 'Story added successfully', story, 201);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};



// ✅ Delete Story
// ✅ Delete Story (for Admin)
exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return sendResponse(res, false, 'Story not found', null, 404);

    await story.deleteOne();
    sendResponse(res, true, 'Story deleted successfully');
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

// ✅ Update Story
exports.updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return sendResponse(res, false, 'Story not found', null, 404);

    if (story.user.toString() !== req.user._id.toString()) {
      return sendResponse(res, false, 'Unauthorized', null, 403);
    }

    const { title, description, category } = req.body;

    if (title) story.title = title;
    if (description) story.description = description;
    if (category) story.category = category;

    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `story_${Date.now()}`,
        folder: "stories"
      });

      story.storyImage = uploadResponse.url;
    }

    await story.save();
    sendResponse(res, true, 'Story updated successfully', story);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};




// ✅ Get All Stories (with pagination + search)
exports.getAllStories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const query = {
      title: { $regex: search, $options: 'i' }
    };

    const total = await Story.countDocuments(query);
    const stories = await Story.find(query)
      .populate('category')
      .populate('user', 'name email') // adjust fields as needed
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    sendResponse(res, true, 'Stories fetched', {
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      stories
    });
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

// ✅ Get Story By ID
exports.getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('category')
      .populate('user', 'name email');

    if (!story) return sendResponse(res, false, 'Story not found', null, 404);

    sendResponse(res, true, 'Story fetched', story);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

// ✅ Get Stories By User ID
// ✅ Get Stories By User ID (with pagination + search)
exports.getStoriesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, search = '' } = req.query;

    const query = {
      user: userId,
      title: { $regex: search, $options: 'i' }
    };

    const total = await Story.countDocuments(query);
    const stories = await Story.find(query)
      .populate('category')
      .populate('user', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'User stories fetched successfully',
      data: {
        total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        stories
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};


// ✅ Verify Story (Set isVerified to true)
exports.verifyStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
        data: null
      });
    }

    story.isVerified = true;
    await story.save();

    return res.status(200).json({
      success: true,
      message: 'Story verified successfully',
      data: story
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to verify story',
      data: null,
      error: err.message
    });
  }
};
