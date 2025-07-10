const Blog = require("../models/Blog");
const imagekit = require("../utils/imagekit");


// 🔹 Create Blog
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      blogImageAlt,
      metaTitle,
      metaDescription,
      metaKeywords,
      category,
    } = req.body;

    let blogImageUrl = "";
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `blog_${Date.now()}`,
        folder: "/blogs",
      });
      blogImageUrl = uploadResponse.url;
    }

    const blog = await Blog.create({
      title,
      description,
      blogImage: blogImageUrl,
      blogImageAlt,
      metaTitle,
      metaDescription,
      metaKeywords,
      category,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



// 🔹 Get All Blogs
// 🔹 Get All Blogs with Pagination, Search & Sorting
exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { metaTitle: { $regex: search, $options: "i" } },
      ],
    };

    const totalBlogs = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .populate("category")
      .sort({ createdAt: -1 }) // 🆕 Newest first
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.json({
      success: true,
      message: "Blogs fetched successfully",
      data: blogs,
      pagination: {
        total: totalBlogs,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalBlogs / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



// 🔹 Get Blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("category");
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    return res.json({
      success: true,
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



// 🔹 Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const {
      title,
      description,
      blogImageAlt,
      metaTitle,
      metaDescription,
      metaKeywords,
      category,
    } = req.body;

    let updatedImage = blog.blogImage;
    if (req.file) {
      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: `blog_${Date.now()}`,
        folder: "/blogs",
      });
      updatedImage = uploaded.url;
    }

    blog.title = title ?? blog.title;
    blog.description = description ?? blog.description;
    blog.blogImage = updatedImage;
    blog.blogImageAlt = blogImageAlt ?? blog.blogImageAlt;
    blog.metaTitle = metaTitle ?? blog.metaTitle;
    blog.metaDescription = metaDescription ?? blog.metaDescription;
    blog.metaKeywords = metaKeywords ?? blog.metaKeywords;
    blog.category = category ?? blog.category;

    await blog.save();

    return res.json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Update Blog Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



// 🔹 Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    return res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Blog view count increase API
exports.blogViewCount = async (req, res) => {

    try {

        const { id } = req.params;

        // Blog ka view count increase kare
        const blog = await Blog.findByIdAndUpdate(
            id,
            { $inc: { blog_views: 1 } },  // Views count increase
            { new: true }
        );

        if (!blog) return res.status(404).json({ message: "Blog not found" });

        res.json({ success: true, blog_views: blog.blog_views });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
    
}
