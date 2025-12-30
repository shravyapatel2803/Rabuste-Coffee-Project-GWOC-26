import express from "express";
import upload from "../middlewares/upload.js";
import {
  addArt,
  getAdminArts,
  updateAdminArt,
  deleteAdminArt,
  getArtOptions,
  getPublicArts,
  getPublicArtBySlug,
  incrementArtView
} from "../controllers/art.controller.js";

import { getArtMoods } from "../controllers/item.controller.js"; 

const router = express.Router();

// User Side
router.get("/arts", getPublicArts);         
router.get("/arts/:slug", getPublicArtBySlug);  

router.patch("/arts/:slug/view", incrementArtView);

// admin side
// Metadata 
router.get("/admin/arts/moods", getArtMoods);
router.get("/admin/arts/options", getArtOptions);

// CRUD
router.get("/admin/arts", getAdminArts);
router.post("/admin/arts", upload.single("image"), addArt);
router.put("/admin/arts/:id", upload.single("image"), updateAdminArt);
router.delete("/admin/arts/:id", deleteAdminArt);

export default router;