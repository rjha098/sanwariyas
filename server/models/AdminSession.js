import mongoose from "mongoose";

const adminSessionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    sessionId: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("AdminSession", adminSessionSchema);