const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    blogImage: { type: String, required: true },
    blogImageAlt: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model("Blog", blogSchema);
