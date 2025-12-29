import mongoose from "mongoose";
import {
  addArtService,
  getAdminArtsService,
  updateAdminArtService,
  deleteAdminArtService,
  fetchMetadataService,
  getPublicArtsService,
  getPublicArtBySlugService,
} from "../services/art.service.js";

/* ============================
   ADMIN CONTROLLERS
============================ */

export const addArt = async (req, res) => {
  try {
    const art = await addArtService(req.body, req.file);
    res.status(201).json(art);
  } catch (err) {
    res.status(500).json({ message: "Failed to add artwork" });
  }
};

export const getAdminArts = async (req, res) => {
  try {
    const data = await getAdminArtsService(req.query);
    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch artworks" });
  }
};

export const getAdminArtById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid art id" });
  }

  const art = await Art.findById(req.params.id);
  if (!art) return res.status(404).json({ message: "Artwork not found" });

  res.json(art);
};

export const updateAdminArt = async (req, res) => {
  try {
    const art = await updateAdminArtService(
      req.params.id,
      req.body,
      req.file
    );
    res.json(art);
  } catch (err) {
    if (err.message === "NOT_FOUND")
      return res.status(404).json({ message: "Artwork not found" });

    res.status(400).json({ message: "Failed to update artwork" });
  }
};

export const deleteAdminArt = async (req, res) => {
  try {
    await deleteAdminArtService(req.params.id);
    res.json({ message: "Artwork deleted successfully" });
  } catch {
    res.status(404).json({ message: "Artwork not found" });
  }
};

/* ============================
   METADATA CONTROLLERS
============================ */

export const getAdminArtStyles = async (req, res) => {
  res.json(await fetchMetadataService("artStyle"));
};

export const getAdminArtMoods = async (req, res) => {
  res.json(await fetchMetadataService("artMood"));
};

export const getAdminDisplayLocations = async (req, res) => {
  res.json(await fetchMetadataService("displayLocation"));
};

export const getPublicArtStyles = async (req, res) => {
  res.json(
    await fetchMetadataService("artStyle", {
      visibility: "public",
      isCurrentlyDisplayed: true,
    })
  );
};

export const getPublicArtMoods = async (req, res) => {
  res.json(
    await fetchMetadataService("artMood", {
      visibility: "public",
      isCurrentlyDisplayed: true,
    })
  );
};

/* ============================
   PUBLIC CONTROLLERS
============================ */

// GET /api/art
export const getPublicArts = async (req, res) => {
  try {
    const data = await getPublicArtsService(req.query);
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

    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const art = await getPublicArtBySlugService(slug);
    res.json(art); 
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ message: "Artwork not found" });
    }

    console.error("PUBLIC ART DETAIL ERROR:", err);
    res.status(500).json({ message: "Failed to fetch artwork" });
  }
};