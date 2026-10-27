// // FILE: server/models/PushSubscription.js
// // One row per browser / phone that allowed notifications.
// import mongoose from "mongoose";

// const pushSubscriptionSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
//     role: { type: String, enum: ["admin", "staff", "customer"], required: true, index: true },
//     endpoint: { type: String, required: true, unique: true },
//     keys: {
//       p256dh: { type: String, required: true },
//       auth: { type: String, required: true },
//     },
//     userAgent: { type: String, default: "", maxlength: 300 },
//   },
//   { timestamps: true },
// );

// export default mongoose.model("PushSubscription", pushSubscriptionSchema);

// FILE: server/models/PushSubscription.js
// One row per browser / phone that allowed notifications.
//
// Owner is EITHER
//   • userId      – a normal database account (customer / staff / DB admin), or
//   • ownerEmail  – the pure-ENV admin (ADMIN_EMAIL), who has no User row.
import mongoose from "mongoose";

const pushSubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    ownerEmail: { type: String, lowercase: true, trim: true, index: true },
    role: {
      type: String,
      enum: ["admin", "staff", "customer"],
      required: true,
      index: true,
    },
    // Session this device was linked under (User.currentSessionId / AdminSession at subscribe time).
    // Push is only delivered while it still matches the owner's live session.
    sessionId: { type: String, default: null, index: true },
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
    userAgent: { type: String, default: "", maxlength: 300 },
  },
  { timestamps: true },
);

pushSubscriptionSchema.pre("validate", function (next) {
  if (!this.userId && !this.ownerEmail) {
    return next(
      new Error("A push subscription needs an owner (userId or ownerEmail)."),
    );
  }
  next();
});

export default mongoose.model("PushSubscription", pushSubscriptionSchema);
