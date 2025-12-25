import Item from "../models/Item.model.js";
import cloudinary from "../config/cloudinary.js";

//*****
// user side
//***** 

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

// GET /api/items/:id
export const getItemById = async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (req.user?.role !== "admin") {
    item.costPrice = undefined;
    item.internalNotes = undefined;
  }

  res.json(item);
};


//*******
//    admin side api
//*******

//helper to parse array query parameters
const parseArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

//helper to parse nullable number fields
const parseNullableNumber = (value) => {
  if (value === undefined) return null;
  if (value === null) return null;
  if (value === "null") return null;
  return Number(value);
};

// POST /api/admin/items
export const addItem = async (req, res) => {
  try {
    const isSoldOut = req.body.isSoldOut === "true";

    const itemData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,

      category: req.body.category,
      type: req.body.type,
      roastType: req.body.roastType || null,

      showIn: parseArray(req.body.showIn),
      flavorNotes: parseArray(req.body.flavorNotes),
      bestForMood: parseArray(req.body.bestForMood),
      bestTime: parseArray(req.body.bestTime),
      tags: parseArray(req.body.tags),

      strengthLevel: parseNullableNumber(req.body.strengthLevel),
      bitterness: parseNullableNumber(req.body.bitterness),
      caffeineLevel: parseNullableNumber(req.body.caffeineLevel),

      milkBased: req.body.milkBased === "true",

      availability: {
        isSoldOut,
        isAvailable: !isSoldOut, 
      },
    };

    if (req.file) {
      itemData.image = {
        url: req.file.path,
        publicId: req.file.filename,
        alt: req.body.name,
      };
    }

    const savedItem = await new Item(itemData).save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add item" });
  }
};


// GET /api/admin/items
export const getAdminItems = async (req, res) => {
  try {
    const {
      search,
      category,
      type,
      roastType,
      strengthLevel,
      bitterness,
      caffeineLevel,
      milkBased,
      showIn,
      isAvailable,
      tags,
      sort = "latest",
      cursor,
      limit = 12,
    } = req.query;

    const filter = {};

    /* SEARCH */
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    /*  FILTERS */
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (roastType) filter.roastType = roastType;

    if (strengthLevel) filter.strengthLevel = Number(strengthLevel);
    if (bitterness) filter.bitterness = Number(bitterness);
    if (caffeineLevel) filter.caffeineLevel = Number(caffeineLevel);

    if (milkBased !== undefined)
      filter.milkBased = milkBased === "true";

    if (showIn) filter.showIn = showIn;

    if (isAvailable !== undefined)
      filter["availability.isAvailable"] = isAvailable === "true";

    if (tags)
      filter.tags = { $in: tags.split(",") };

    /* CURSOR LOGIC */
    if (cursor) {
      filter._id = { $lt: cursor }; 
    }

    /*  SORTING */
    let sortQuery = { _id: -1 }; 
    if (sort === "price_low") sortQuery = { price: 1, _id: -1 };
    if (sort === "price_high") sortQuery = { price: -1, _id: -1 };
    if (sort === "rating") sortQuery = { rating: -1, _id: -1 };

    /* FETCH (limit + 1 trick) */
    const items = await Item.find(filter)
      .sort(sortQuery)
      .limit(Number(limit) + 1);

    let hasMore = false;
   
    if (items.length > limit) {
      hasMore = true;
      items.pop(); 
    }
    const nextCursor = items.length > 0 ? items[items.length - 1]._id : null;
    res.status(200).json({
      items,
      hasMore,
      nextCursor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch admin items" });
  }
};

// GET /api/admin/items/:id
export const getAdminItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch {
    res.status(500).json({ message: "Failed to fetch item" });
  }
};

// PUT /api/admin/items/:id
export const updateAdminItem = async (req, res) => {
  try {
    const existingItem = await Item.findById(req.params.id);

    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      price:
        req.body.price !== undefined
          ? Number(req.body.price)
          : existingItem.price,

      category: req.body.category,
      type: req.body.type,
      roastType: req.body.roastType || null,

      showIn: parseArray(req.body.showIn),
      flavorNotes: parseArray(req.body.flavorNotes),
      bestForMood: parseArray(req.body.bestForMood),
      bestTime: parseArray(req.body.bestTime),
      tags: parseArray(req.body.tags),

      strengthLevel: parseNullableNumber(req.body.strengthLevel),
      bitterness: parseNullableNumber(req.body.bitterness),
      caffeineLevel: parseNullableNumber(req.body.caffeineLevel),
      milkBased: req.body.milkBased === "true",
    };

    if (req.body.isSoldOut !== undefined) {
      const isSoldOut = req.body.isSoldOut === "true";
      updateData.availability = {
        isSoldOut,
        isAvailable: !isSoldOut,
      };
    }

    if (req.file) {
      if (existingItem.image?.publicId) {
        await cloudinary.uploader.destroy(existingItem.image.publicId);
      }

      // attach new image
      updateData.image = {
        url: req.file.path,
        publicId: req.file.filename,
        alt: req.body.name,
      };
    }

    // Update DB
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json(updatedItem);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(400).json({ message: "Failed to update item" });
  }
};

// DELETE /api/admin/items/:id
export const deleteAdminItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Delete image from Cloudinary (if exists)
    if (item.image?.publicId) {
      await cloudinary.uploader.destroy(item.image.publicId);
    }

    // Delete item from DB
    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete item" });
  }
};

//metadata endpoints
// Categories
export const getAdminCategories = async (req, res) => {
  const categories = await Item.distinct("category");
  res.json(categories);
};

// Types
export const getAdminTypes = async (req, res) => {
  const types = await Item.distinct("type");
  res.json(types);
};

// Roast Types
export const getAdminRoastTypes = async (req, res) => {
  const roastTypes = await Item.distinct("roastType", { roastType: { $ne: null } });
  res.json(roastTypes);
};




