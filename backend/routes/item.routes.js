import express from "express";
import {getMenuItems,getShopItems,getMenuCategories,addItem,getAllItems,getItemById,updateItem,deleteItem,} from "../controllers/item.controller.js";

const router = express.Router();
//USER SIDE 
router.get("/menu", getMenuItems);
router.get("/shop", getShopItems);
router.get("/menu/categories", getMenuCategories);


//ADMIN SIDE
router.post("/admin/items", addItem);
router.get("/admin/items", getAllItems);
router.get("/admin/items/:id", getItemById);
router.put("/admin/items/:id", updateItem);
router.delete("/admin/items/:id", deleteItem);

export default router;
