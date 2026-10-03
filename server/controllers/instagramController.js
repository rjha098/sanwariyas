// FILE: server/controllers/instagramController.js

import { getCachedReels } from "../services/instagramService.js";

// GET /api/instagram/reels — public, read-only. Reads from our own cache
// (InstagramReel collection), never calls Instagram's API directly. This
// is what keeps the site fast and inside Instagram's 200-calls/hour limit
// no matter how much traffic the site itself gets.
export const getReels = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 24);
    const reels = await getCachedReels(limit);
    return res.json({ success: true, reels });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to load Instagram reels right now.",
    });
  }
};