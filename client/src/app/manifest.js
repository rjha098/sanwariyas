// FILE: client/src/app/manifest.js
// Makes the website installable ("Add to Home screen") as an app.
// Next.js serves this at /manifest.webmanifest and links it automatically.
export default function manifest() {
  return {
    name: "SANWARIYAS — Wholesale Ethnic Wear",
    short_name: "SANWARIYAS",
    description:
      "Premium ethnic wear manufacturer & wholesale supplier in Jaipur.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FAF3E8", // splash screen colour only (icons themselves are transparent)
    theme_color: "#FAF3E8",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}