// FILE: client/src/components/festival/diwaliConfig.js
//
// ONE place to control the whole Diwali experience.
// After Diwali: set `enabled: false` (or just wait — everything hides itself
// automatically after `hideAfter`).

export const DIWALI = {
  enabled: true,

  // Lakshmi Puja evening (IST). Diwali 2026 = Sunday, 8 November 2026.
  // Muhurat differs city to city — adjust the time if you want it exact.
  target: "2026-11-08T18:00:00+05:30",

  // Everything disappears automatically after this moment.
  hideAfter: "2026-11-14T23:59:59+05:30",

  // ── Words ────────────────────────────────────────────────────────────
  hindi: "शुभ दीपावली",
  english: "Happy Diwali",
  bannerEyebrow: "Festival of Lights · Diwali 2026",
  bannerLine: "Warm wishes from the SANWARIYAS family",
  bannerWish:
    "May the glow of a thousand diyas bring prosperity to your boutique, joy to your family and success to every season ahead. Thank you for being a part of our journey.",
  overlayWish:
    "May the light of this Diwali fill your home with joy, your business with prosperity, and every dream you carry with a bright new beginning.",
  overlaySign: "With gratitude · The SANWARIYAS Family, Jaipur",
  countdownLabel: "Countdown",
  doneLine: "Today we light the lamps — Happy Diwali!",

  // ── Buttons ──────────────────────────────────────────────────────────
  primaryCta: { label: "Send Wholesale Inquiry", href: "/contact" },
  secondaryCta: { label: "", href: "" },

  // ── Full-screen greeting popup ───────────────────────────────────────
  // It is rendered together with the first page HTML, so it appears the
  // moment the website opens (no delay, no homepage flash behind it).
  greeting: {
    showOnPaths: ["/"], // only on the homepage
    storageKey: "sw_diwali_greeting_2026",
    oncePerSession: true, // true = once per tab/session, false = on EVERY page load
    autoCloseMs: 0, // 0 = visitor closes it; e.g. 14000 = auto close after 14s
    enterLabel: "Enter SANWARIYAS",
  },
};

export function isDiwaliLive(now = Date.now()) {
  if (!DIWALI.enabled) return false;
  return now <= new Date(DIWALI.hideAfter).getTime();
}