// // model/lookbook.js 
// import mongoose from 'mongoose';

// const lookbookSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   image: { type: String, required: true },  
// }, { timestamps: true });

// export default mongoose.model('Lookbook', lookbookSchema);




// FILE: server/models/Lookbook.js
import mongoose from "mongoose";

const lookbookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    image: { type: String, required: true },

    // ✅ NEW: badge system for bestseller / trending / new arrival
    badge: {
      type: String,
      enum: ["None", "Bestseller", "Trending", "New Arrival"],
      default: "None",
    },

    // ✅ NEW: pin bestsellers to top of lookbook
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Lookbook", lookbookSchema);