import mongoose from "mongoose";
import Art from "../models/Art.model.js";
import {
  normalizeFreeText,
  normalizeIdentifierArray,
} from "../utils/normalize.js";

// Helper: Parse JSON fields safely
const parseJSON = (v) => {
    try {
      return typeof v === "string" ? JSON.parse(v) : v;
    } catch {
      return [];
    }
  };
  
  // Helper: Build Payload
  const buildArtPayload = ({ body }) => {
    const payload = {};
  
    if (body.title) payload.title = normalizeFreeText(body.title);
    if (body.description) payload.description = normalizeFreeText(body.description);
    if (body.story) payload.storyBehindArt = normalizeFreeText(body.story);
  
    if (body.artistName) payload.artistName = normalizeFreeText(body.artistName);
    if (body.artistBio) payload.artistBio = normalizeFreeText(body.artistBio);
  
    if (body.medium) payload.medium = body.medium;
    if (body.style) payload.artStyle = body.style;
    
    if (body.moods) {
      payload.artMood = normalizeIdentifierArray(parseJSON(body.moods));
    }
  
    if (body.isFramed !== undefined) payload.framed = body.isFramed === "true" || body.isFramed === true;
    if (body.width) payload.dimensions = { ...payload.dimensions, width: Number(body.width) };
    if (body.height) payload.dimensions = { ...payload.dimensions, height: Number(body.height) };
  
    if (body.status) payload.availabilityStatus = body.status;
    
    if (body.price) {
      payload.price = body.status === "not-for-sale" ? null : Number(body.price);
    }
  
    if (body.location) payload.displayLocation = normalizeFreeText(body.location);
    if (body.isDisplayed !== undefined) payload.isCurrentlyDisplayed = body.isDisplayed === "true" || body.isDisplayed === true;
    if (body.visibility) payload.visibility = body.visibility;
  
    if (body.pairedCoffeeId) {
      payload.bestPairedCoffee = body.pairedCoffeeId === "" ? null : body.pairedCoffeeId;
    }
  
    return payload;
  };
  
  
  export const createArt = async ({ body, file, cloudinary }) => {
    const payload = buildArtPayload({ body });
  
    if (file) {
      payload.image = {
        url: file.path,       
        publicId: file.filename, 
        alt: body.imageAlt || payload.title,
      };
    } else {
      throw new Error("IMAGE_REQUIRED"); 
    }
  
    return await Art.create(payload);
  };
  
  export const updateArt = async ({ id, body, file, cloudinary }) => {
    const art = await Art.findById(id);
    if (!art) throw new Error("ART_NOT_FOUND");
  
    const payload = buildArtPayload({ body });
  
    if (file) {
      if (art.image?.publicId && cloudinary) {
        await cloudinary.uploader.destroy(art.image.publicId);
      }
      payload.image = {
        url: file.path,
        publicId: file.filename,
        alt: body.imageAlt || art.title,
      };
    }
  
    Object.assign(art, payload);
    return await art.save();
  };
  
  export const deleteArt = async ({ id, cloudinary }) => {
    const art = await Art.findById(id);
    if (!art) throw new Error("ART_NOT_FOUND");
  
    if (art.image?.publicId && cloudinary) {
      await cloudinary.uploader.destroy(art.image.publicId);
    }
  
    await art.deleteOne();
  };

export const listArts = async ({ query = {}, context }) => {
  const filter = {};

  if (query.search) {
    const regex = new RegExp(query.search, "i");
    filter.$or = [{ title: regex }, { artistName: regex }];
  }
  
  if (query.medium) filter.medium = query.medium;
  if (query.style) filter.artStyle = query.style;
  if (query.mood) filter.artMood = query.mood; 
  
  // Admin vs User Filters
  if (context === "user") {
    filter.visibility = "public";
    if (query.status === "available") {
      filter.availabilityStatus = "available";
    }
  } else {
    // Admin filters
    if (query.location) filter.displayLocation = new RegExp(query.location, "i");
    if (query.status) filter.availabilityStatus = query.status;
    if (query.isDisplayed) filter.isCurrentlyDisplayed = query.isDisplayed === "true";
  }

  if (context === "user") {
    const limit = Number(query.limit || 12);
    const cursor = query.cursor || null;

    if (!cursor) {
      const arts = await Art.aggregate([
        { $match: filter },
        { $sample: { size: limit } } // Randomize
      ]);

      // Populate manually since aggregate returns plain objects
      await Art.populate(arts, { path: "bestPairedCoffee", select: "name slug image" });

      return {
        data: arts,
        hasMore: true,
        nextCursor: arts.at(-1)?._id || null, 
      };
    }

    const arts = await Art.find({
      ...filter,
      _id: { $lt: cursor }, 
    })
      .sort({ _id: -1 }) 
      .limit(limit + 1)
      .populate("bestPairedCoffee", "name slug image")
      .lean();

    const hasMore = arts.length > limit;
    if (hasMore) arts.pop(); 

    return {
      data: arts,
      hasMore,
      nextCursor: arts.at(-1)?._id || null,
    };
  }

  const arts = await Art.find(filter)
    .sort({ createdAt: -1 })
    .populate("bestPairedCoffee", "name")
    .lean();
    
  return { data: arts };
};

export const getArtById = async (id) => {
    const art = await Art.findById(id);
    if (!art) throw new Error("ART_NOT_FOUND");
    return art;
  };
  
export const getArtBySlug = async (identifier) => {
  let query = { visibility: "public" };

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    query._id = identifier;
  } else {
    query.slug = identifier;
  }

  const art = await Art.findOne(query).populate("bestPairedCoffee");

  if (!art) throw new Error("ART_NOT_FOUND");
  return art;
};
  
  // Metadata Service
export const fetchArtOptionsService = async () => {
    try {
      const [mediums, styles, locations, moods] = await Promise.all([
        Art.distinct("medium"),
        Art.distinct("artStyle"),
        Art.distinct("displayLocation"),
        Art.distinct("artMood")
      ]);
  
      const cleanAndSort = (arr) => 
        arr.filter((item) => item && typeof item === 'string' && item.trim() !== "").sort();
  
      return {
        mediums: cleanAndSort(mediums),
        styles: cleanAndSort(styles),
        locations: cleanAndSort(locations),
        moods: cleanAndSort(moods)
      };
    } catch (error) {
      console.error("Service Error fetching options:", error);
      throw error;
    }
};


// view count increament
export const incrementArtViewService = async (identifier) => {
  let query = { visibility: "public" };

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    query._id = identifier;
  } else {
    query.slug = identifier;
  }

  const art = await Art.findOneAndUpdate(
    query,
    { $inc: { viewCount: 1 } }, 
    { new: true } 
  );

  if (!art) throw new Error("ART_NOT_FOUND");
  
  return art.viewCount; 
};