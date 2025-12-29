import express from "express";
import upload from "../middlewares/upload.js";

import {
  /* ============================
     ADMIN CONTROLLERS
  ============================ */
  addArt,
  getAdminArts,
  getAdminArtById,
  updateAdminArt,
  deleteAdminArt,
  getAdminArtStyles,
  getAdminArtMoods,
  getAdminDisplayLocations,

  /* ============================
     PUBLIC CONTROLLERS
  ============================ */
  getPublicArts,
  getPublicArtBySlug,
  getPublicArtStyles,
  getPublicArtMoods,
} from "../controllers/art.controller.js";

const router = express.Router();

/* =========================================================
   ADMIN SIDE ROUTES
   Base Path: /api/admin/art
========================================================= */

/* -------- Metadata (Admin only) -------- */
router.get("/admin/art/meta/styles", getAdminArtStyles);
router.get("/admin/art/meta/moods", getAdminArtMoods);
router.get(
  "/admin/art/meta/display-locations",
  getAdminDisplayLocations
);

/* -------- List & Create -------- */
router.get("/admin/art", getAdminArts);
router.post(
  "/admin/art",
  upload.single("image"),
  addArt
);

/* -------- Single Art (by ID) -------- */
router.get("/admin/art/:id", getAdminArtById);
router.put(
  "/admin/art/:id",
  upload.single("image"),
  updateAdminArt
);
router.delete("/admin/art/:id", deleteAdminArt);

/* =========================================================
   PUBLIC / USER SIDE ROUTES
   Base Path: /api/art
========================================================= */

/* -------- Public Metadata (SAFE) -------- */
router.get("/art/meta/styles", getPublicArtStyles);
router.get("/art/meta/moods", getPublicArtMoods);

/* -------- Public Gallery -------- */
router.get("/art", getPublicArts);

/* -------- Public Detail Page (slug based) -------- */
router.get("/art/:slug", getPublicArtBySlug);

export default router;
