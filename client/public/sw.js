/* SANWARIYAS service worker — receives Web Push messages and shows them as
   phone / desktop notifications, even when the site or app is closed.
   It does NOT cache anything, so it can never serve stale pages. */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "SANWARIYAS";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "",
      icon: "/icons/icon-192.png",
      badge: "/icons/badge-72.png",
      tag: data.tag || undefined,
      renotify: Boolean(data.tag),
      data: { url: data.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(
    (event.notification.data && event.notification.data.url) || "/",
    self.location.origin,
  ).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(async (list) => {
        for (const client of list) {
          if (client.url.startsWith(self.location.origin) && "focus" in client) {
            try {
              await client.navigate(target);
            } catch {
              /* some browsers block navigate — focusing is enough */
            }
            return client.focus();
          }
        }
        return self.clients.openWindow(target);
      }),
  );
});