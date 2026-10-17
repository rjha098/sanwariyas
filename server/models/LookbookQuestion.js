// FILE: server/models/LookbookQuestion.js
// Questions that appear BETWEEN pages of the Lookbook magazine.
// Managed from the admin panel (add / edit / hide / remove). The customer's
// answers are attached to the one-time inquiry.
import mongoose from "mongoose";

const lookbookQuestionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 200 },
    type: { type: String, enum: ["single", "multiple"], default: "single" },
    options: {
      type: [{ type: String, trim: true, maxlength: 60 }],
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 2 && v.length <= 8,
        message: "Add between 2 and 8 options.",
      },
    },
    // Appears after the Nth photo of the magazine (1 = after the first photo).
    afterPhoto: { type: Number, default: 6, min: 1, max: 500 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

lookbookQuestionSchema.index({ isActive: 1, afterPhoto: 1 });

export default mongoose.model("LookbookQuestion", lookbookQuestionSchema);