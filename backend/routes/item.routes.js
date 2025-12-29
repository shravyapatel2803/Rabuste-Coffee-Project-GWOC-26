import express from "express";

import {
  // ADMIN
  addItem,
  getAdminItems,
  getAdminItemById,
  updateAdminItem,
  deleteAdminItem,

  // USER ITEMS
  getPublicItems,
  getPublicItemBySlug,

  // METADATA
  getItemCategories,
  getItemTypes,
  getUserItemCategories,
  getUserItemTypes,
} from "../controllers/item.controller.js";

import upload from "../middlewares/upload.js";

const router = express.Router();

// admin side
// LIST
router.get("/admin/items", getAdminItems);

// META
router.get("/admin/items/categories", getItemCategories);
router.get("/admin/items/types", getItemTypes);

router.get("/admin/items/:id", getAdminItemById);
router.post("/admin/items",upload.single("image"), addItem);
router.put("/admin/items/:id",upload.single("image"), updateAdminItem);
router.delete("/admin/items/:id", deleteAdminItem);

// user side

// metadata
router.get("/items/categories", getUserItemCategories);
router.get("/items/types", getUserItemTypes);

router.get("/items", getPublicItems);
router.get("/items/:slug", getPublicItemBySlug);

export default router;
