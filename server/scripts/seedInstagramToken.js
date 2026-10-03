import dotenv from "dotenv";
import mongoose from "mongoose";
import InstagramConfig from "../models/InstagramConfig.js";
import { syncInstagramReels } from "../services/instagramService.js";

dotenv.config();

const ASSUMED_DAYS_VALID = 45;

const run = async () => {
  const token = (process.argv[2] || "").trim();
  if (!token) {
    console.error(
      'Usage: node scripts/seedInstagramToken.js "PASTE_THE_TOKEN_HERE"',
    );
    // Forceful exit ki jagah graceful return
    process.exitCode = 1;
    return;
  }

  // 1. Make sure Instagram accepts the token before saving anything.
  const meRes = await fetch(
    `https://graph.instagram.com/me?fields=user_id,username&access_token=${encodeURIComponent(token)}`,
  );
  const me = await meRes.json();

  if (!meRes.ok || !me.username) {
    console.error(
      "Instagram rejected this token:",
      me?.error?.message || JSON.stringify(me),
    );
    console.error(
      "Generate a fresh token in the Meta App Dashboard and try again.",
    );
    // Forceful exit ki jagah graceful return, isse Windows crash nahi hoga
    process.exitCode = 1;
    return;
  }
  console.log(`Token is valid. Connected account: @${me.username}`);

  // 2. Save it.
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured in server/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  await InstagramConfig.findByIdAndUpdate(
    "instagram",
    {
      igUserId: String(me.user_id || me.id || ""),
      accessToken: token,
      tokenExpiresAt: new Date(Date.now() + ASSUMED_DAYS_VALID * 86400000),
    },
    { upsert: true, setDefaultsOnInsert: true },
  );
  console.log("Token saved to the database.");

  // 3. Run the first sync now, so problems show up immediately.
  try {
    const result = await syncInstagramReels();
    console.log(
      `First sync complete: found ${result.fetched} video(s) on @${me.username}.`,
    );
    if (result.fetched === 0) {
      console.log(
        "No videos were found. Post at least one Reel/video on the account, then re-run: node scripts/syncInstagramReels.js",
      );
    }
  } catch (err) {
    console.error("Token was saved, but the first sync failed:", err.message);
    process.exitCode = 1;
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Failed:", err);
  // Yahan se bhi process.exit(1) hata kar graceful banaya
  process.exitCode = 1;
});
