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
    await Lookbook.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
