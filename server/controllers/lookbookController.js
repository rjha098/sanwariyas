// FILE: server/controllers/lookbookController.js
import fs from 'fs';
import path from 'path';
import Lookbook from "../models/Lookbook.js";

export const getLookbook = async (req, res) => {
  try {
    // Nayi photos pehle dikhengi
    const items = await Lookbook.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};  

export const createLookbookItem = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    // Image ka path database me save karenge
    const imagePath = `/uploads/lookbook/${req.file.filename}`;

    const newItem = await Lookbook.create({
      title,
      category,
      image: imagePath,
    });

    res
      .status(201)
      .json({ success: true, item: newItem, message: "Added to Lookbook" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLookbookItem = async (req, res) => {
  try {
    // 1. Pehle database se item nikalenge taaki uska image path check kar sakein
    const item = await Lookbook.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ success: false, message: "Lookbook item not found" });
    }

    // 2. Database path ko local file path me convert karenge
    // item.image looks like: "/uploads/lookbook/filename.jpg"
    // Hamein banna hai: "uploads/lookbook/filename.jpg" (Relative to server folder)
    const relativePath = item.image.startsWith('/') ? item.image.slice(1) : item.image;
    const absoluteFilePath = path.resolve(relativePath);

    // 3. Check karenge ki kya photo sach me server storage par majood hai
    if (fs.existsSync(absoluteFilePath)) {
      // Photo ko folder se permanently delete (erase) karenge
      fs.unlinkSync(absoluteFilePath);
      console.log(`Successfully erased lookbook image from folder storage: ${absoluteFilePath}`);
    } else {
      console.log(`Image asset not found on storage disk path: ${absoluteFilePath}. Database cleanup running anyway.`);
    }

    // 4. Folder se file hatne ke baad ab Mongoose database entry ko delete karenge
    await Lookbook.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: "Item successfully deleted from database and storage disk." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};