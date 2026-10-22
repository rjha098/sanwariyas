// FILE: server/scripts/auditEmailOwnership.js
//
// Read-only by default. Finds claimed inquiries whose contact `email` no
// longer matches their owner's CURRENT account email (left behind by past
// email changes), and users that share an email once case is ignored.
//
//   node scripts/auditEmailOwnership.js            -> report only (no writes)
//   node scripts/auditEmailOwnership.js --apply    -> backup JSON, then sync
//
// --apply ONLY updates `email` on inquiries that have a userId, to that
// user's current email. Nothing is deleted; unclaimed inquiries (userId null)
// and every other field are never touched. A backup of each affected
// inquiry (_id + previous email) is written first and can be restored with
//   node scripts/auditEmailOwnership.js --rollback <backup-file.json>
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Inquiry from "../models/Inquiry.js";

dotenv.config();

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const rollbackIdx = args.indexOf("--rollback");

const main = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  if (rollbackIdx !== -1) {
    const file = args[rollbackIdx + 1];
    const rows = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const row of rows) {
      await Inquiry.updateOne(
        { _id: row._id, userId: row.userId },
        { $set: { email: row.previousEmail } },
      );
    }
    console.log(`Rolled back ${rows.length} inquiries from ${file}`);
    return;
  }

  const allUsers = await User.find({}).select("_id email").lean();
  const byEmail = new Map();
  for (const u of allUsers) {
    const k = String(u.email).toLowerCase();
    byEmail.set(k, [...(byEmail.get(k) || []), u._id]);
  }
  const dupes = [...byEmail.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([email, ids]) => ({ _id: email, ids }));
  console.log(`Users sharing an email (case-insensitive): ${dupes.length}`);
  dupes.forEach((d) => console.log("  ", d._id, d.ids.map(String).join(", ")));

  const claimed = await Inquiry.find({ userId: { $ne: null } })
    .select("_id userId email")
    .lean();
  const users = await User.find({ _id: { $in: claimed.map((i) => i.userId) } })
    .select("_id email")
    .lean();
  const emailById = new Map(users.map((u) => [String(u._id), u.email]));

  const stale = [];
  const orphaned = [];
  for (const inq of claimed) {
    const current = emailById.get(String(inq.userId));
    if (current === undefined) orphaned.push(inq);
    else if (String(inq.email).toLowerCase() !== current) {
      stale.push({ _id: String(inq._id), userId: String(inq.userId), previousEmail: inq.email, newEmail: current });
    }
  }
  console.log(`Claimed inquiries: ${claimed.length}`);
  console.log(`Stale email (owner changed email): ${stale.length}`);
  stale.forEach((s) => console.log("  ", s._id, s.previousEmail, "->", s.newEmail));
  console.log(`Owner user missing (not modified): ${orphaned.length}`);

  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to sync stale rows (backup is written first).");
    return;
  }
  if (stale.length === 0) return console.log("Nothing to apply.");

  const backup = path.resolve(`inquiry-email-backup-${Date.now()}.json`);
  fs.writeFileSync(backup, JSON.stringify(stale, null, 2));
  console.log(`Backup written: ${backup}`);
  for (const s of stale) {
    await Inquiry.updateOne(
      { _id: s._id, userId: s.userId },
      { $set: { email: s.newEmail } },
    );
  }
  console.log(`Synced ${stale.length} inquiries.`);
};

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());