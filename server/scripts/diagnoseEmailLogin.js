// FILE: server/scripts/diagnoseEmailLogin.js
//
// READ-ONLY diagnostic (no writes). Answers: "why does <email> still log in?"
//
//   DIAG_PASSWORD='...' node scripts/diagnoseEmailLogin.js kramlal609@gmail.com
//   DIAG_PASSWORD='...' node scripts/diagnoseEmailLogin.js kramlal609@gmail.com --api http://localhost:5000/api
//
// 1. Lists EVERY user document whose email equals the address (any case),
//    with _id, phone, googleId, createdAt and how many inquiries it owns.
// 2. Checks the users.email unique index exists.
// 3. With DIAG_PASSWORD: runs the real loginUser() against this database
//    in-process, and (with --api) the running server's /auth/login too.
//    If the in-process login is rejected but the running server accepts it,
//    the running server is an old process / other database / old build.
//    NOTE: the --api call is a real login, so it replaces that account's
//    single-device session.
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Inquiry from "../models/Inquiry.js";
import { loginUser } from "../services/authService.js";
import { normalizeEmail } from "../utils/normalize.js";

dotenv.config();

const args = process.argv.slice(2);
const rawEmail = args.find((a) => !a.startsWith("--") && a.includes("@"));
const apiIdx = args.indexOf("--api");
const apiUrl = apiIdx !== -1 ? args[apiIdx + 1] : null;
const password = process.env.DIAG_PASSWORD || "";

if (!rawEmail) {
  console.error("Usage: node scripts/diagnoseEmailLogin.js <email> [--api <url>]");
  process.exit(1);
}

const email = normalizeEmail(rawEmail);
const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const main = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Database: ${mongoose.connection.name}`);

  const indexes = await User.collection.indexes();
  const emailIdx = indexes.find((i) => i.key?.email === 1);
  console.log(
    `users.email unique index: ${emailIdx?.unique ? "OK" : "MISSING (duplicate emails possible!)"}`,
  );

  const users = await User.find({ email: new RegExp(`^${escaped}$`, "i") })
    .select("_id email phone googleId isActive role createdAt updatedAt")
    .lean();
  console.log(`\nUser documents with email "${email}": ${users.length}`);
  for (const u of users) {
    const owned = await Inquiry.countDocuments({ userId: u._id });
    console.log(
      `  _id=${u._id} email="${u.email}" phone=${u.phone} role=${u.role} active=${u.isActive} ` +
        `google=${u.googleId ? "linked" : "no"} created=${u.createdAt?.toISOString()} ownedInquiries=${owned}`,
    );
  }
  if (users.length === 0) console.log("  (none) -> nobody can password-login with this email.");
  if (users.length > 1) console.log("  !! several documents share this email (case variants).");

  const unclaimed = await Inquiry.countDocuments({ userId: null, email });
  const claimedWithEmail = await Inquiry.countDocuments({ userId: { $ne: null }, email });
  console.log(`\nInquiries with email "${email}": unclaimed=${unclaimed}, claimed=${claimedWithEmail}`);

  if (!password) {
    console.log("\nSet DIAG_PASSWORD to also test the login itself.");
    return;
  }

  let dbId = null;
  try {
    const u = await loginUser(email, password);
    dbId = u.id;
    console.log(`\n[in-process loginUser] ACCEPTED -> user _id=${u.id}`);
  } catch (e) {
    console.log(`\n[in-process loginUser] REJECTED (${e.message})`);
  }

  if (apiUrl) {
    try {
      const r = await fetch(`${apiUrl.replace(/\/$/, "")}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password }),
      });
      const j = await r.json().catch(() => ({}));
      console.log(`[running server ${apiUrl}] HTTP ${r.status} -> user id=${j.user?.id || "none"} email=${j.user?.email || "-"}`);
      if (r.ok && j.user && !dbId) {
        console.log(
          "VERDICT: the running server accepts a login that this code + this database reject -> " +
            "it is an OLD process/build or points at a different database. Restart it from this folder.",
        );
      } else if (r.ok && j.user && dbId && j.user.id !== dbId) {
        console.log("VERDICT: server and script resolve to DIFFERENT users -> different database.");
      } else if (!r.ok && !dbId) {
        console.log("VERDICT: both reject this login. Old identifier is not valid for password login.");
      }
    } catch (e) {
      console.log(`[running server] unreachable: ${e.message}`);
    }
  }
};

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());