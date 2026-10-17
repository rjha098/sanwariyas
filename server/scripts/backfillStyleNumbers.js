// Usage (from /server):  node scripts/backfillStyleNumbers.js
// Gives every EXISTING lookbook photo without a style number the next free
// "SW-0001"-style code (oldest photo gets the lowest number).
import "dotenv/config";
import mongoose from "mongoose";
import Lookbook from "../models/Lookbook.js";
import Counter from "../models/Counter.js";

await mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/clothing_business",
);

const items = await Lookbook.find({
  $or: [{ styleNumber: "" }, { styleNumber: { $exists: false } }],
}).sort({ createdAt: 1 });


let n = 0;
for (const item of items) {
  for (;;) {
    const c = await Counter.findOneAndUpdate(
      { _id: "lookbookStyle" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    const code = `SW-${String(c.seq).padStart(4, "0")}`;
    if (!(await Lookbook.exists({ styleNumber: code }))) {
      item.styleNumber = code;
      await item.save();
      n++;
      break;
    }
  }
}

console.log(`Done. ${n} photo(s) updated.`);
await mongoose.disconnect();
