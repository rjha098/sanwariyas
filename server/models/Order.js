// FILE: server/models/Order.js
// PURPOSE: Wholesale Order — 1 Set = 5 Pieces, Min Order = 2 Sets (10 pieces) per line item

import mongoose from "mongoose";

const SET_SIZE = 5;
const MIN_SETS = 2;
const MIN_PIECES = MIN_SETS * SET_SIZE;

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    pricePerPiece: { type: Number, required: true, min: 0 },
    pieces: { type: Number, required: true, min: 1 },
    sets: { type: Number, required: true, min: 0 },
    remainderPieces: { type: Number, required: true, min: 0 },
    moqMet: { type: Boolean, required: true },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },

    // Owning customer. Required for "My Orders", order-ownership checks,
    // and user-targeted notifications to work at all.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    buyerName: { type: String, required: true, trim: true },
    buyerEmail: { type: String, required: true, trim: true, lowercase: true },
    buyerPhone: { type: String, default: "", trim: true },
    buyerCompany: { type: String, default: "", trim: true },

    // FIX: Generate a random string as the default invoice number.
    // If we leave it blank, MongoDB throws a duplicate key error for "null".
    // This creates a unique invoice like "INV-202685-ABC12"

    invoiceNumber: {
      type: String,
      unique: true,
      default: () => {
        const dateString = new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "");
        const randomString = Math.random()
          .toString(36)
          .substring(2, 7)
          .toUpperCase();
        return `INV-${dateString}-${randomString}`;
      },
    },

    shippingAddress: {
      addressLine1: { type: String, required: true, trim: true },
      addressLine2: { type: String, default: "", trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
      // "India" as default keeps this backward-compatible with any order
      // placed before this field existed.
      country: { type: String, required: true, trim: true, default: "India" },
      alternatePhone: { type: String, default: "", trim: true },
    },

    items: { type: [orderItemSchema], required: true },

    totalPieces: { type: Number, required: true, min: 0 },
    totalSets: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },

    // Cashfree payment tracking. paymentStatus is the source of truth for
    // whether money has actually been received — it is only ever set to
    // "paid" from the webhook/verify flow, never directly by the client.
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    cfOrderId: { type: String, default: "" },
    paymentSessionId: { type: String, default: "" },
    cfPaymentId: { type: String, default: "" },
    paidAt: { type: Date, default: null },
    // Stock is only decremented once, at the moment payment is confirmed.
    // This flag makes that step idempotent even if the webhook fires twice.
    stockDeducted: { type: Boolean, default: false },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // Courier Fields Maintained
    awbNumber: { type: String, default: "" },
    courierPartner: { type: String, default: "DTDC" },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true },
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

export const ORDER_CONSTANTS = { SET_SIZE, MIN_SETS, MIN_PIECES };

export default mongoose.model("Order", orderSchema);