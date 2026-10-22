// FILE: server/controllers/lookbookController.js

import fs from "fs";
import path from "path";
import Lookbook from "../models/Lookbook.js";
import Counter from "../models/Counter.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Style numbers ──────────────────────────────────────────────────────────
// Admin can type their own code (e.g. "SW-2041"); if left blank we generate
// the next free "SW-0001" style code automatically.
const normalizeStyle = (v) =>
  String(v || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "-")
    .slice(0, 40);

const nextStyleNumber = async () => {
  // loop in case an admin already typed a code that equals the next number
  for (let i = 0; i < 20; i++) {
    const counter = await Counter.findOneAndUpdate(
      { _id: "lookbookStyle" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: false },
    );
    const code = `SW-${String(counter.seq).padStart(4, "0")}`;
    if (!(await Lookbook.exists({ styleNumber: code }))) return code;
  }
  return `SW-${Date.now()}`;
};

const styleTaken = async (styleNumber, exceptId = null) => {
  if (!styleNumber) return false;
  const q = { styleNumber };
  if (exceptId) q._id = { $ne: exceptId };
  return !!(await Lookbook.exists(q));
};

// Remove an uploaded file from disk (used when the request fails AFTER multer
// has already written the image, so no orphan files pile up in /uploads/lookbook).
const removeUploadedFile = (file) => {
  try {
    if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
  } catch {
    // ignore cleanup errors
  }
};

export const getLookbook = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 24, 1), 60);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Lookbook.find()
        .sort({ isFeatured: -1, createdAt: -1, _id: -1 })
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

    let styleNumber = normalizeStyle(req.body.styleNumber);
    if (styleNumber && (await styleTaken(styleNumber))) {
      removeUploadedFile(req.file);
      return res.status(400).json({
        success: false,
        message: `Style number ${styleNumber} is already used by another photo.`,
      });
    }
    if (!styleNumber) styleNumber = await nextStyleNumber();

    const imagePath = `/uploads/lookbook/${req.file.filename}`;

    const newItem = await Lookbook.create({
      title,
      styleNumber,
      category,
      image: imagePath,
      badge: badge || "None",
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    res
      .status(201)
      .json({ success: true, item: newItem, message: "Added to Lookbook" });
  } catch (error) {
    removeUploadedFile(req.file);
    const status = error.name === "ValidationError" ? 400 : 500;
    res.status(status).json({ success: false, message: error.message });
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

    if (item.image) {
      const relativePath = item.image.startsWith("/")
        ? item.image.slice(1)
        : item.image;
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

// ═══════════════════════════════════════════════════════════════════════════
// EDIT + BULK DELETE
// ═══════════════════════════════════════════════════════════════════════════
const UPLOADS_LOOKBOOK_DIR = path.join(__dirname, "..", "uploads", "lookbook");

// Deletes a stored lookbook image by its DB path. Never touches anything
// outside uploads/lookbook, never throws.
const removeLookbookImage = (imagePath) => {
  try {
    if (!imagePath || imagePath.startsWith("http")) return;
    const relativePath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;
    const absoluteFilePath = path.join(__dirname, "..", relativePath);
    if (!absoluteFilePath.startsWith(UPLOADS_LOOKBOOK_DIR + path.sep)) return;
    if (fs.existsSync(absoluteFilePath)) fs.unlinkSync(absoluteFilePath);
  } catch {
    // ignore cleanup errors
  }
};

// PATCH /api/lookbook/:id  (multipart; image is OPTIONAL)
export const updateLookbookItem = async (req, res) => {
  try {
    const item = await Lookbook.findById(req.params.id);

    if (!item) {
      removeUploadedFile(req.file);
      return res
        .status(404)
        .json({ success: false, message: "Lookbook item not found" });
    }

    const { title, category, badge, isFeatured } = req.body;

    if (title !== undefined) item.title = title;
    if (req.body.styleNumber !== undefined) {
      const next = normalizeStyle(req.body.styleNumber) || item.styleNumber;
      if (
        next &&
        next !== item.styleNumber &&
        (await styleTaken(next, item._id))
      ) {
        removeUploadedFile(req.file);
        return res.status(400).json({
          success: false,
          message: `Style number ${next} is already used by another photo.`,
        });
      }
      item.styleNumber = next;
    }
    if (!item.styleNumber) item.styleNumber = await nextStyleNumber();
    if (category !== undefined) item.category = category;
    if (badge !== undefined) item.badge = badge || "None";
    if (isFeatured !== undefined) {
      item.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    const oldImage = item.image;
    if (req.file) item.image = `/uploads/lookbook/${req.file.filename}`;

    await item.save(); // runs schema validators

    // Only after the DB is updated successfully do we drop the replaced image.
    if (req.file && oldImage && oldImage !== item.image) {
      removeLookbookImage(oldImage);
    }

    res.json({ success: true, item, message: "Lookbook item updated" });
  } catch (error) {
    removeUploadedFile(req.file);
    const status =
      error.name === "ValidationError" || error.name === "CastError"
        ? 400
        : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

// POST /api/lookbook/bulk-delete   body: { ids: [..] }
export const bulkDeleteLookbookItems = async (req, res) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];

    if (ids.length === 0 || ids.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Provide between 1 and 100 item ids.",
      });
    }
    if (
      !ids.every((id) => typeof id === "string" && /^[a-f\d]{24}$/i.test(id))
    ) {
      return res
        .status(400)
        .json({ success: false, message: "One or more ids are invalid." });
    }

    const items = await Lookbook.find({ _id: { $in: ids } }).lean();
    await Lookbook.deleteMany({ _id: { $in: items.map((i) => i._id) } });
    items.forEach((i) => removeLookbookImage(i.image));

    res.json({
      success: true,
      deleted: items.length,
      message: `${items.length} item(s) deleted.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
