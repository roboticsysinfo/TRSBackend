const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const upload = require("../middlewares/upload");
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");


// 🔽 Create a new blog with image upload
router.post("/create-blog", upload.single("blogImage"), adminAuthMiddleware, blogController.createBlog);


// 🔄 Update existing blog (optionally with new image)
router.put("/update/blog/:id", upload.single("blogImage"), adminAuthMiddleware, blogController.updateBlog);


// 📥 Get all blogs
router.get("/get-all-blogs", blogController.getAllBlogs);


// 📥 Get a single blog by ID
router.get("/single/blog/:id", blogController.getBlogById);


// ❌ Delete a blog
router.delete("/delete/blog:id", adminAuthMiddleware, blogController.deleteBlog);

router.put("/blog/view/:id", blogController.blogViewCount);

module.exports = router;
