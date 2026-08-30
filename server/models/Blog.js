// // FILE: server/models/Blog.js

// import mongoose from "mongoose";

// // Blog.js mein apne schema ko aise update karo:
// const blogSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true, trim: true, maxlength: 200 }, // <-- maxlength add hua
//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//     },
//     content: { type: String, required: true, maxlength: 200000 }, // <-- maxlength add hua
//     excerpt: { type: String, default: "", maxlength: 1000 },
//     featuredImage: { type: String, default: "" }, 
//     bannerImage: { type: String, default: "" }, 
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       default: null,
//     },
//     tags: { type: [String], default: [] },
//     status: { type: String, enum: ["published", "draft"], default: "draft" },
//     metaTitle: { type: String, default: "", maxlength: 200 },
//     metaDescription: { type: String, default: "", maxlength: 300 }, // <-- maxlength add hua
//   },
//   { timestamps: true }
// );


// export default Blog;




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
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);   // ← yeh line missing thi

export default Blog;