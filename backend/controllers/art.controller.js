import mongoose from "mongoose";
import {
  createArt,
  listArts,
  updateArt,
  deleteArt,
  getArtById,
  getArtBySlug,
  fetchArtOptionsService,
  incrementArtViewService
} from "../services/art.service.js";
import cloudinary from "../config/cloudinary.js";

/* 
   ADMIN CONTROLLERS
 */

export const addArt = async (req, res) => {
  try {
    if (!req.file) {
      console.error("ADD ART ERROR: No file received from Multer");
      return res.status(400).json({ message: "Image file is required" });
    }

    const art = await createArt({
      body: req.body,
      file: req.file,
      cloudinary: cloudinary
    });
    res.status(201).json(art);
  } catch (err) {
    console.error("ADD ART ERROR:", err);
    res.status(500).json({ message: err.message || "Failed to add artwork" });
  }
};

export const getAdminArts = async (req, res) => {
  try {
    const data = await listArts({ query: req.query });
    res.json(data);
  } catch (err) {
    console.error("GET ADMIN ARTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch artworks" });
  }
};

export const getAdminArtById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid art id" });
  }

  try {
    const art = await getArtById(req.params.id);
    res.json(art);
  } catch (err) {
    if (err.message === "ART_NOT_FOUND") return res.status(404).json({ message: "Artwork not found" });
    res.status(500).json({ message: "Failed to fetch artwork" });
  }
};

export const updateAdminArt = async (req, res) => {
  try {
    const art = await updateArt({
      id: req.params.id,
      body: req.body,
      file: req.file,
      cloudinary: cloudinary 
    });
    res.json(art);
  } catch (err) {
    if (err.message === "ART_NOT_FOUND") return res.status(404).json({ message: "Artwork not found" });
    console.error("UPDATE ART ERROR:", err);
    res.status(500).json({ message: "Failed to update artwork" });
  }
};

export const deleteAdminArt = async (req, res) => {
  try {
    await deleteArt({ 
      id: req.params.id, 
      cloudinary: cloudinary 
    });
    res.json({ message: "Artwork deleted successfully" });
  } catch (err) {
    if (err.message === "ART_NOT_FOUND") return res.status(404).json({ message: "Artwork not found" });
    res.status(500).json({ message: "Failed to delete artwork" });
  }
};

/* 
   PUBLIC CONTROLLERS
*/

// GET /api/art
export const getPublicArts = async (req, res) => {
  try {
    const data = await listArts({ 
      query: req.query,
      context: "user" 
    });
    res.json(data);
  } catch (err) {
    console.error("PUBLIC ART LIST ERROR:", err);
    res.status(500).json({ message: "Failed to fetch artworks" });
  }
};

// GET /api/art/:slug
export const getPublicArtBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ message: "Slug is required" });

    const art = await getArtBySlug(slug);
    res.json(art); 
  } catch (err) {
    if (err.message === "ART_NOT_FOUND") return res.status(404).json({ message: "Artwork not found" });
    console.error("PUBLIC ART DETAIL ERROR:", err);
    res.status(500).json({ message: "Failed to fetch artwork" });
  }
};

/* 
   METADATA CONTROLLERS 
 */

// GET /api/admin/art/locations
export const getArtOptions = async (req, res) => {
  try {
    const options = await fetchArtOptionsService();
    res.json(options);
  } catch (err) {
    console.error("GET ART OPTIONS ERROR:", err);
    res.status(500).json({ mediums: [], styles: [], locations: [], moods: [] });
  }
};

// view count increament
export const incrementArtView = async (req, res) => {
  try {
    const { slug } = req.params; 
    
    if (!slug) return res.status(400).json({ message: "Identifier is required" });

    const newViewCount = await incrementArtViewService(slug);

    res.json({ success: true, views: newViewCount });
  } catch (err) {
    if (err.message === "ART_NOT_FOUND") {
      return res.status(404).json({ message: "Artwork not found" });
    }
    console.error("VIEW INCREMENT ERROR:", err);
    res.status(500).json({ message: "Failed to increment view count" });
  }
};