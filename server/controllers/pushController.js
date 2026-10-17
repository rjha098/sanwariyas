// FILE: server/controllers/pushController.js
import PushSubscription from "../models/PushSubscription.js";
import {
  getPublicKey,
  sendPushToUser,
  isPushConfigured,
} from "../utils/pushService.js";

export const publicKey = (_req, res) => {
  const key = getPublicKey();
  if (!key) {
    return res
      .status(503)
      .json({
        success: false,
        message: "Push notifications are not configured on the server.",
      });
  }
  res.json({ success: true, publicKey: key });
};

export const subscribe = async (req, res) => {
  try {
    const { subscription, userAgent } = req.body || {};
    const endpoint = subscription?.endpoint;
    const p256dh = subscription?.keys?.p256dh;
    const auth = subscription?.keys?.auth;
    if (
      typeof endpoint !== "string" ||
      !endpoint.startsWith("https://") ||
      !p256dh ||
      !auth
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid subscription." });
    }

    // same phone can switch accounts: the endpoint is unique, so we just re-assign it
    await PushSubscription.findOneAndUpdate(
      { endpoint },
      {
        userId: req.authUser.id,
        role: req.authUser.role,
        endpoint,
        keys: { p256dh, auth },
        userAgent: String(userAgent || req.headers["user-agent"] || "").slice(
          0,
          300,
        ),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const endpoint = req.body?.endpoint;
    if (typeof endpoint === "string") {
      await PushSubscription.deleteOne({ endpoint, userId: req.authUser.id });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sends a test message to the logged-in user's own devices
export const sendTest = async (req, res) => {
  try {
    if (!isPushConfigured()) {
      return res
        .status(503)
        .json({
          success: false,
          message: "Push is not configured on the server.",
        });
    }
    const result = await sendPushToUser(req.authUser.id, {
      title: "SANWARIYAS",
      body: "Notifications are working on this device ✅",
      url: "/",
      tag: "push-test",
    });
    if (!result.sent) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No active device found. Enable notifications first.",
        });
    }
    res.json({ success: true, sent: result.sent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
