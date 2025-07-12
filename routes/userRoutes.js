const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');


// Auth routes
router.post('/auth/signup', userController.signup);

router.post('/auth/signin', userController.signin);

router.post("/auth/logout", userController.logoutUser);

// ✅ New Route for Pagination + Search
router.get("/all-users", userController.getAllUsers);

// User CRUD
router.get('/get-user-by-id/:id', userController.getUserById);


router.put('/update-user/:id',  adminAuthMiddleware, userController.updateUser);


router.delete('/delete-user/:id', adminAuthMiddleware, userController.deleteUser);




module.exports = router;
