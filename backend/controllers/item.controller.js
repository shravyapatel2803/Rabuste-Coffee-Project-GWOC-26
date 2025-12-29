import mongoose from "mongoose";
import {
  createItem,
  updateItem,
  deleteItem,
  listItems,
  getItemById,
  getItemBySlug,
  fetchItemCategoriesService,
  fetchItemTypesService,
} from "../services/item.service.js";

import cloudinary from "../config/cloudinary.js";

/* 
   ADMIN CONTROLLERS
*/

// POST /api/admin/items
export const addItem = async (req, res) => {
  try {
    const item = await createItem({
      body: req.body,
      file: req.file,
      cloudinary,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("ADD ITEM ERROR:", err);
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Failed to add item" });
  }
};

// GET /api/admin/items
export const getAdminItems = async (req, res) => {
  try {
    const data = await listItems({
      query: req.query,
      context: "admin",
    });

    res.json(data);
  } catch (err) {
    console.error("GET ADMIN ITEMS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

// GET /api/admin/items/:id
export const getAdminItemById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid item id" });
  }

  try {
    const item = await getItemById({ id });

    res.json({
      ...item.toObject(),

      // frontend compatibility
      artPairedMood: item.bestPairedArtMood || [],
      artPairingExplanation: item.pairingExplanation
        ? Object.fromEntries(item.pairingExplanation)
        : {},
    });
  } catch (err) {
    console.error("GET ADMIN ITEM ERROR:", err);
    res.status(500).json({ message: "Failed to fetch item" });
  }
};

// PUT /api/admin/items/:id
export const updateAdminItem = async (req, res) => {
  try {
    const item = await updateItem({
      id: req.params.id,
      body: req.body,
      file: req.file || null, 
      cloudinary,
    });

    res.json(item);
  } catch (err) {
    console.error("UPDATE ITEM ERROR:", err);
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Failed to update item" });
  }
};

// DELETE /api/admin/items/:id
export const deleteAdminItem = async (req, res) => {
  try {
    await deleteItem({
      id: req.params.id,
      cloudinary,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ITEM ERROR:", err);
    res.status(500).json({ message: err.message || "Failed to delete item" });
  }
};

// admin side METADATA
export const getItemCategories = async (req, res) => {
  try {
    const categories = await fetchItemCategoriesService();
    res.json({ data: categories });
  } catch (err) {
    console.error("GET ITEM CATEGORIES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

export const getItemTypes = async (req, res) => {
  try {
    const types = await fetchItemTypesService();
    res.json({ data: types });
  } catch (err) {
    console.error("GET ITEM TYPES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch types" });
  }
};


/* 
   USER CONTROLLERS
*/

// GET /api/items  (USER - menu + shop both)
export const getPublicItems = async (req, res) => {
  try {
    const data = await listItems({
      query: req.query,
      context: "user",
      mode: req.query.showIn === "menu" ? "menu" : "shop",
    });

    res.json(data);
  } catch (err) {
    console.error("PUBLIC ITEM LIST ERROR:", err);
    res.status(500).json({ message: "Failed to fetch items" });
  }
};


// GET /api/items/slug/:slug
export const getPublicItemBySlug = async (req, res) => {
  try {
    const item = await getItemBySlug({
      slug: req.params.slug,
    });

    res.json(item);
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ message: "Item not found" });
    }

    console.error("GET ITEM BY SLUG ERROR:", err);
    res.status(500).json({ message: "Failed to fetch item" });
  }
};

// GET /api/items/categories
export const getUserItemCategories = async (req, res) => {
  try {
    const data = await fetchItemCategoriesService({
      visibility: "public",
      showIn: ["menu", "shop"],
    });

    res.json({ data });
  } catch (e) {
    res.status(500).json({ message: "Failed to load categories" });
  }
};

// GET /api/items/types
export const getUserItemTypes = async (req, res) => {
  try {
    const data = await fetchItemTypesService({
      visibility: "public",
      showIn: ["menu", "shop"],
    });

    res.json({ data });
  } catch (e) {
    res.status(500).json({ message: "Failed to load types" });
  }
};
