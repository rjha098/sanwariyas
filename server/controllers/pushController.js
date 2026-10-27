// // FILE: server/controllers/pushController.js

// import PushSubscription from "../models/PushSubscription.js";
// import User from "../models/User.js";
// import {
//   getPublicKey,
//   sendPushToUser,
//   isPushConfigured,
// } from "../utils/pushService.js";

// export const publicKey = (_req, res) => {
//   const key = getPublicKey();
//   if (!key) {
//     return res
//       .status(503)
//       .json({
//         success: false,
//         message: "Push notifications are not configured on the server.",
//       });
//   }
//   res.json({ success: true, publicKey: key });
// };

// export const subscribe = async (req, res) => {
//   try {
//     const { subscription, userAgent } = req.body || {};
//     const endpoint = subscription?.endpoint;
//     const p256dh = subscription?.keys?.p256dh;
//     const auth = subscription?.keys?.auth;
//     if (
//       typeof endpoint !== "string" ||
//       !endpoint.startsWith("https://") ||
//       !p256dh ||
//       !auth
//     ) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid subscription." });
//     }

//     // Only real database accounts (stable user ID) can own a device, and only
//     // while the token's session is still the account's live session.
//     const userId = req.authUser?.id;
//     const sessionId = req.authUser?.sessionId;
//     const owner = userId
//       ? await User.findById(userId).select("role currentSessionId isActive").lean()
//       : null;
//     if (
//       !owner ||
//       owner.isActive === false ||
//       !sessionId ||
//       owner.currentSessionId !== sessionId
//     ) {
//       return res.status(401).json({
//         success: false,
//         message: "Session is not active. Please log in again.",
//       });
//     }

//     // Same device can switch accounts: the endpoint is unique, so this
//     // re-assigns it to the account that is logged in now.
//     await PushSubscription.findOneAndUpdate(
//       { endpoint },
//       {
//         userId: owner._id,
//         role: owner.role,
//         sessionId,
//         endpoint,
//         keys: { p256dh, auth },
//         userAgent: String(userAgent || req.headers["user-agent"] || "").slice(
//           0,
//           300,
//         ),
//       },
//       { upsert: true, new: true, setDefaultsOnInsert: true },
//     );
//     res.status(201).json({ success: true });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const unsubscribe = async (req, res) => {
//   try {
//     const endpoint = req.body?.endpoint;
//     if (typeof endpoint === "string") {
//       await PushSubscription.deleteOne({ endpoint, userId: req.authUser.id });
//     }
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Sends a test message to the logged-in user's own devices
// export const sendTest = async (req, res) => {
//   try {
//     if (!isPushConfigured()) {
//       return res
//         .status(503)
//         .json({
//           success: false,
//           message: "Push is not configured on the server.",
//         });
//     }
//     const result = await sendPushToUser(req.authUser.id, {
//       title: "SANWARIYAS",
//       body: "Notifications are working on this device ✅",
//       url: "/",
//       tag: "push-test",
//     });
//     if (!result.sent) {
//       return res
//         .status(404)
//         .json({
//           success: false,
//           message: "No active device found. Enable notifications first.",
//         });
//     }
//     res.json({ success: true, sent: result.sent });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };








// FILE: server/controllers/pushController.js

import PushSubscription from "../models/PushSubscription.js";
import User from "../models/User.js";
import { getAdminSession } from "../utils/authUtils.js";
import { getPublicKey } from "../utils/pushService.js";

export const publicKey = (_req, res) => {
  const key = getPublicKey();
  if (!key) {
    return res.status(503).json({
      success: false,
      message: "Push notifications are not configured on the server.",
    });
  }
  res.json({ success: true, publicKey: key });
};

// Works out who owns this device, but only while the token's session is still
// the account's live session. Returns null when it is not.
//   • database account  -> checked against User.currentSessionId
//   • pure-ENV admin    -> has NO User row (token id is null); checked against
//                          the AdminSession record for that email
const resolveOwner = async (authUser) => {
  const { id: userId, sessionId, email, role } = authUser || {};
  if (!sessionId) return null;

  if (userId) {
    const owner = await User.findById(userId)
      .select("role currentSessionId isActive")
      .lean();
    if (!owner || owner.isActive === false || owner.currentSessionId !== sessionId) {
      return null;
    }
    return { userId: owner._id, role: owner.role, sessionId };
  }

  if (role === "admin" && email) {
    const ownerEmail = String(email).trim().toLowerCase();
    const active = await getAdminSession(ownerEmail);
    if (!active || active !== sessionId) return null;
    return { ownerEmail, role: "admin", sessionId };
  }

  return null;
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

    const owner = await resolveOwner(req.authUser);
    if (!owner) {
      return res.status(401).json({
        success: false,
        message: "Session is not active. Please log in again.",
      });
    }

    // Same device can switch accounts: the endpoint is unique, so this
    // re-assigns it to the account that is logged in now (and clears the
    // previous owner's identity field).
    const set = {
      role: owner.role,
      sessionId: owner.sessionId,
      endpoint,
      keys: { p256dh, auth },
      userAgent: String(userAgent || req.headers["user-agent"] || "").slice(0, 300),
    };
    const unset = {};
    if (owner.userId) {
      set.userId = owner.userId;
      unset.ownerEmail = "";
    } else {
      set.ownerEmail = owner.ownerEmail;
      unset.userId = "";
    }

    await PushSubscription.findOneAndUpdate(
      { endpoint },
      { $set: set, $unset: unset },
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
      const { id, email } = req.authUser || {};
      if (id) {
        await PushSubscription.deleteOne({ endpoint, userId: id });
      } else if (email) {
        await PushSubscription.deleteOne({
          endpoint,
          ownerEmail: String(email).trim().toLowerCase(),
        });
      }
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};