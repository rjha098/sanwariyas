// FILE: server/models/Blog.js

import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: { type: String, required: true, maxlength: 200000 },
    excerpt: { type: String, default: "", maxlength: 1000 },
    featuredImage: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["published", "draft"], default: "draft" },
    metaTitle: { type: String, default: "", maxlength: 200 },
    metaDescription: { type: String, default: "", maxlength: 300 },
  },
  { timestamps: true },
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
