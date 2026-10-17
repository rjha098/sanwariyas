// FILE: server/models/PushSubscription.js
// One row per browser / phone that allowed notifications.
import mongoose from "mongoose";

const pushSubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, enum: ["admin", "staff", "customer"], required: true, index: true },
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
    userAgent: { type: String, default: "", maxlength: 300 },
  },
  { timestamps: true },
);

export default mongoose.model("PushSubscription", pushSubscriptionSchema);