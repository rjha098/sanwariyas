// FILE: server/scripts/syncInstagramReels.js
// PURPOSE: Run this on a schedule (cron) to automatically pull new Reels
// from Instagram and keep the access token refreshed. This is what makes
// "post a new Reel -> it shows up on the website" happen without you
// touching anything.
//
// SETUP (run once on the production VPS, after seedInstagramToken.js has
// been run successfully at least once):
//   1. chmod +x server/scripts/syncInstagramReels.js  (not required for a
//      .js file run via `node`, but harmless)
//   2. Add to crontab (crontab -e) — runs every 6 hours:
//        0 */6 * * * cd /path/to/server && /usr/bin/node scripts/syncInstagramReels.js >> /var/log/instagram-sync.log 2>&1

import dotenv from "dotenv";
import mongoose from "mongoose";
import { syncInstagramReels } from "../services/instagramService.js";

dotenv.config();

const run = async () => {

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured in server/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);


  console.log(`[${new Date().toISOString()}] Starting Instagram Reels sync...`);
  const result = await syncInstagramReels();
  console.log(
    `[${new Date().toISOString()}] Sync complete. Fetched ${result.fetched}, saved/updated ${result.saved}.`,
  );

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(
    `[${new Date().toISOString()}] Instagram sync FAILED:`,
    err.message,
  );
  process.exit(1);
});
