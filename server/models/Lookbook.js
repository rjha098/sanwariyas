//  // FILE: server/models/Lookbook.js

// import mongoose from "mongoose";

// const lookbookSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true, trim: true, maxlength: 150 },

//     // Human-readable catalogue code shown in the magazine + inquiry (e.g. SW-1042).
//     // Auto-generated on create when the admin leaves it blank.
//     styleNumber: { type: String, trim: true, maxlength: 40, default: "" },

//     // Legacy single-photo path. For catalogue items this is the "display" variant.
//     image: { type: String, required: true },
//     category: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 80,
//     },
//     badge: {
//       type: String,
//       enum: ["None", "Bestseller", "Trending", "New Arrival"],
//       default: "None",
//     },

//     // pin bestsellers to top of lookbook
//     isFeatured: { type: Boolean, default: false },

//     // ── PDF catalogue fields (additive; legacy documents simply lack them) ──
//     catalogueId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "LookbookCatalogue",
//       default: null,
//     },
//     sourceType: {
//       type: String,
//       enum: ["legacy", "page", "embedded"],
//       default: "legacy",
//     },
//     pageNumber: { type: Number, default: null },
//     // Deterministic key that makes processing retries idempotent.
//     // Intentionally has NO default so the sparse unique index ignores legacy docs.
//     sourceKey: { type: String },
//     contentHash: { type: String, default: "" },
//     thumb: { type: String, default: "" },
//     display: { type: String, default: "" },
//     full: { type: String, default: "" },
//     width: { type: Number, default: null },
//     height: { type: Number, default: null },
//     sortOrder: { type: Number, default: 0 },
//     isPublished: { type: Boolean, default: true },
//   },
//   { timestamps: true },
// );

// lookbookSchema.index({ isFeatured: -1, createdAt: -1 });
// lookbookSchema.index({ styleNumber: 1 });
// lookbookSchema.index({ sourceKey: 1 }, { unique: true, sparse: true });
// lookbookSchema.index({ catalogueId: 1, isPublished: 1, sortOrder: 1 });

// export default mongoose.model("Lookbook", lookbookSchema);





 // FILE: server/models/Lookbook.js

import mongoose from "mongoose";

const lookbookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },

    // Human-readable catalogue code shown in the magazine + inquiry (e.g. SW-1042).
    // Auto-generated on create when the admin leaves it blank.
    styleNumber: { type: String, trim: true, maxlength: 40, default: "" },

    // Text printed on the catalogue page next to the code (fabric, sizes, rate).
    detailText: { type: String, trim: true, maxlength: 200, default: "" },

    // Legacy single-photo path. For catalogue items this is the "display" variant.
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

    // ── PDF catalogue fields (additive; legacy documents simply lack them) ──
    catalogueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LookbookCatalogue",
      default: null,
    },
    sourceType: {
      type: String,
      enum: ["legacy", "page", "embedded"],
      default: "legacy",
    },
    pageNumber: { type: Number, default: null },
    // Deterministic key that makes processing retries idempotent.
    // Intentionally has NO default so the sparse unique index ignores legacy docs.
    sourceKey: { type: String },
    contentHash: { type: String, default: "" },
    thumb: { type: String, default: "" },
    display: { type: String, default: "" },
    full: { type: String, default: "" },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

lookbookSchema.index({ isFeatured: -1, createdAt: -1 });
lookbookSchema.index({ styleNumber: 1 });
lookbookSchema.index({ sourceKey: 1 }, { unique: true, sparse: true });
lookbookSchema.index({ catalogueId: 1, isPublished: 1, sortOrder: 1 });

export default mongoose.model("Lookbook", lookbookSchema);