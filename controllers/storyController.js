const Story = require('../models/Story');
const Category = require('../models/Category');
const imagekit = require('../utils/imagekit');

const sendResponse = (res, success, message, data = null, status = 200) => {
  res.status(status).json({ success, message, data });
};

// ✅ Add Story
// exports.addStory = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       category,
//       metaTitle,
//       metaDescription,
//       metaKeywords,
//       isFeatured
//     } = req.body;

//     let imageUrl = "";

//     if (req.file) {
//       const uploadResponse = await imagekit.upload({
//         file: req.file.buffer,
//         fileName: `story_${Date.now()}`,
//         folder: "stories"
//       });

//       imageUrl = uploadResponse.url;
//     }

//     const story = await Story.create({
//       title,
//       description,
//       category,
//       user: req.user._id,
//       storyImage: imageUrl,
//       metaTitle,
//       metaDescription,
//       metaKeywords: metaKeywords ? metaKeywords.split(',').map(kw => kw.trim()) : [],
//       isFeatured: isFeatured === 'true' // cast from string to boolean
//     });

//     sendResponse(res, true, 'Story added successfully', story, 201);
//   } catch (err) {
//     sendResponse(res, false, err.message, null, 500);
//   }
// };


// ✅ Add Story
exports.addStory = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      metaTitle,
      metaDescription,
      metaKeywords,
      isFeatured
    } = req.body;

    let imageUrl = "";

    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `story_${Date.now()}`,
        folder: "stories"
      });

      imageUrl = uploadResponse.url;
    }

    // ✅ Determine user or admin ID
    const userId = req.user?._id || req.admin?._id;

    if (!userId) {
      return sendResponse(res, false, "Unauthorized: User or Admin ID not found", null, 401);
    }

    const story = await Story.create({
      title,
      description,
      category,
      user: userId, // 🟢 Either user or admin's ID
      storyImage: imageUrl,
      metaTitle,
      metaDescription,
      metaKeywords: metaKeywords ? metaKeywords.split(',').map(kw => kw.trim()) : [],
      isFeatured: isFeatured === 'true'
    });

    sendResponse(res, true, 'Story added successfully', story, 201);
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};




// ✅ Update Story
exports.updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return sendResponse(res, false, 'Story not found', null, 404);

    const {
      title,
      description,
      category,
      metaTitle,
      metaDescription,
      metaKeywords,
      isFeatured
    } = req.body;

    if (title) story.title = title;
    if (description) story.description = description;
    if (category) story.category = category;
    if (metaTitle) story.metaTitle = metaTitle;
    if (metaDescription) story.metaDescription = metaDescription;
    if (metaKeywords)
      story.metaKeywords = metaKeywords.split(',').map(kw => kw.trim());
    if (isFeatured !== undefined)
      story.isFeatured = isFeatured === 'true';

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

// ✅ Delete Story
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

// ✅ Get All Stories (with pagination + search)
exports.getAllStories = async (req, res) => {

  try {

    const { page = 1, limit = 10, search = '' } = req.query;

    // 1. Find "Startup" category
    const startupCategory = await Category.findOne({ name: { $regex: '^startup$', $options: 'i' } });

    // 2. Base query
    const query = {
      title: { $regex: search, $options: 'i' },
    };

    // 3. Exclude Startup category if found
    if (startupCategory) {
      query.category = { $ne: startupCategory._id };
    }

    const total = await Story.countDocuments(query);

    const stories = await Story.find(query)
      .populate('category')
      .populate('user', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    sendResponse(res, true, 'Stories fetched', {
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      stories,
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

    sendResponse(res, true, 'User stories fetched successfully', {
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      stories
    });
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};

// ✅ Verify Story (Set isVerified to true)
exports.verifyStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) return sendResponse(res, false, 'Story not found', null, 404);

    story.isVerified = true;
    await story.save();

    sendResponse(res, true, 'Story verified successfully', story);
  } catch (err) {
    sendResponse(res, false, 'Failed to verify story', null, 500);
  }
};


// ✅ Get Only Startup Stories
exports.getStartupStories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    // 1. Find the "Startup" category
    const startupCategory = await Category.findOne({ name: { $regex: '^Startup$', $options: 'i' } });
    if (!startupCategory) {
      return sendResponse(res, false, 'Startup category not found', null, 404);
    }

    // 2. Build the query
    const query = {
      category: startupCategory._id,
      title: { $regex: search, $options: 'i' }
    };

    const total = await Story.countDocuments(query);

    const stories = await Story.find(query)
      .populate('category')
      .populate('user', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    sendResponse(res, true, 'Startup stories fetched', {
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      stories
    });
  } catch (err) {
    sendResponse(res, false, err.message, null, 500);
  }
};
