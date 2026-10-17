// // server/models/Notification.js 

// import mongoose from "mongoose";

// const notificationSchema = new mongoose.Schema(
//   {
//     recipientId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//     isGlobalAdmin: { type: Boolean, default: false },

//     type: {
//       type: String,
//       enum: [
//         "new_inquiry",
//         "inquiry_reply",
//         "system",
//         "new_order",
//         "order_status",
//       ],
//       required: true,
//     },
//     title: { type: String, required: true },
//     message: { type: String, required: true },
//     isRead: { type: Boolean, default: false },
//     relatedInquiryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Inquiry",
//       default: null,
//     },
//     relatedOrderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Order",
//       default: null,
//     },
//     link: { type: String, default: null },
//   },
//   { timestamps: true },
// );

// export default mongoose.model("Notification", notificationSchema);








// server/models/Notification.js 

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isGlobalAdmin: { type: Boolean, default: false },

    type: {
      type: String,
      enum: [
        "new_inquiry",
        "inquiry_reply",
        "system",
        "new_order",
        "order_status",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    relatedInquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inquiry",
      default: null,
    },
    relatedOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    link: { type: String, default: null },
  },
  { timestamps: true },
);

// Every NEW notification is also pushed to the phone / browser (Web Push).
notificationSchema.pre("save", function (next) {
  this.$locals.wasNew = this.isNew;
  next();
});
notificationSchema.post("save", function (doc) {
  if (!doc.$locals?.wasNew) return;
  import("../utils/pushService.js")
    .then((m) => m.pushForNotification(doc))
    .catch((err) => console.error("[push] hook failed:", err.message));
});

export default mongoose.model("Notification", notificationSchema);