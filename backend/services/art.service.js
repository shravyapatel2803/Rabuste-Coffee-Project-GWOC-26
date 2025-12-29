import mongoose from "mongoose";
import Art from "../models/Art.model.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";
import { removeUndefined } from "../utils/removeUndefined.js";
import {
  normalizeIdentifier,
  normalizeIdentifierArray,
  normalizeFreeText,
  normalizeOptionalString,
} from "../utils/normalize.js";

// helpers
const parseBoolean = (value) => {
  if (value === undefined) return undefined;
  return value === "true";
};

const parseNullableNumber = (value) => {
  if (value === undefined || value === null || value === "null") return null;
  return Number(value);
};

/* ============================
   ADMIN SERVICES
============================ */

// ADD ART
export const addArtService = async (body, file) => {
  const artData = {
    title: normalizeFreeText(body.title),
    slug: slugify(body.title || "", { lower: true, strict: true }),
    description: normalizeFreeText(body.description),
    storyBehindArt: normalizeFreeText(body.storyBehindArt),

    artistName: normalizeFreeText(body.artistName),
    artistBio: normalizeFreeText(body.artistBio),
    artistInstagram: normalizeOptionalString(body.artistInstagram),
    artistWebsite: normalizeOptionalString(body.artistWebsite),

    medium: normalizeIdentifier(body.medium),
    artStyle: normalizeIdentifier(body.artStyle),
    artMood: normalizeIdentifierArray(
      body.artMood ? body.artMood.split(",") : []
    ),

    dimensions:
      body.width !== undefined || body.height !== undefined
        ? {
            width: parseNullableNumber(body.width),
            height: parseNullableNumber(body.height),
          }
        : undefined,

    framed: body.framed === "true",
    price: parseNullableNumber(body.price),
    availabilityStatus: body.availabilityStatus || "not-for-sale",

    displayLocation: normalizeIdentifier(body.displayLocation),
    isCurrentlyDisplayed: parseBoolean(body.isCurrentlyDisplayed),
    isFeatured: parseBoolean(body.isFeatured),
    visibility:
      body.visibility === "public" || body.visibility === "hidden"
        ? body.visibility
        : undefined,
  };

  if (file) {
    artData.image = {
      url: file.path,
      publicId: file.filename,
      alt: body.title,
    };
  }

  return await new Art(artData).save();
};

// GET ADMIN ARTS
export const getAdminArtsService = async (queryParams) => {
  const {
    search,
    artStyle,
    artMood,
    availabilityStatus,
    displayLocation,
    visibility,
    isFeatured,
    sort = "latest",
    cursor,
    limit = 10,
    noLimit = "false",
  } = queryParams;

  const filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (artStyle) filter.artStyle = normalizeIdentifier(artStyle);
  if (artMood) filter.artMood = normalizeIdentifier(artMood);
  if (displayLocation)
    filter.displayLocation = normalizeIdentifier(displayLocation);
  if (visibility) filter.visibility = normalizeIdentifier(visibility);
  if (availabilityStatus)
    filter.availabilityStatus = availabilityStatus;
  if (isFeatured !== undefined)
    filter.isFeatured = parseBoolean(isFeatured);

  let sortQuery = { createdAt: -1 };
  if (sort === "oldest") sortQuery = { createdAt: 1 };

  let query = Art.find(filter).sort(sortQuery);

  if (noLimit !== "true") {
    if (cursor) query = query.where("_id").lt(cursor);
    query = query.limit(Number(limit) + 1);
  }

  const results = await query;

  if (noLimit === "true") {
    return {
      arts: results,
      total: results.length,
      hasMore: false,
      nextCursor: null,
    };
  }

  let hasMore = false;
  let nextCursor = null;

  if (results.length > limit) {
    hasMore = true;
    nextCursor = results.pop()._id;
  }

  return { arts: results, hasMore, nextCursor };
};

// UPDATE ART
export const updateAdminArtService = async (id, body, file) => {
  const art = await Art.findById(id);
  if (!art) throw new Error("NOT_FOUND");

  const updateData = removeUndefined({
    title: normalizeFreeText(body.title),
    slug: body.title
      ? slugify(body.title, { lower: true, strict: true })
      : undefined,

    description: normalizeFreeText(body.description),
    storyBehindArt: normalizeFreeText(body.storyBehindArt),

    artistName: normalizeFreeText(body.artistName),
    artistBio: normalizeFreeText(body.artistBio),
    artistInstagram: normalizeOptionalString(body.artistInstagram),
    artistWebsite: normalizeOptionalString(body.artistWebsite),

    medium: normalizeIdentifier(body.medium),
    artStyle: normalizeIdentifier(body.artStyle),
    artMood: body.artMood
      ? normalizeIdentifierArray(body.artMood.split(","))
      : undefined,

    dimensions:
      body.width !== undefined || body.height !== undefined
        ? {
            width: parseNullableNumber(body.width),
            height: parseNullableNumber(body.height),
          }
        : undefined,

    framed: body.framed === "true",
    price: parseNullableNumber(body.price),
    availabilityStatus: body.availabilityStatus,

    displayLocation: normalizeIdentifier(body.displayLocation),
    isCurrentlyDisplayed: parseBoolean(body.isCurrentlyDisplayed),
    isFeatured: parseBoolean(body.isFeatured),
    visibility:
      body.visibility === "public" || body.visibility === "hidden"
        ? body.visibility
        : undefined,
  });

  if (file) {
    if (art.image?.publicId) {
      await cloudinary.uploader.destroy(art.image.publicId);
    }

    updateData.image = {
      url: file.path,
      publicId: file.filename,
      alt: body.title,
    };
  }

  return await Art.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

// DELETE ART
export const deleteAdminArtService = async (id) => {
  const art = await Art.findById(id);
  if (!art) throw new Error("NOT_FOUND");

  if (art.image?.publicId) {
    await cloudinary.uploader.destroy(art.image.publicId);
  }

  await Art.findByIdAndDelete(id);
};

/* ============================
   METADATA SERVICES
============================ */

export const fetchMetadataService = async (field, filter = {}) => {
  const values = await Art.distinct(field, filter);

  return values
    .filter((v) => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.toLowerCase())
    .sort();
};

/* ============================
   PUBLIC SERVICES
============================ */

export const getPublicArtsService = async (query) => {
  const {
    mood,
    style,
    availabilityStatus,
    sort = "latest",
    cursor,
    limit = 9,
  } = query;

  const filter = {
    visibility: "public",
    isCurrentlyDisplayed: true,
  };

  if (style) filter.artStyle = normalizeIdentifier(style);
  if (mood) filter.artMood = normalizeIdentifier(mood);
  if (availabilityStatus)
    filter.availabilityStatus = availabilityStatus;

  let sortQuery = { createdAt: -1 };
  if (sort === "oldest") sortQuery = { createdAt: 1 };

  let queryBuilder = Art.find(filter).sort(sortQuery);

  if (cursor) queryBuilder = queryBuilder.where("_id").lt(cursor);
  queryBuilder = queryBuilder.limit(Number(limit) + 1);

  const results = await queryBuilder;

  let hasMore = false;
  let nextCursor = null;

  if (results.length > limit) {
    hasMore = true;
    nextCursor = results.pop()._id;
  }

  return { arts: results, hasMore, nextCursor };
};

export const getPublicArtBySlugService = async (slug) => {
  const art = await Art.findOne({
    slug,
    visibility: "public",
  }).populate("bestPairedCoffee");

  if (!art) throw new Error("NOT_FOUND");

  art.viewCount = (art.viewCount || 0) + 1;
  await art.save();

  return art;
};
