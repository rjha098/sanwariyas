// FILE: server/routes/instagramRoutes.js

import express from "express";
import { getReels } from "../controllers/instagramController.js";

const router = express.Router();

router.get("/reels", getReels);

export default router;