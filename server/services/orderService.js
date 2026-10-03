// FILE: server/services/orderService.js

import Order, { ORDER_CONSTANTS } from "../models/Order.js";
import Product from "../models/Product.js";
import Notification from "../models/Notification.js";
import { Resend } from "resend";
import crypto from "crypto";
import Counter from "../models/Counter.js";

const { SET_SIZE, MIN_PIECES } = ORDER_CONSTANTS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hrsanwariyas@gmail.com";

export const computeMoq = (pieces) => {
  const p = Math.max(0, parseInt(pieces, 10) || 0);
  const sets = Math.floor(p / SET_SIZE);
  const remainderPieces = p % SET_SIZE;
  const moqMet = p >= MIN_PIECES;
  const progressPercent = Math.min(100, Math.round((p / MIN_PIECES) * 100));
  return { pieces: p, sets, remainderPieces, moqMet, progressPercent };
};

const generateOrderNumber = async () => {
  const counter = await Counter.findByIdAndUpdate(
    "orderId",
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  return `ORD-${counter.seq}`;
};

// 1. BULLETPROOF INVOICE GENERATOR (For Billions of Orders)

const generateInvoiceNumber = async () => {
  // 1. Date (YYYYMMDD) - unique  for  according  to  day
  const dateString = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  // 2. Exact Millisecond Timestamp (if 2  order  come  in the  same  time )

  const timeMs = Date.now().toString(36).toUpperCase();

  // 3. Cryptographically Secure Random String (if  2   order  come  in  1 milesecond)

  const randomStr = crypto.randomBytes(2).toString("hex").toUpperCase();

  // Output Format: INV-20260805-LWK1JXYZ-A1B2
  // (Here Date + Millisecond Time + Crypto Random all  are  present  it  is  not  dublicate anytime)
  return `INV-${dateString}-${timeMs}-${randomStr}`;
};

const buildOrderItems = async (cartItems) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    const err = new Error("Cart is empty.");
    err.statusCode = 400;
    throw err;
  }
  const items = [];
  for (const raw of cartItems) {
    const pieces = parseInt(raw.pieces, 10);
    if (!raw.productId || !Number.isFinite(pieces) || pieces < 1) {
      const err = new Error("Invalid cart item.");
      err.statusCode = 400;
      throw err;
    }
    const product = await Product.findById(raw.productId).lean();
    if (!product || !product.isAvailable) {
      const err = new Error(
        `Product no longer available: ${raw.name || raw.productId}`,
      );
      err.statusCode = 400;
      throw err;
    }
    if (typeof product.stock === "number" && product.stock < pieces) {
      const err = new Error(
        `Insufficient stock for ${product.name}. Available: ${product.stock} pieces.`,
      );
      err.statusCode = 400;
      throw err;
    }
    const meta = computeMoq(pieces);
    if (!meta.moqMet) {
      const err = new Error(
        `${product.name}: minimum order is ${MIN_PIECES} pieces (2 sets). You have ${pieces}.`,
      );
      err.statusCode = 400;
      throw err;
    }
    let pricePerPiece = product.price;
    if (
      Array.isArray(product.bulkDiscountTiers) &&
      product.bulkDiscountTiers.length > 0
    ) {
      const applicable = product.bulkDiscountTiers
        .filter((t) => pieces >= t.minPieces)
        .sort((a, b) => b.minPieces - a.minPieces)[0];
      if (applicable) {
        pricePerPiece = +(
          product.price *
          (1 - applicable.discountPercent / 100)
        ).toFixed(2);
      }
    }
    items.push({
      product: product._id,
      name: product.name,
      image: product.image,
      pricePerPiece,
      pieces,
      sets: meta.sets,
      remainderPieces: meta.remainderPieces,
      moqMet: true,
      subtotal: +(pricePerPiece * pieces).toFixed(2),
    });
  }
  return items;
};

export const createOrder = async (
  userId,
  buyer,
  cartItems,
  shippingAddress,
) => {
  const items = await buildOrderItems(cartItems);
  const totalPieces = items.reduce((sum, i) => sum + i.pieces, 0);
  const totalSets = items.reduce((sum, i) => sum + i.sets, 0);
  const totalAmount = +items.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2);
  const orderNumber = await generateOrderNumber();

  // 2.here   we  calll  a  function  so    with  the  order  number   invoice  number   is  generated

  const invoiceNumber = await generateInvoiceNumber();

  // NOTE: stock is intentionally NOT deducted here. This order is not
  // confirmed yet — the customer still has to pay for it. Stock is only
  // deducted in markOrderPaid(), once Cashfree confirms the payment.
  const order = await Order.create({
    orderNumber,
    invoiceNumber,
    userId,
    buyerName: buyer.name,
    buyerEmail: (buyer.email || "").toLowerCase().trim(),
    buyerPhone: buyer.phone || "",
    buyerCompany: buyer.company || "",

    shippingAddress: {
      addressLine1: shippingAddress.addressLine1,
      addressLine2: shippingAddress.addressLine2 || "",
      city: shippingAddress.city,
      state: shippingAddress.state,
      pincode: String(shippingAddress.pincode),
      country: shippingAddress.country || "India",
      alternatePhone: shippingAddress.alternatePhone || "",
    },

    items,
    totalPieces,
    totalSets,
    totalAmount,
    status: "pending",
    paymentStatus: "pending",
  });

  return order.toObject();
};

// Called only from the payment webhook / verify flow, never directly from
// a client request — this is what actually deducts stock and confirms the
// order. Safe to call more than once for the same order (idempotent) since
// webhooks can be retried or arrive twice.
export const markOrderPaid = async (orderId, { cfPaymentId } = {}) => {
  const order = await Order.findById(orderId);
  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }

  // Idempotency guard: if we already processed this payment, do nothing.
  if (order.paymentStatus === "paid") {
    return order.toObject();
  }

  order.paymentStatus = "paid";
  order.paidAt = new Date();
  if (cfPaymentId) order.cfPaymentId = cfPaymentId;
  if (order.status === "pending") order.status = "confirmed";

  if (!order.stockDeducted) {
    for (const item of order.items) {
      // Atomic, conditional decrement: only succeeds if enough stock is
      // still available at this exact moment. This is what closes the
      // race-condition gap the original audit flagged (two paid orders
      // can no longer both decrement past zero stock).
      const result = await Product.updateOne(
        {
          _id: item.product,
          $or: [
            { stock: { $type: "number", $gte: item.pieces } },
            { stock: { $exists: false } },
            { stock: null },
          ],
        },
        { $inc: { stock: -item.pieces } },
      );
      if (result.modifiedCount === 0) {
        // Stock ran out between order placement and payment confirmation.
        // We do NOT fail the order here — the customer has already paid —
        // we flag it so a human resolves it (refund or restock) instead of
        // silently overselling or silently losing the payment.
        order.adminNotes = `${order.adminNotes ? order.adminNotes + " | " : ""}STOCK ALERT: insufficient stock for "${item.name}" at payment time — please review.`;
      }
    }
    order.stockDeducted = true;
  }

  await order.save();

  await Notification.create({
    isGlobalAdmin: true,
    type: "new_order",
    title: "New Paid Order",
    message: `Order ${order.orderNumber} paid by ${order.buyerCompany || order.buyerName} — ${order.totalPieces} pieces, ₹${order.totalAmount.toLocaleString("en-IN")}.`,
    relatedOrderId: order._id,
    link: `/operations-center/orders/${order._id}`,
  });

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL ||
          "Sanwariyas System <onboarding@resend.dev>",
        to: ADMIN_EMAIL,
        subject: `🧾 Paid Order ${order.orderNumber} — ${order.totalPieces} pcs`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #7A3D2A;">New Paid Wholesale Order</h2>
            <p><strong>Order #:</strong> ${order.orderNumber}</p>
            <p><strong>Invoice #:</strong> ${order.invoiceNumber}</p>
            <p><strong>Buyer:</strong> ${order.buyerName} (${order.buyerEmail})</p>
            <p><strong>Total Pieces:</strong> ${order.totalPieces} (${order.totalSets} sets)</p>
            <p><strong>Total Amount:</strong> ₹${order.totalAmount.toLocaleString("en-IN")}</p>
          </div>`,
      });
    } catch (emailError) {}
  }

  return order.toObject();
};

// Called when Cashfree reports the payment failed or the user dropped off.
export const markOrderFailed = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) return null;
  if (order.paymentStatus === "paid") return order.toObject(); // never downgrade a paid order
  order.paymentStatus = "failed";
  await order.save();
  return order.toObject();
};

export const getUserOrders = async (userId) => {
  return Order.find({ userId }).sort({ createdAt: -1 }).lean();
};

export const getOrderById = async (id) => {
  const order = await Order.findById(id).lean();
  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }
  return order;
};

export const getOrderByOrderNumber = async (orderNumber) => {
  return Order.findOne({ orderNumber });
};

// Persists the Cashfree session details onto our order right after we
// create them, so a page refresh or the webhook can look the order back up
// by cfOrderId/orderNumber without calling Cashfree again.
export const savePaymentSession = async (
  orderId,
  { paymentSessionId, cfOrderId },
) => {
  await Order.updateOne(
    { _id: orderId },
    { $set: { paymentSessionId, cfOrderId } },
  );
};

export const isOrderOwnedByUser = async (id, userId) => {
  const order = await Order.findById(id).select("userId").lean();
  if (!order) return false;
  return String(order.userId) === String(userId);
};

export const getAllOrdersAdmin = async ({
  page = 1,
  limit = 20,
  status,
  search,
}) => {
  const query = {};

  if (status && status !== "all") query.status = status;

  // Search by buyer name or order number remains intact
  if (search) {
    query.$or = [
      { buyerName: { $regex: search, $options: "i" } },
      { orderNumber: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10))
    .lean();

  return {
    orders,
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      pages: Math.ceil(total / parseInt(limit, 10)),
    },
  };
};

export const updateOrderStatus = async (
  id,
  { status, awbNumber, courierPartner, adminNotes },
) => {
  const order = await Order.findById(id);
  if (!order) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }

  const validStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (status && !validStatuses.includes(status)) {
    const err = new Error("Invalid order status");
    err.statusCode = 400;
    throw err;
  }

  if (status && status !== order.status) {
    order.status = status;
    if (order.userId) {
      await Notification.create({
        recipientId: order.userId,
        type: "order_status",
        title: "Order Status Updated",
        message: `Your order ${order.orderNumber} is now "${status}".`,
        relatedOrderId: order._id,
        link: `/my-orders/${order._id}`,
      });
    }
  }

  if (awbNumber !== undefined) order.awbNumber = awbNumber;
  if (courierPartner !== undefined) order.courierPartner = courierPartner;
  if (adminNotes !== undefined) order.adminNotes = adminNotes;

  await order.save();
  return order.toObject();
};

export const getOrderAnalytics = async () => {
  const [totals] = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalPieces: { $sum: "$totalPieces" },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const byStatus = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const topProducts = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        name: { $first: "$items.name" },
        piecesSold: { $sum: "$items.pieces" },
      },
    },
    { $sort: { piecesSold: -1 } },
    { $limit: 5 },
  ]);

  return {
    totalOrders: totals?.totalOrders || 0,
    totalPieces: totals?.totalPieces || 0,
    totalRevenue: totals?.totalRevenue || 0,
    byStatus: byStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
    topProducts,
  };
};
