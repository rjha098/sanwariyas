// FILE: server/models/LookbookCatalogue.js
// One uploaded PDF catalogue. Its generated images live in the existing
// "Lookbook" collection (additive fields) and point back here via catalogueId.
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    pagesRendered: { type: Number, default: 0 },
    embeddedExtracted: { type: Number, default: 0 },
    embeddedSkippedSmall: { type: Number, default: 0 },
    embeddedSkippedDuplicate: { type: Number, default: 0 },
    embeddedSkippedFullPage: { type: Number, default: 0 },
    embeddedSkippedFailed: { type: Number, default: 0 },
  },
  { _id: false },
);

const catalogueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    collectionName: { type: String, trim: true, maxlength: 80, default: "" },
    season: { type: String, trim: true, maxlength: 60, default: "" },
    description: { type: String, trim: true, maxlength: 1000, default: "" },

    status: {
      type: String,
      enum: ["processing", "failed", "draft", "published", "archived"],
      default: "processing",
      index: true,
    },
    error: { type: String, default: "", maxlength: 1000 },

    // Private source file (kept only while retry may be needed).
    pdfFile: { type: String, default: "" },
    pdfHash: { type: String, default: "", index: true },
    originalName: { type: String, default: "", maxlength: 200 },
    pdfBytes: { type: Number, default: 0 },

    totalPages: { type: Number, default: 0 },
    donePages: { type: [Number], default: [] },
    failedPages: { type: [Number], default: [] },
    stage: { type: String, default: "", maxlength: 60 },
    report: { type: reportSchema, default: () => ({}) },
    warnings: { type: [String], default: [] },

    startedAt: { type: Date },
    finishedAt: { type: Date },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

catalogueSchema.index({ createdAt: -1 });

export default mongoose.model("LookbookCatalogue", catalogueSchema);