// // FILE: client/src/lib/pushClient.js
// // Browser side of Web Push: register the service worker, ask permission,
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

// // Subscribes this device (permission must already be "granted") and saves it for the logged-in user.
// export const subscribeThisDevice = async (token) => {
//   const reg = await registerServiceWorker();
//   await navigator.serviceWorker.ready;

//   let sub = await reg.pushManager.getSubscription();
//   if (!sub) {
//     const { data } = await api.get("/notification/push/public-key");
//     sub = await reg.pushManager.subscribe({
//       userVisibleOnly: true,
//       applicationServerKey: urlBase64ToUint8Array(data.publicKey),
//     });
//   }
//   await api.post(
//     "/notification/push/subscribe",
//     { subscription: sub.toJSON(), userAgent: navigator.userAgent },
//     auth(token),
//   );
//   return sub;
// };

// export const unsubscribeThisDevice = async (token) => {
//   const reg = await navigator.serviceWorker.getRegistration("/");
//   const sub = await reg?.pushManager.getSubscription();
//   if (!sub) return;
//   await api
//     .post("/notification/push/unsubscribe", { endpoint: sub.endpoint }, auth(token))
//     .catch(() => {});
//   await sub.unsubscribe();
// };

// export const sendTestPush = (token) =>
//   api.post("/notification/push/test", {}, auth(token)).then((r) => r.data);




// FILE: client/src/lib/pushClient.js
// Browser side of Web Push: register the service worker, ask permission,
// subscribe, and tell the server about this device.
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

// Runs one step and tags any error with the step name, so the screen can say
// exactly WHERE enabling notifications failed.
const step = async (name, fn) => {
  try {
    return await fn();
  } catch (e) {
    e.pushStep = name;
    throw e;
  }
};

// Subscribes this device (permission must already be "granted") and saves it for the logged-in user.
export const subscribeThisDevice = async (token) => {
  const reg = await step("service-worker", async () => {
    const r = await registerServiceWorker();
    await navigator.serviceWorker.ready;
    return r;
  });

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    const publicKey = await step(
      "server-key",
      async () => (await api.get("/notification/push/public-key")).data.publicKey,
    );
    sub = await step("browser-subscribe", () =>
      reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      }),
    );
  }
  await step("save-device", () =>
    api.post(
      "/notification/push/subscribe",
      { subscription: sub.toJSON(), userAgent: navigator.userAgent },
      auth(token),
    ),
  );
  return sub;
};

export const unsubscribeThisDevice = async (token) => {
  const reg = await navigator.serviceWorker.getRegistration("/");
  const sub = await reg?.pushManager.getSubscription();
  if (!sub) return;
  await api
    .post("/notification/push/unsubscribe", { endpoint: sub.endpoint }, auth(token))
    .catch(() => {});
  await sub.unsubscribe();
};

export const sendTestPush = (token) =>
  api.post("/notification/push/test", {}, auth(token)).then((r) => r.data);