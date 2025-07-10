const express = require('express');
const router = express.Router();
const { updateStoryStatus, registerAdmin, loginAdmin } = require('../controllers/adminController');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');


// POST /api/admin/register
router.post('/admin-register', registerAdmin);

// POST /api/admin/login
router.post('/admin-login', loginAdmin);


// Example route: PATCH /api/admin/stories/:id/verify
router.patch('/story/verify/:id', adminAuthMiddleware, updateStoryStatus);


module.exports = router;
