const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');

// Create
router.post('/create-category', adminAuthMiddleware, categoryController.createCategory);

// Read All
router.get('/categories', categoryController.getAllCategories);

// Read One
router.get('/category/:id', categoryController.getCategoryById);

// Update
router.put('/update/category/:id', adminAuthMiddleware, categoryController.updateCategory);

// Delete
router.delete('/delete/category/:id', adminAuthMiddleware, categoryController.deleteCategory);


module.exports = router;
