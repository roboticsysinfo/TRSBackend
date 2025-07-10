const Category = require('../models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
        data: null,
        error: null,
      });
    }

    const category = await Category.create({ name: name.trim() });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      data: null,
      error: err.message,
    });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: categories,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      data: null,
      error: err.message,
    });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
        data: null,
        error: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category fetched successfully',
      data: category,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      data: null,
      error: err.message,
    });
  }
};

// Update category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
        data: null,
        error: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      data: null,
      error: err.message,
    });
  }
};

// Delete category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
        data: null,
        error: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: null,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      data: null,
      error: err.message,
    });
  }
};
