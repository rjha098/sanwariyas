// server/models/product.js

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    shortDescription: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    fabric: {
      type: String,
      default: "",
    },
    occasion: {
      type: String,
      default: "",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    metaTitle: {
      type: String,
      default: "",
    },

    metaDescription: {
      type: String,
      default: "",
    },
    //  Stock Ready Architecture — optional. null = stock not tracked (unlimited), matches existing behavior.
    stock: {
      type: Number,
      default: null,
    },
    //  Bulk Discount (Future Ready) — optional, empty by default, does not affect existing products.
    bulkDiscountTiers: {
      type: [
        {
          minPieces: { type: Number, required: true, min: 1 },
          discountPercent: { type: Number, required: true, min: 0, max: 100 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });

export default mongoose.model("Product", productSchema);
