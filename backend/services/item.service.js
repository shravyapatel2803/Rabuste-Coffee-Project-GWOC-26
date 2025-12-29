import mongoose from "mongoose";
import Item from "../models/Item.model.js";
import {
  normalizeIdentifier,
  normalizeIdentifierArray,
  normalizeFreeText,
  normalizeOptionalString,
} from "../utils/normalize.js";

// Helper to remove undefined keys (BUT KEEP null)
const removeUndefined = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) delete obj[key];
  });
  return obj;
};

const normalizeBoolean = (v) => v === true || v === "true";

const ensureArray = (v) => {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
};

const parseJSON = (v) => {
  try {
    return typeof v === "string" ? JSON.parse(v) : v;
  } catch {
    return undefined;
  }
};

// ✅ HELPER: Convert empty string or 0 to null for min:1 fields
const sanitizeMinOne = (val) => {
  if (val === "" || val === null || val === undefined) return null; // Send null to DB
  const num = Number(val);
  return num >= 1 ? num : null; // If 0, treat as null
};

// ✅ HELPER: Allow 0 for min:0 fields
const sanitizeMinZero = (val) => {
  if (val === "" || val === null || val === undefined) return null;
  const num = Number(val);
  return !isNaN(num) ? num : null;
};

const buildItemPayload = ({ body }) => {
  const isSoldOut = normalizeBoolean(body.isSoldOut);

  const artMoodsRaw = body.bestPairedArtMood || body.artPairedMood;
  const explanationRaw = body.pairingExplanation || body.artPairingExplanation;

  const parsedArtMoods = parseJSON(artMoodsRaw);
  const parsedExplanations = parseJSON(explanationRaw);

  return removeUndefined({
    name: body.name !== undefined ? normalizeFreeText(body.name) : undefined,

    shortDescription:
      body.shortDescription !== undefined
        ? normalizeOptionalString(body.shortDescription)
        : undefined,

    description:
      body.description !== undefined
        ? normalizeFreeText(body.description)
        : undefined,

    price:
      body.price !== undefined && body.price !== ""
        ? Number(body.price)
        : undefined,

    category: body.category ? normalizeIdentifier(body.category) : undefined,
    type: body.type ? normalizeIdentifier(body.type) : undefined,

    roastType:
      body.roastType && body.roastType !== ""
        ? normalizeIdentifier(body.roastType)
        : null,

    showIn:
      body.showIn !== undefined
        ? normalizeIdentifierArray(ensureArray(body.showIn))
        : undefined,

    tags: body.tags ? normalizeIdentifierArray(ensureArray(body.tags)) : undefined,
    flavorNotes: body.flavorNotes
      ? normalizeIdentifierArray(ensureArray(body.flavorNotes))
      : undefined,

    bestForMood: body.bestForMood
      ? normalizeIdentifierArray(ensureArray(body.bestForMood))
      : undefined,

    bestTime: body.bestTime
      ? normalizeIdentifierArray(ensureArray(body.bestTime))
      : undefined,

    strengthLevel:
  body.strengthLevel !== undefined
    ? sanitizeMinOne(body.strengthLevel)
    : undefined,

bitterness:
  body.bitterness !== undefined
    ? sanitizeMinOne(body.bitterness)
    : undefined,

caffeineLevel:
  body.caffeineLevel !== undefined
    ? sanitizeMinZero(body.caffeineLevel)
    : undefined,

    milkBased:
      body.milkBased !== undefined
        ? normalizeBoolean(body.milkBased)
        : undefined,

    bestPairedArtMood: Array.isArray(parsedArtMoods)
      ? parsedArtMoods.filter(Boolean)
      : undefined,

    pairingExplanation:
      parsedExplanations && typeof parsedExplanations === "object"
        ? new Map(Object.entries(parsedExplanations))
        : undefined,

    isFeatured:
      body.isFeatured !== undefined
        ? normalizeBoolean(body.isFeatured)
        : undefined,

    availability:
      body.isSoldOut !== undefined
        ? {
            isSoldOut,
            isAvailable: !isSoldOut,
          }
        : undefined,
  });
};


// add new item
export const createItem = async ({ body, file }) => {
  const payload = buildItemPayload({ body, file });
  return await Item.create(payload);
};

// update existing item
export const updateItem = async ({ id, body, file, cloudinary }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("INVALID_ID");
  }

  const item = await Item.findById(id);
  if (!item) throw new Error("NOT_FOUND");

  const payload = buildItemPayload({ body });
  Object.assign(item, payload);

  // ✅ upload new image FIRST
  if (file && cloudinary?.uploader) {
    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder: "items",
      overwrite: true,
    });

    // delete old image AFTER successful upload
    if (item.image?.publicId) {
      await cloudinary.uploader.destroy(item.image.publicId);
    }

    item.image = {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      alt: item.name,
    };
  }

  return await item.save();
};


// delete item
export const deleteItem = async ({ id, cloudinary }) => {
  if (!id) throw new Error("INVALID_ID");

  const item = await Item.findById(id);
  if (!item) throw new Error("ITEM_NOT_FOUND");

  // 🔒 SAFETY CHECK
  if (item.image?.publicId && cloudinary?.uploader) {
    await cloudinary.uploader.destroy(item.image.publicId);
  }

  await item.deleteOne();
};



// build filter for listing
const buildFilter = ({ query, context }) => {
  const filter = {};

  // USER ONLY
  if (context === "user") {
    filter.visibility = "public";
    filter["availability.isAvailable"] = true;
  }

  // common filters
  if (query.category)
    filter.category = normalizeIdentifier(query.category);

  if (query.type)
    filter.type = normalizeIdentifier(query.type);

  if (query.roastType)
    filter.roastType = normalizeIdentifier(query.roastType);

  if (query.showIn)
    filter.showIn = normalizeIdentifier(query.showIn);

  if (query.isFeatured !== undefined)
    filter.isFeatured = query.isFeatured === "true";

  if (query.milkBased !== undefined)
    filter.milkBased = query.milkBased === "true";

  if (query.bestForMood)
    filter.bestForMood = {
      $in: normalizeIdentifierArray(query.bestForMood),
    };

  if (query.bestTime)
    filter.bestTime = {
      $in: normalizeIdentifierArray(query.bestTime),
    };

  if (query.tags)
    filter.tags = {
      $in: normalizeIdentifierArray(query.tags),
    };

  if (query.search) {
    const search = normalizeFreeText(query.search);
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }
  }

  // ADMIN ONLY
  if (context === "admin") {
    if (query.status === "soldout")
      filter["availability.isSoldOut"] = true;

    if (query.status === "available")
      filter["availability.isAvailable"] = true;

    if (query.status === "draft")
      filter.visibility = "hidden";
  }

  return filter;
};

// list items with pagination
export const listItems = async ({ query = {}, context, mode }) => {
  const filter = buildFilter({ query, context });

  // user side menu page without pagenation
  if (context === "user" && mode === "menu") {
    const items = await Item.find(filter)
      .sort({ category: 1, price: 1 }) 
      .lean();

    return { items };
  }

  // userside shop page with pagenation
  if (context === "user" && mode === "shop") {
    const limit = Number(query.limit || 12);

    if (query.cursor) {
      filter._id = { $lt: query.cursor }; 
    }

    const items = await Item.find(filter)
      .sort({ _id: -1 }) 
      .limit(limit + 1)
      .lean();

    const hasMore = items.length > limit;
    if (hasMore) items.pop();

    return {
      items,
      hasMore,
      nextCursor: items.length ? items[items.length - 1]._id : null,
    };
  }

  // admin side no pagenation
  if (context === "admin") {
    const items = await Item.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return {
      items,
      total: items.length,
    };
  }

  return {
    items: [],
    total: 0,
  };
};

// get single item by id admin side
export const getItemById = async ({ id }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("INVALID_ID");
  }

  const item = await Item.findById(id);
  if (!item) {
    throw new Error("NOT_FOUND");
  }

  return item;
};

// get single item by slug user side
export const getItemBySlug = async ({ slug }) => {
  const item = await Item.findOne({
    slug,
    visibility: "public",
    "availability.isAvailable": true,
  });

  if (!item) {
    throw new Error("NOT_FOUND");
  }

  return item;
};


// fetch metadata (categories / types)
export const fetchItemCategoriesService = async () => {
  const categories = await Item.distinct("category");
  return categories.filter(Boolean);
};

export const fetchItemTypesService = async () => {
  const types = await Item.distinct("type");
  return types.filter(Boolean);
};