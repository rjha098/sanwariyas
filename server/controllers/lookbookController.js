// // i  want  to implement   the  deep     image  review  system in this

// // FILE: server/controllers/lookbookController.js
// import fs from "fs";
// import path from "path";
// import Lookbook from "../models/Lookbook.js";

// export const getLookbook = async (req, res) => {
//   try {
//     // new  photo  showing  on the  forst 
//     const items = await Lookbook.find().sort({ createdAt: -1 }).lean();
//     res.json({ success: true, items });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const createLookbookItem = async (req, res) => {
//   try {
//     const { title, category } = req.body;

//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Image is required" });
//     }

//     // image  path  save on the  database 
//     const imagePath = `/uploads/lookbook/${req.file.filename}`;

//     const newItem = await Lookbook.create({
//       title,
//       category,
//       image: imagePath,
//     });

//     res
//       .status(201)
//       .json({ success: true, item: newItem, message: "Added to Lookbook" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // export const deleteLookbookItem = async (req, res) => {
// //   try {
    
// //     const item = await Lookbook.findById(req.params.id);

// //     if (!item) {
// //       return res
// //         .status(404)
// //         .json({ success: false, message: "Lookbook item not found" });
// //     }

// //     const relativePath = item.image.startsWith("/")
// //       ? item.image.slice(1)
// //       : item.image;
// //     const absoluteFilePath = path.resolve(relativePath);

// //     if (fs.existsSync(absoluteFilePath)) {
     
// //       fs.unlinkSync(absoluteFilePath);
// //       console.log(
// //         `Successfully erased lookbook image from folder storage: ${absoluteFilePath}`,
// //       );
// //     } else {
// //       console.log(
// //         `Image asset not found on storage disk path: ${absoluteFilePath}. Database cleanup running anyway.`,
// //       );
// //     }

// //     await Lookbook.findByIdAndDelete(req.params.id);

// //     res.json({
// //       success: true,
// //       message: "Item successfully deleted from database and storage disk.",
// //     });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };



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
//     const absoluteFilePath = path.resolve(relativePath);

//     if (fs.existsSync(absoluteFilePath)) {
//       fs.unlinkSync(absoluteFilePath);
//       // console.log(`Successfully erased lookbook image from folder storage: ${absoluteFilePath}`);
//     } else {
//       // console.log(`Image asset not found on storage disk path: ${absoluteFilePath}. Database cleanup running anyway.`);
//     }

//     await Lookbook.findByIdAndDelete(req.params.id);

//     res.json({
//       success: true,
//       message: "Item successfully deleted from database and storage disk.",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



// FILE: server/controllers/lookbookController.js
import fs from "fs";
import path from "path";
import Lookbook from "../models/Lookbook.js";

export const getLookbook = async (req, res) => {
  try {
    // ✅ Featured/Bestseller items pehle, phir newest first
    const items = await Lookbook.find()
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean();
    res.json({ success: true, items });
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
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLookbookItem = async (req, res) => {
  try {
    const item = await Lookbook.findById(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Lookbook item not found" });
    }

    const relativePath = item.image.startsWith("/")
      ? item.image.slice(1)
      : item.image;
    const absoluteFilePath = path.resolve(relativePath);

    if (fs.existsSync(absoluteFilePath)) {
      fs.unlinkSync(absoluteFilePath);
    }

    await Lookbook.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Item successfully deleted from database and storage disk.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};