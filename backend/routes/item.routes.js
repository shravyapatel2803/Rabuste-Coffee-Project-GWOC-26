import express from "express";
import {
  getMenuItems,
  getShopItems,
  getMenuCategories,
  getItemById,
  addItem,
  getAdminItems,
  updateAdminItem,
  deleteAdminItem,
  getAdminCategories,
  getAdminTypes,
  getAdminRoastTypes,
} from "../controllers/item.controller.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

//user side APIs
router.get("/menu", getMenuItems);
router.get("/shop", getShopItems);
router.get("/menu/categories", getMenuCategories);
router.get("/items/:id", getItemById);

//admin side APIs
router.get("/admin/items/categories", getAdminCategories);
router.get("/admin/items/types", getAdminTypes);
router.get("/admin/items/roast-types", getAdminRoastTypes);
router.post("/admin/items",upload.single("image"),addItem);
router.get("/admin/items", getAdminItems);
router.put("/admin/items/:id",upload.single("image"),updateAdminItem);
router.delete("/admin/items/:id", deleteAdminItem);

export default router;
