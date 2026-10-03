// FILE: server/services/instagramService.js
// PURPOSE: Talks to Instagram's Graph API. Two jobs:
//   1. Keep the long-lived access token fresh (it expires every 60 days).
//   2. Pull the account's Reels and cache them in our own database.
// Both are called together by scripts/syncInstagramReels.js, which is
// meant to run on a schedule (cron) — see that file for setup.

import InstagramConfig from "../models/InstagramConfig.js";
import InstagramReel from "../models/InstagramReel.js";

const GRAPH_API_BASE = "https://graph.instagram.com";

// Refreshes the long-lived token if it's due to expire soon. Instagram
// requires this to happen BEFORE the 60-day window closes — an already
// expired token cannot be refreshed, only re-authorized from scratch
// (the manual browser step). Refreshing at the 45-day mark leaves a wide
// safety margin even if the sync job doesn't run for a few days.
const refreshTokenIfNeeded = async (config) => {
  const daysUntilExpiry = config.tokenExpiresAt
    ? (config.tokenExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    : -1;

  if (daysUntilExpiry > 15) {
    // Still comfortably valid — nothing to do.
    return config.accessToken;
  }

  const url = `${GRAPH_API_BASE}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(config.accessToken)}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(
      `Failed to refresh Instagram token: ${data?.error?.message || "unknown error"}. ` +
        `If the token has already expired, generate a new one in the Meta App Dashboard and re-run: node scripts/seedInstagramToken.js "NEW_TOKEN"`,
    );
  }

  config.accessToken = data.access_token;
  config.tokenExpiresAt = new Date(Date.now() + data.expires_in * 1000);
  await config.save();

  return config.accessToken;
};

// Fetches the account's media, keeps only Reels, and upserts them into
// our cache. Uses upsert (not delete-then-reinsert) so a reel that
// briefly fails to fetch on one run doesn't vanish from the site.
export const syncInstagramReels = async () => {
  const config = await InstagramConfig.findById("instagram");
  if (!config || !config.accessToken) {
    throw new Error(
      'No Instagram access token configured. Run: node scripts/seedInstagramToken.js "YOUR_TOKEN" first.',
    );
  }

  const accessToken = await refreshTokenIfNeeded(config);

  // NOTE on fields: Instagram returns media_type "VIDEO" for Reels — there
  // is no "REELS" value on this field (that only exists as an upload
  // parameter). Since Instagram now publishes most videos as Reels anyway,
  // keeping every VIDEO item is the right filter for a "Reels" section.
  const fields =
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const url = `${GRAPH_API_BASE}/me/media?fields=${fields}&limit=50&access_token=${encodeURIComponent(accessToken)}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Instagram API error: ${data?.error?.message || response.statusText}`,
    );
  }

  const videos = (data.data || []).filter(
    (item) => item.media_type === "VIDEO",
  );

  let savedCount = 0;
  for (const video of videos) {
    await InstagramReel.findOneAndUpdate(
      { mediaId: video.id },
      {
        mediaId: video.id,
        caption: video.caption || "",
        // Omitted by Instagram for Reels with copyrighted audio — store an
        // empty string and let the website link out to Instagram instead.
        mediaUrl: video.media_url || "",
        thumbnailUrl: video.thumbnail_url || "",
        permalink: video.permalink || "",
        postedAt: video.timestamp ? new Date(video.timestamp) : null,
      },
      { upsert: true },
    );
    savedCount += 1;
  }

  // Remove reels that were deleted on Instagram, otherwise their cached
  // (eventually expired) video/thumbnail URLs would leave broken cards on
  // the homepage forever. Guarded on a non-empty result so a one-off empty
  // response from Instagram can never wipe the whole cache.
  if (videos.length > 0) {
    await InstagramReel.deleteMany({
      mediaId: { $nin: videos.map((v) => v.id) },
    });
  }

  config.lastSyncedAt = new Date();
  await config.save();

  return { fetched: videos.length, saved: savedCount };
};

// Read-only accessor used by the public controller — the website always
// reads from the cache, never calls Instagram directly on a page load.
export const getCachedReels = async (limit = 12) => {
  return InstagramReel.find({}).sort({ postedAt: -1 }).limit(limit).lean();
};
