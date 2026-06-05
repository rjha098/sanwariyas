import mongoose from 'mongoose';

const lookbookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },  
}, { timestamps: true });

export default mongoose.model('Lookbook', lookbookSchema);