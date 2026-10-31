// // FILE: client/src/lib/pushClient.js
// // // Browser side of Web Push: register the service worker, ask permission,
// // subscribe, and tell the server about this device.
// import api from "@/lib/api";

// const auth = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// export const isIOS = () =>
//   typeof navigator !== "undefined" &&
//   (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
//     (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

// export const isStandalone = () =>
//   typeof window !== "undefined" &&
//   (window.matchMedia("(display-mode: standalone)").matches ||
//     window.navigator.standalone === true);

// export const pushSupported = () =>
//   typeof window !== "undefined" &&
//   "serviceWorker" in navigator &&
//   "PushManager" in window &&
//   "Notification" in window;

// const urlBase64ToUint8Array = (base64) => {
//   const padding = "=".repeat((4 - (base64.length % 4)) % 4);
//   const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
//   return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
// };

// export const registerServiceWorker = () =>
//   navigator.serviceWorker.register("/sw.js", { scope: "/" });

// // Runs one step and tags any error with the step name, so the screen can say
// // exactly WHERE enabling notifications failed.
// const step = async (name, fn) => {
//   try {
//     return await fn();
//   } catch (e) {
//     e.pushStep = name;
//     throw e;
//   }
// };

// // Subscribes this device (permission must already be "granted") and saves it for the logged-in user.
// export const subscribeThisDevice = async (token) => {
//   const reg = await step("service-worker", async () => {
//     const r = await registerServiceWorker();
//     await navigator.serviceWorker.ready;
//     return r;
//   });

//   let sub = await reg.pushManager.getSubscription();
//   if (!sub) {
//     const publicKey = await step(
//       "server-key",
//       async () =>
//         (await api.get("/notification/push/public-key")).data.publicKey,
//     );
//     sub = await step("browser-subscribe", () =>
//       reg.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: urlBase64ToUint8Array(publicKey),
//       }),
//     );
//   }
//   await step("save-device", () =>
//     api.post(
//       "/notification/push/subscribe",
//       { subscription: sub.toJSON(), userAgent: navigator.userAgent },
//       auth(token),
//     ),
//   );
//   return sub;
// };

// export const unsubscribeThisDevice = async (token) => {
//   const reg = await navigator.serviceWorker.getRegistration("/");
//   const sub = await reg?.pushManager.getSubscription();
//   if (!sub) return;
//   await api
//     .post(
//       "/notification/push/unsubscribe",
//       { endpoint: sub.endpoint },
//       auth(token),
//     )
//     .catch(() => {});
//   await sub.unsubscribe();
// };

// // Used on logout: reads this device's push endpoint, then drops the browser
// // subscription so the endpoint stops working for the account being logged out.
// // Returns the endpoint (or null) so the server can detach it too.
// export const releaseThisDevice = async () => {
//   try {
//     if (!pushSupported()) return null;
//     const reg = await navigator.serviceWorker.getRegistration("/");
//     const sub = await reg?.pushManager.getSubscription();
//     if (!sub) return null;
//     const endpoint = sub.endpoint;
//     sub.unsubscribe().catch(() => {});
//     return endpoint;
//   } catch {
//     return null;
//   }
// };

// FILE: client/src/lib/pushClient.js
// Browser side of Web Push: register the service worker, ask permission,
// subscribe, and tell the server about this device.
//
// Every step that can wait on the browser / phone / network has a time limit,
// so the screen can never stay on "Please wait..." forever (this happened on
// iPhone when a step never answered).
import api from "@/lib/api";

const auth = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const isIOS = () =>
  typeof navigator !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

export const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true);

export const pushSupported = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

const urlBase64ToUint8Array = (base64) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
};

export const registerServiceWorker = () =>
  navigator.serviceWorker.register("/sw.js", { scope: "/" });

// Rejects with { isTimeout: true, pushStep: name } if `promise` does not finish in `ms`.
export const withTimeout = (promise, ms, name) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const e = new Error(`${name} timed out`);
      e.pushStep = name;
      e.isTimeout = true;
      reject(e);
    }, ms);
    Promise.resolve(promise).then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });

// Runs one step and tags any error with the step name, so the screen can say
// what failed (kept in plain words, not shown as codes).
const step = async (name, fn) => {
  try {
    return await fn();
  } catch (e) {
    if (!e.pushStep) e.pushStep = name;
    throw e;
  }
};

// Asks the phone for permission. Long limit: the person may take time to decide.
export const askPermission = () =>
  withTimeout(Notification.requestPermission(), 60000, "permission");

// Push calls must fail fast and must NOT silently wait out a 429 lockout
// (api.js would otherwise sit on "Please wait" for minutes).
const pushCall = { timeout: 15000, skipRateLimitRetry: true };

// Subscribes this device (permission must already be "granted") and saves it for the logged-in user.
export const subscribeThisDevice = async (token) => {
  const reg = await step("service-worker", async () => {
    await registerServiceWorker();
    // resolves with the ACTIVE registration; on iPhone this is the step that can stall
    return withTimeout(navigator.serviceWorker.ready, 10000, "service-worker");
  });

  let sub = await step("service-worker", () =>
    withTimeout(reg.pushManager.getSubscription(), 8000, "service-worker"),
  );
  if (!sub) {
    const publicKey = await step(
      "server-key",
      async () =>
        (await api.get("/notification/push/public-key", pushCall)).data
          .publicKey,
    );
    sub = await step("browser-subscribe", () =>
      withTimeout(
        reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }),
        20000,
        "browser-subscribe",
      ),
    );
  }
  await step("save-device", () =>
    api.post(
      "/notification/push/subscribe",
      { subscription: sub.toJSON(), userAgent: navigator.userAgent },
      { ...auth(token), ...pushCall },
    ),
  );
  return sub;
};

export const unsubscribeThisDevice = async (token) => {
  const reg = await navigator.serviceWorker.getRegistration("/");
  const sub = await reg?.pushManager.getSubscription();
  if (!sub) return;
  await api
    .post(
      "/notification/push/unsubscribe",
      { endpoint: sub.endpoint },
      auth(token),
    )
    .catch(() => {});
  await sub.unsubscribe();
};

// Used on logout: reads this device's push endpoint, then drops the browser
// subscription so the endpoint stops working for the account being logged out.
// Returns the endpoint (or null) so the server can detach it too.
export const releaseThisDevice = async () => {
  try {
    if (!pushSupported()) return null;
    const reg = await navigator.serviceWorker.getRegistration("/");
    const sub = await reg?.pushManager.getSubscription();
    if (!sub) return null;
    const endpoint = sub.endpoint;
    sub.unsubscribe().catch(() => {});
    return endpoint;
  } catch {
    return null;
  }
};
