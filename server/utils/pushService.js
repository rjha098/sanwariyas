// // FILE: server/utils/pushService.js
// // Sends Web Push messages to phones / browsers that enabled notifications.
// // Needs 3 env vars in server/.env: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT.
// // If they are missing the app keeps working — push is simply skipped.
// import webpush from "web-push";
// import PushSubscription from "../models/PushSubscription.js";

// // IMPORTANT: the keys are read lazily (on first use), NOT when this file is
// // imported. index.js calls dotenv.config() after its imports run, so reading
// // process.env at the top of this file would always see empty values.
// let state = null; // { configured: boolean, publicKey?: string }

// const init = () => {
//   if (state) return state;
//   const publicKey = (process.env.VAPID_PUBLIC_KEY || "").trim();
//   const privateKey = (process.env.VAPID_PRIVATE_KEY || "").trim();
//   const subject =
//     (process.env.VAPID_SUBJECT || "").trim() ||
//     `mailto:${process.env.ADMIN_EMAIL || "hrsanwariyas@gmail.com"}`;

//   if (!publicKey || !privateKey) {
//     console.warn("[push] VAPID keys not set — push notifications are disabled.");
//     state = { configured: false };
//     return state;
//   }
//   try {
//     webpush.setVapidDetails(subject, publicKey, privateKey);
//     state = { configured: true, publicKey };
//     console.log("[push] Web Push is ready.");
//   } catch (err) {
//     console.error("[push] Invalid VAPID keys:", err.message);
//     state = { configured: false };
//   }
//   return state;
// };

// export const isPushConfigured = () => init().configured;
// export const getPublicKey = () => (init().configured ? state.publicKey : null);

// const sendToSubscriptions = async (subs, payload) => {
//   if (!init().configured || !subs.length) return { sent: 0, removed: 0 };
//   const body = JSON.stringify(payload);
//   let sent = 0;
//   const dead = [];

//   await Promise.allSettled(
//     subs.map(async (s) => {
//       try {
//         await webpush.sendNotification(
//           { endpoint: s.endpoint, keys: { p256dh: s.keys.p256dh, auth: s.keys.auth } },
//           body,
//           { TTL: 60 * 60 * 24, urgency: "high" },
//         );
//         sent += 1;
//       } catch (err) {
//         // 404 / 410 = the user uninstalled the app or revoked permission
//         if (err.statusCode === 404 || err.statusCode === 410) dead.push(s._id);
//         else console.error("[push] send failed:", err.statusCode || err.message);
//       }
//     }),
//   );

//   if (dead.length) await PushSubscription.deleteMany({ _id: { $in: dead } });
//   return { sent, removed: dead.length };
// };

// export const sendPushToUser = async (userId, payload) =>
//   sendToSubscriptions(await PushSubscription.find({ userId }).lean(), payload);

// export const sendPushToAdmins = async (payload) =>
//   sendToSubscriptions(
//     await PushSubscription.find({ role: { $in: ["admin", "staff"] } }).lean(),
//     payload,
//   );

// // Called automatically for EVERY new Notification document (see models/Notification.js),
// // so new inquiries, lookbook inquiries, orders, replies and status updates all
// // reach the phone without touching those services.
// export const pushForNotification = async (n) => {
//   if (!n || !init().configured) return;
//   const payload = {
//     title: n.title,
//     body: n.message,
//     url: n.link || "/",
//     tag: `${n.type}-${n._id}`,
//   };
//   try {
//     if (n.isGlobalAdmin) await sendPushToAdmins(payload);
//     else if (n.recipientId) await sendPushToUser(n.recipientId, payload);
//   } catch (err) {
//     console.error("[push] notification push failed:", err.message);
//   }
// };

// FILE: server/utils/pushService.js
// Sends Web Push messages to phones / browsers that enabled notifications.
// Needs 3 env vars in server/.env: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT.
// If they are missing the app keeps working — push is simply skipped.
//
// OWNERSHIP RULE: a subscription only receives a push while
//   1. its owner (userId) still exists and is active, and
//   2. the owner's current login session (User.currentSessionId) is the same
//      session the device was linked under (PushSubscription.sessionId).
// Logout, a login on another device, or account switching all change/clear
// currentSessionId, so stale devices stop receiving that account's alerts.
import webpush from "web-push";
import PushSubscription from "../models/PushSubscription.js";
import User from "../models/User.js";

// IMPORTANT: the keys are read lazily (on first use), NOT when this file is
// imported. index.js calls dotenv.config() after its imports run, so reading
// process.env at the top of this file would always see empty values.
let state = null; // { configured: boolean, publicKey?: string }

const init = () => {
  if (state) return state;
  const publicKey = (process.env.VAPID_PUBLIC_KEY || "").trim();
  const privateKey = (process.env.VAPID_PRIVATE_KEY || "").trim();
  const subject =
    (process.env.VAPID_SUBJECT || "").trim() ||
    `mailto:${process.env.ADMIN_EMAIL || "hrsanwariyas@gmail.com"}`;

  if (!publicKey || !privateKey) {
    console.warn(
      "[push] VAPID keys not set — push notifications are disabled.",
    );
    state = { configured: false };
    return state;
  }
  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    state = { configured: true, publicKey };
    console.log("[push] Web Push is ready.");
  } catch (err) {
    console.error("[push] Invalid VAPID keys:", err.message);
    state = { configured: false };
  }
  return state;
};

export const isPushConfigured = () => init().configured;
export const getPublicKey = () => (init().configured ? state.publicKey : null);

// Keeps only subscriptions whose owner is active AND still on the session the
// device was linked under (and, when roles are given, still has that role).
// Subscriptions whose session is definitively superseded are removed.
const keepOwnedSubscriptions = async (subs, allowedRoles) => {
  if (!subs.length) return [];
  const ownerIds = [...new Set(subs.map((s) => String(s.userId)))];
  const owners = await User.find({ _id: { $in: ownerIds } })
    .select("currentSessionId isActive role")
    .lean();
  const byId = new Map(owners.map((u) => [String(u._id), u]));

  const keep = [];
  const superseded = [];
  for (const s of subs) {
    const owner = byId.get(String(s.userId));
    if (!owner) {
      superseded.push(s._id);
      continue;
    }
    if (!s.sessionId) continue; // legacy row: skipped until the device re-links on next login
    if (!owner.currentSessionId || owner.currentSessionId !== s.sessionId) {
      superseded.push(s._id);
      continue;
    }
    if (owner.isActive === false) continue;
    if (allowedRoles && !allowedRoles.includes(owner.role)) continue;
    keep.push(s);
  }
  if (superseded.length) {
    await PushSubscription.deleteMany({ _id: { $in: superseded } }).catch(
      () => {},
    );
  }
  return keep;
};

const sendToSubscriptions = async (subs, payload) => {
  if (!init().configured || !subs.length) return { sent: 0, removed: 0 };
  const body = JSON.stringify(payload);
  let sent = 0;
  const dead = [];

  await Promise.allSettled(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: s.endpoint,
            keys: { p256dh: s.keys.p256dh, auth: s.keys.auth },
          },
          body,
          { TTL: 60 * 60 * 24, urgency: "high" },
        );
        sent += 1;
      } catch (err) {
        // 404 / 410 = the user uninstalled the app or revoked permission
        if (err.statusCode === 404 || err.statusCode === 410) dead.push(s._id);
        else
          console.error("[push] send failed:", err.statusCode || err.message);
      }
    }),
  );

  if (dead.length) await PushSubscription.deleteMany({ _id: { $in: dead } });
  return { sent, removed: dead.length };
};

export const sendPushToUser = async (userId, payload) => {
  const subs = await PushSubscription.find({ userId }).lean();
  return sendToSubscriptions(await keepOwnedSubscriptions(subs), payload);
};

export const sendPushToAdmins = async (payload) => {
  const subs = await PushSubscription.find({
    role: { $in: ["admin", "staff"] },
  }).lean();
  return sendToSubscriptions(
    await keepOwnedSubscriptions(subs, ["admin", "staff"]),
    payload,
  );
};

// Called automatically for EVERY new Notification document (see models/Notification.js),
// so new inquiries, lookbook inquiries, orders, replies and status updates all
// reach the phone without touching those services.
export const pushForNotification = async (n) => {
  if (!n || !init().configured) return;
  const payload = {
    title: n.title,
    body: n.message,
    url: n.link || "/",
    tag: `${n.type}-${n._id}`,
  };
  try {
    if (n.isGlobalAdmin) await sendPushToAdmins(payload);
    else if (n.recipientId) await sendPushToUser(n.recipientId, payload);
  } catch (err) {
    console.error("[push] notification push failed:", err.message);
  }
};
