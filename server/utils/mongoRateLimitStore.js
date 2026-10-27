import mongoose from "mongoose";

const COLLECTION = "ratelimits";
let indexReady = null;

export class MongoRateLimitStore {
  constructor({ prefix = "rl" } = {}) {
    this.prefix = prefix;
    this.windowMs = 60 * 1000;
  }
  init(options) {
    this.windowMs = options.windowMs;
  }
  get col() {
    return mongoose.connection.collection(COLLECTION);
  }
  k(key) {
    return `${this.prefix}:${key}`;
  }
  async ensureIndex() {
    indexReady ||= this.col
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
      .catch((e) => {
        indexReady = null;
        console.error("[rate-limit] TTL index create failed:", e.message);
      });
    return indexReady;
  }
  async increment(key) {
    await this.ensureIndex();
    const now = new Date();
    const fresh = new Date(now.getTime() + this.windowMs);
    const live = { $gt: [{ $ifNull: ["$expiresAt", new Date(0)] }, now] };
    const res = await this.col.findOneAndUpdate(
      { _id: this.k(key) },
      [
        {
          $set: {
            hits: {
              $cond: [live, { $add: [{ $ifNull: ["$hits", 0] }, 1] }, 1],
            },
            expiresAt: { $cond: [live, "$expiresAt", fresh] },
          },
        },
      ],
      { upsert: true, returnDocument: "after" },
    );
    const doc = res && res.value !== undefined ? res.value : res;
    return { totalHits: doc.hits, resetTime: doc.expiresAt };
  }
  async decrement(key) {
    await this.col.updateOne(
      { _id: this.k(key), hits: { $gt: 0 } },
      { $inc: { hits: -1 } },
    );
  }
  async resetKey(key) {
    await this.col.deleteOne({ _id: this.k(key) });
  }
}

export const makeRateLimitStore = (prefix) =>
  process.env.RATE_LIMIT_STORE === "mongo"
    ? new MongoRateLimitStore({ prefix })
    : undefined;
