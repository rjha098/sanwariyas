// FILE: server/models/InstagramConfig.js
// PURPOSE: A single-document collection holding the Instagram Business
// account's access token and its expiry. Only ever one document exists
// (there's only one connected Instagram account for this site), found by
// the fixed _id "instagram".

import mongoose from "mongoose";

const instagramConfigSchema = new mongoose.Schema({
  _id: { type: String, default: "instagram" },
  igUserId: { type: String, default: "" },
  accessToken: { type: String, default: "" },
  // Long-lived tokens last 60 days. We store when it expires so the sync
  // job knows to refresh it well before then, instead of waiting for it
  // to actually fail.
  tokenExpiresAt: { type: Date, default: null },
  lastSyncedAt: { type: Date, default: null },
});

export default mongoose.model("InstagramConfig", instagramConfigSchema);