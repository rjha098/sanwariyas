// FILE: server/models/Counter.js
import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 999 },
});

export default mongoose.model("Counter", counterSchema);