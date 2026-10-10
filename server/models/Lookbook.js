
// FILE: server/models/Lookbook.js

import mongoose from "mongoose";

const lookbookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },

    image: { type: String, required: true },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    badge: {
      type: String,
      enum: ["None", "Bestseller", "Trending", "New Arrival"],
      default: "None",
    },

    // pin bestsellers to top of lookbook
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

lookbookSchema.index({ isFeatured: -1, createdAt: -1 });

export default mongoose.model("Lookbook", lookbookSchema);