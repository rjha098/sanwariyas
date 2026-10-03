// FILE: server/models/InstagramReel.js
// PURPOSE: Caches the Instagram account's Reels so the website reads from
// our own database (instant, no rate limit) instead of calling Instagram's
// API on every single visitor page load. Instagram allows only 200 API
// calls per hour per app — serving live traffic directly from the Graph
// API would exhaust that in minutes on any real traffic.

import mongoose from "mongoose";

const instagramReelSchema = new mongoose.Schema(
  {
    // Instagram's own media ID — used to detect new vs. already-seen reels.
    mediaId: { type: String, required: true, unique: true },
    caption: { type: String, default: "" },
    // Direct, playable video file URL. Instagram OMITS this field for
    // Reels that use copyrighted audio (very common with trending music),
    // so it can legitimately be empty — the website falls back to showing
    // the thumbnail and linking out to the reel on Instagram.
    mediaUrl: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
    permalink: { type: String, default: "" }, // link back to the reel on instagram.com
    postedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.model("InstagramReel", instagramReelSchema);