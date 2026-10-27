// // FILE: client/src/components/ui/PushNotificationPrompt.js
// //
// // Asks logged-in people (customers + admin/staff) to allow phone notifications.
// //  • Android / desktop: one tap on "Turn on" → permission → device saved.
// //  • iPhone: push only works from the Home-Screen app, so before that we show
// //    the "Add to Home Screen" steps instead of a button that cannot work.
// //  • Already allowed: quietly re-links this device to the current account.
// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import {
//   isIOS,
//   isStandalone,
//   pushSupported,
//   registerServiceWorker,
//   subscribeThisDevice,
//   sendTestPush,
// } from "@/lib/pushClient";

// const DISMISS_KEY = "sanwariyas_push_dismissed_at";
// const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

// // Turns any failure into a message that names the step that failed.
// const describeError = (err) => {
//   const status = err?.response?.status;
//   const detail = err?.response?.data?.message || err?.message || "";
//   return `Could not turn on notifications [${err?.pushStep || "unknown"}${
//     status ? " " + status : ""
//   }]${detail ? ": " + detail : ""}`;
// };

// export default function PushNotificationPrompt() {
//   const { isAuthenticated, token } = useAuth();
//   const [mode, setMode] = useState(null); // null | "ask" | "ios-install" | "done"
//   const [busy, setBusy] = useState(false);
//   const [msg, setMsg] = useState("");

//   useEffect(() => {
//     // the service worker also makes the site installable — register it for everyone
//     if (typeof window !== "undefined" && "serviceWorker" in navigator) {
//       registerServiceWorker().catch(() => {});
//     }
//   }, []);

//   useEffect(() => {
//     if (!isAuthenticated || !token || typeof window === "undefined") return;

//     const debug = new URLSearchParams(window.location.search).get("pushdebug") === "1";
//     const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
//     const recentlyDismissed = !debug && Date.now() - dismissedAt < SEVEN_DAYS;

//     // iPhone / iPad opened in Safari (not from the home-screen icon)
//     if (isIOS() && !isStandalone()) {
//       if (!recentlyDismissed) {
//         const t = setTimeout(() => setMode("ios-install"), 5000);
//         return () => clearTimeout(t);
//       }
//       return;
//     }
//     if (!pushSupported()) return;

//     if (Notification.permission === "granted") {
//       // already allowed: make sure this device is linked to the account that is logged in now.
//       // If that fails, tell the person (and us) exactly why instead of staying silent.
//       subscribeThisDevice(token).catch((err) => {
//         if (recentlyDismissed) return;
//         setMsg(describeError(err));
//         setMode("error");
//       });
//       return;
//     }
//     if (Notification.permission === "denied") {
//       if (!recentlyDismissed) setMode("blocked");
//       return;
//     }
//     if (recentlyDismissed) return;

//     const t = setTimeout(() => setMode("ask"), 4000);
//     return () => clearTimeout(t);
//   }, [isAuthenticated, token]);

//   const dismiss = () => {
//     try {
//       localStorage.setItem(DISMISS_KEY, String(Date.now()));
//     } catch {}
//     setMode(null);
//   };

//   const enable = async () => {
//     setBusy(true);
//     setMsg("");
//     try {
//       const permission = await Notification.requestPermission(); // needs this tap
//       if (permission !== "granted") {
//         setMsg("Notifications were blocked. You can allow them from the browser's site settings.");
//         return;
//       }
//       await subscribeThisDevice(token);
//       setMode("done");
//     } catch (err) {
//       setMsg(describeError(err));
//     } finally {
//       setBusy(false);
//     }
//   };

//   const retry = async () => {
//     setBusy(true);
//     setMsg("");
//     try {
//       await subscribeThisDevice(token);
//       setMode("done");
//     } catch (err) {
//       setMsg(describeError(err));
//     } finally {
//       setBusy(false);
//     }
//   };

//   const test = async () => {
//     setBusy(true);
//     try {
//       await sendTestPush(token);
//       setMsg("Test sent — check your notifications.");
//     } catch (err) {
//       setMsg(err?.response?.data?.message || "Test failed.");
//     } finally {
//       setBusy(false);
//     }
//   };

//   if (!mode) return null;

//   return (
//     <div
//       role="dialog"
//       aria-label="Phone notifications"
//       className="fixed z-[90] left-3 right-3 bottom-24 md:left-auto md:right-6 md:bottom-28 md:w-[360px] rounded-2xl border border-[#BE6E5B]/25 bg-[#FDF7F2] shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-5 text-[#5C3120]"
//     >
//       <button
//         type="button"
//         onClick={dismiss}
//         aria-label="Close"
//         className="absolute top-2 right-3 text-xl text-[#a07f61] hover:text-[#7A3D2A]"
//       >
//         &times;
//       </button>

//       {mode === "ask" && (
//         <>
//           <p className="font-display text-lg font-bold mb-1">Get instant alerts 🔔</p>
//           <p className="font-sans text-sm text-[#7a5a45] mb-4">
//             Turn on notifications to know the moment there is a reply, an order update or a new inquiry.
//           </p>
//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={enable}
//               disabled={busy}
//               className="px-5 py-2.5 rounded-full bg-[#7A3D2A] text-white font-sans text-[11px] tracking-[0.18em] uppercase font-bold hover:bg-[#5f2e1f] disabled:opacity-60"
//             >
//               {busy ? "Please wait…" : "Turn on"}
//             </button>
//             <button type="button" onClick={dismiss} className="font-sans text-[11px] tracking-[0.18em] uppercase text-[#a07f61] hover:text-[#7A3D2A]">
//               Not now
//             </button>
//           </div>
//         </>
//       )}

//       {mode === "ios-install" && (
//         <>
//           <p className="font-display text-lg font-bold mb-1">Notifications on iPhone</p>
//           <ol className="font-sans text-sm text-[#7a5a45] list-decimal pl-5 space-y-1 mb-3">
//             <li>Tap the <strong>Share</strong> button in Safari.</li>
//             <li>Choose <strong>Add to Home Screen</strong>.</li>
//             <li>Open SANWARIYAS from the new home-screen icon, log in, then tap <strong>Turn on</strong>.</li>
//           </ol>
//           <p className="font-sans text-xs text-[#a07f61]">Needs iOS 16.4 or newer.</p>
//         </>
//       )}

//       {mode === "error" && (
//         <>
//           <p className="font-display text-lg font-bold mb-1">Notifications need attention</p>
//           <p className="font-sans text-sm text-[#7a5a45] mb-3">
//             Permission is allowed, but this device could not be registered.
//           </p>
//           <button
//             type="button"
//             onClick={retry}
//             disabled={busy}
//             className="px-4 py-2 rounded-full bg-[#7A3D2A] text-white font-sans text-[11px] tracking-[0.18em] uppercase font-bold hover:bg-[#5f2e1f] disabled:opacity-60"
//           >
//             {busy ? "Please wait…" : "Try again"}
//           </button>
//         </>
//       )}

//       {mode === "blocked" && (
//         <>
//           <p className="font-display text-lg font-bold mb-1">Notifications are blocked</p>
//           <p className="font-sans text-sm text-[#7a5a45]">
//             Open the browser menu (⋮) → <strong>Settings</strong> → <strong>Site settings</strong> →{" "}
//             <strong>Notifications</strong>, allow this site, then reload.
//           </p>
//         </>
//       )}

//       {mode === "done" && (
//         <>
//           <p className="font-display text-lg font-bold mb-1">Notifications are on ✅</p>
//           <p className="font-sans text-sm text-[#7a5a45] mb-3">You will now get alerts on this device.</p>
//           <button
//             type="button"
//             onClick={test}
//             disabled={busy}
//             className="px-4 py-2 rounded-full border border-[#7A3D2A] text-[#7A3D2A] font-sans text-[11px] tracking-[0.18em] uppercase font-bold hover:bg-[#7A3D2A] hover:text-white disabled:opacity-60"
//           >
//             Send a test
//           </button>
//         </>
//       )}

//       {msg && <p role="status" className="mt-3 font-sans text-xs text-[#8C3B3B]">{msg}</p>}
//     </div>
//   );
// }











// FILE: client/src/components/ui/PushNotificationPrompt.js
//
// Asks logged-in people (customers + admin/staff) to allow phone notifications.
//  • Android / desktop: one tap on "Turn on" → permission → device saved.
//  • iPhone: push only works from the Home-Screen app, so before that we show
//    the "Add to Home Screen" steps instead of a button that cannot work.
//  • Already allowed: quietly re-links this device to the current account
//    (never shows an error popup for that background step).
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  isIOS,
  isStandalone,
  pushSupported,
  registerServiceWorker,
  subscribeThisDevice,
} from "@/lib/pushClient";

const DISMISS_KEY = "sanwariyas_push_dismissed_at";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

// Plain-language message for a failure after the person tapped "Turn on".
// No step names / status codes on screen — the details go to the console.
const friendlyError = (err) => {
  console.warn("[push] could not enable notifications:", err?.pushStep, err);
  const status = err?.response?.status;
  if (status === 401) return "Please log in again, then turn on notifications.";
  if (status === 503) return "Notifications are not available right now. Please try later.";
  if (!err?.response) return "Please check your internet connection and try again.";
  return "Could not turn on notifications. Please try again.";
};

export default function PushNotificationPrompt() {
  const { isAuthenticated, token } = useAuth();
  const [mode, setMode] = useState(null); // null | "ask" | "ios-install" | "blocked" | "done"
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // the service worker also makes the site installable — register it for everyone
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      registerServiceWorker().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !token || typeof window === "undefined") return;

    const debug = new URLSearchParams(window.location.search).get("pushdebug") === "1";
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    const recentlyDismissed = !debug && Date.now() - dismissedAt < SEVEN_DAYS;

    // iPhone / iPad opened in Safari (not from the home-screen icon)
    if (isIOS() && !isStandalone()) {
      if (!recentlyDismissed) {
        const t = setTimeout(() => setMode("ios-install"), 5000);
        return () => clearTimeout(t);
      }
      return;
    }
    if (!pushSupported()) return;

    if (Notification.permission === "granted") {
      // already allowed: quietly make sure this device is linked to the account that is
      // logged in now. This is a background step, so a failure is only logged — the person
      // can't do anything about it, and an error popup would just be noise.
      subscribeThisDevice(token).catch((err) => {
        console.warn("[push] background device link failed:", err?.pushStep, err?.message);
      });
      return;
    }
    if (Notification.permission === "denied") {
      if (!recentlyDismissed) setMode("blocked");
      return;
    }
    if (recentlyDismissed) return;

    const t = setTimeout(() => setMode("ask"), 4000);
    return () => clearTimeout(t);
  }, [isAuthenticated, token]);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
    setMode(null);
  };

  const enable = async () => {
    setBusy(true);
    setMsg("");
    try {
      const permission = await Notification.requestPermission(); // needs this tap
      if (permission !== "granted") {
        setMsg("Notifications were blocked. You can allow them from the browser's site settings.");
        return;
      }
      await subscribeThisDevice(token);
      setMode("done");
    } catch (err) {
      setMsg(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  // success card closes itself
  useEffect(() => {
    if (mode !== "done") return;
    const t = setTimeout(() => setMode(null), 3000);
    return () => clearTimeout(t);
  }, [mode]);

  if (!mode) return null;

  return (
    <div
      role="dialog"
      aria-label="Phone notifications"
      className="fixed z-[90] left-3 right-3 bottom-24 md:left-auto md:right-6 md:bottom-28 md:w-[360px] rounded-2xl border border-[#BE6E5B]/25 bg-[#FDF7F2] shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-5 text-[#5C3120]"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Close"
        className="absolute top-2 right-3 text-xl text-[#a07f61] hover:text-[#7A3D2A]"
      >
        &times;
      </button>

      {mode === "ask" && (
        <>
          <p className="font-display text-lg font-bold mb-1">Get instant alerts 🔔</p>
          <p className="font-sans text-sm text-[#7a5a45] mb-4">
            Turn on notifications to know the moment there is a reply, an order update or a new inquiry.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={enable}
              disabled={busy}
              className="px-5 py-2.5 rounded-full bg-[#7A3D2A] text-white font-sans text-[11px] tracking-[0.18em] uppercase font-bold hover:bg-[#5f2e1f] disabled:opacity-60"
            >
              {busy ? "Please wait…" : "Turn on"}
            </button>
            <button type="button" onClick={dismiss} className="font-sans text-[11px] tracking-[0.18em] uppercase text-[#a07f61] hover:text-[#7A3D2A]">
              Not now
            </button>
          </div>
        </>
      )}

      {mode === "ios-install" && (
        <>
          <p className="font-display text-lg font-bold mb-1">Notifications on iPhone</p>
          <ol className="font-sans text-sm text-[#7a5a45] list-decimal pl-5 space-y-1 mb-3">
            <li>Tap the <strong>Share</strong> button in Safari.</li>
            <li>Choose <strong>Add to Home Screen</strong>.</li>
            <li>Open SANWARIYAS from the new home-screen icon, log in, then tap <strong>Turn on</strong>.</li>
          </ol>
          <p className="font-sans text-xs text-[#a07f61]">Needs iOS 16.4 or newer.</p>
        </>
      )}

      {mode === "blocked" && (
        <>
          <p className="font-display text-lg font-bold mb-1">Notifications are blocked</p>
          <p className="font-sans text-sm text-[#7a5a45]">
            Open the browser menu (⋮) → <strong>Settings</strong> → <strong>Site settings</strong> →{" "}
            <strong>Notifications</strong>, allow this site, then reload.
          </p>
        </>
      )}

      {mode === "done" && (
        <>
          <p className="font-display text-lg font-bold mb-1">Notifications are on ✅</p>
          <p className="font-sans text-sm text-[#7a5a45]">You will now get alerts on this device.</p>
        </>
      )}

      {msg && <p role="status" className="mt-3 font-sans text-xs text-[#8C3B3B]">{msg}</p>}
    </div>
  );
}