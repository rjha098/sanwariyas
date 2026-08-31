// FILE: server/controllers/lookbookController.js

import fs from "fs";
import path from "path";
import Lookbook from "../models/Lookbook.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getLookbook = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 24, 1), 60);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Lookbook.find()
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Lookbook.countDocuments(),
    ]);

    res.json({
      success: true,
      items,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLookbookItem = async (req, res) => {
  try {
    const { title, category, badge, isFeatured } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const imagePath = `/uploads/lookbook/${req.file.filename}`;

    const newItem = await Lookbook.create({
      title,
      category,
      image: imagePath,
      badge: badge || "None",
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    res
      .status(201)
      .json({ success: true, item: newItem, message: "Added to Lookbook" });
   } catch (error) {
    const status = error.name === "ValidationError" ? 400 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

// export const deleteLookbookItem = async (req, res) => {

//   try {
//     const item = await Lookbook.findById(req.params.id);

//     if (!item) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Lookbook item not found" });
//     }

//     const relativePath = item.image.startsWith("/")
//       ? item.image.slice(1)
//       : item.image;
//     // const absoluteFilePath = path.resolve(relativePath);

//     const absoluteFilePath = path.join(__dirname, "..", relativePath);

//     if (fs.existsSync(absoluteFilePath)) {
//       fs.unlinkSync(absoluteFilePath);
//     }

//     await Lookbook.findByIdAndDelete(req.params.id);

//     res.json({
//       success: true,
//       message: "Item successfully deleted from database and storage disk.",
//     });
//  } catch (error) {
//     const status = error.name === "CastError" ? 400 : 500;
//     res.status(status).json({ success: false, message: error.message });
//   }
// };

export const deleteLookbookItem = async (req, res) => {
  try {
    const item = await Lookbook.findById(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Lookbook item not found" });
    }

    if (item.image) {
      const relativePath = item.image.startsWith("/") ? item.image.slice(1) : item.image;
      const absoluteFilePath = path.join(__dirname, "..", relativePath);
      if (fs.existsSync(absoluteFilePath)) fs.unlinkSync(absoluteFilePath);
    }

    await Lookbook.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Item successfully deleted from database and storage disk.",
    });
 } catch (error) {
    const status = error.name === "CastError" ? 400 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};