import Item from "../models/Item.model.js";

//user side api
// GET /api/menu
export const getMenuItems = async (req, res) => {
  try {
    const items = await Item.find({
      showIn: "menu",
      "availability.isAvailable": true,
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
};

// GET /api/shop
export const getShopItems = async (req, res) => {
  try {
    const items = await Item.find({showIn: "shop"});
    const shuffledItems = items.sort(() => 0.5 - Math.random());
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch shop items" });
  }
};

// GET /api/items/menu/categories
export const getMenuCategories = async (req, res) => {
  try {
    const categories = await Item.distinct("category", {
      showIn: "menu",
      "availability.isAvailable": true,
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};


//admin side api
// POST /api/admin/items
export const addItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: "Failed to add item", error });
  }
};

// GET /api/admin/items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

// GET /api/admin/items/:id
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch item" });
  }
};

// PUT /api/admin/items/:id
export const updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: "Failed to update item" });
  }
};

// DELETE /api/admin/items/:id
export const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item" });
  }
};
