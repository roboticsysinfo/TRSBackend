const express = require('express');
const router = express.Router();
const {
  addStory,
  deleteStory,
  updateStory,
  getAllStories,
  getStoryById,
  getStoriesByUserId,
  verifyStory,
  getStartupStories
} = require('../controllers/storyController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');


// POST - Add story
router.post('/add-story', upload.single('storyImage'), adminAuthMiddleware, authMiddleware, addStory);


// put /api/stories/:id/verify
router.put('/verify-story/:id', adminAuthMiddleware, verifyStory);


// GET - All stories with pagination/search
router.get('/stories', getAllStories);

// GET - Story by ID
router.get('/single-story/:id', getStoryById);

// GET - Stories by user ID
router.get('/user/stories/:userId', getStoriesByUserId);

// PUT - Update story
router.put('/update-story/:id', upload.single('storyImage'), adminAuthMiddleware, updateStory);

// DELETE - Delete story
router.delete('/delete-story/:id', adminAuthMiddleware, deleteStory);

router.get('/startup-stories', getStartupStories);


module.exports = router;
