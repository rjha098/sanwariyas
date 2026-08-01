// FILE: server/models/Blog.js
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: { type: String, required: true },
    excerpt: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["published", "draft"], default: "draft" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  { timestamps: true },
);

// only  this  index needed
blogSchema.index({ status: 1, createdAt: -1 });

// 1. firstly  define  the  model
const Blog = mongoose.model("Blog", blogSchema);

// 2. deleting  old  indexes  in  mongoose  db
Blog.syncIndexes();

export default Blog;
