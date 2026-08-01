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
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    invoiceNumber: { type: String, unique: true, sparse: true }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, lowercase: true, trim: true, default: "" },
    buyerPhone: { type: String, default: "" },
    buyerCompany: { type: String, default: "" },

    items: { type: [orderItemSchema], required: true },

    totalPieces: { type: Number, required: true, min: 0 },
    totalSets: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    
    // Courier Fields Maintained
    awbNumber: { type: String, default: "" },
    courierPartner: { type: String, default: "DTDC" },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

export const ORDER_CONSTANTS = { SET_SIZE, MIN_SETS, MIN_PIECES };

export default mongoose.model("Order", orderSchema);