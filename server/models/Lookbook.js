// FILE: server/models/Lookbook.js
import mongoose from "mongoose";

const lookbookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      enum: ["Kurti", "Saree", "Suit Set", "Co-ord Set", "Dress Material"],
    },
    image: { type: String, required: true },
    badge: {
      type: String,
      enum: [
        "Anarkali",
        "Short Kurtis",
        "Long Kurtis",
        "Co-ord Set",
        "Straight Kurti Set",
        "A-line Suit",
      ],
      default: "None",
    },

    // pin bestsellers to top of lookbook
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

lookbookSchema.index({ isFeatured: -1, createdAt: -1 });

export default mongoose.model("Lookbook", lookbookSchema);
