// // FILE: server/routes/lookbookRoutes.js
// import {
//   upload as uploadLookbook,
//   verifyUploadedImages,
// } from "../middlewares/upload.js";
// import express from "express";
// import {
//   getLookbook,
//   createLookbookItem,
//   deleteLookbookItem,
// } from "../controllers/lookbookController.js";
// import { requireAdmin } from "../utils/authUtils.js";

// const router = express.Router();

// router.get("/", getLookbook);

// // router.post('/', requireAdmin, uploadLookbook.single('image'), createLookbookItem);

// router.post(
//   "/",
//   requireAdmin,
//   uploadLookbook.single("image"),
//   verifyUploadedImages,
//   createLookbookItem,
// );

// router.delete("/:id", requireAdmin, deleteLookbookItem);

// export default router;


// FILE: server/routes/lookbookRoutes.js
import {
  upload as uploadLookbook,
  verifyUploadedImages,
} from "../middlewares/upload.js";
import express from "express";
import {
  getLookbook,
  createLookbookItem,
  updateLookbookItem,
  deleteLookbookItem,
  bulkDeleteLookbookItems,
} from "../controllers/lookbookController.js";
import { requireAdmin } from "../utils/authUtils.js";

const router = express.Router();

// Runs multer and converts its errors (wrong type / >2MB) into clean 400 JSON
// responses instead of falling through to the global handler as HTTP 500.
const handleLookbookUpload = (req, res, next) => {
  uploadLookbook.single("image")(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Photo size is too large! Maximum limit is 2MB."
        : err.message || "Image upload failed.";
    return res.status(400).json({ success: false, message });
  });
};

router.get("/", getLookbook);

// router.post('/', requireAdmin, uploadLookbook.single('image'), createLookbookItem);

router.post(
  "/",
  requireAdmin,
  handleLookbookUpload,
  verifyUploadedImages,
  createLookbookItem,
);

router.post("/bulk-delete", requireAdmin, bulkDeleteLookbookItems);

router.patch(
  "/:id",
  requireAdmin,
  handleLookbookUpload,
  verifyUploadedImages,
  updateLookbookItem,
);

router.delete("/:id", requireAdmin, deleteLookbookItem);

export default router;