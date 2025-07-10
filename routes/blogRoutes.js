const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const upload = require("../middlewares/upload");


// 🔽 Create a new blog with image upload
router.post("/create-blog", upload.single("blogImage"), blogController.createBlog);


// 🔄 Update existing blog (optionally with new image)
router.put("/update/blog/:id", upload.single("blogImage"), blogController.updateBlog);


// 📥 Get all blogs
router.get("/get-all-blogs", blogController.getAllBlogs);


// 📥 Get a single blog by ID
router.get("/single/blog/:id", blogController.getBlogById);


// ❌ Delete a blog
router.delete("/delete/blog:id", blogController.deleteBlog);


module.exports = router;
