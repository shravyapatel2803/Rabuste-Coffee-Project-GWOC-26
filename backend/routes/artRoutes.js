import express from "express";
import Art from "../models/Art.js";

const router = express.Router();

// 1. GET ALL ART (For Gallery & Admin List)
router.get("/", async (req, res) => {
  try {
    const art = await Art.find();
    res.json(art);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET SINGLE ART (For the "Detail Page" we made earlier)
router.get("/:id", async (req, res) => {
  try {
    const art = await Art.findById(req.params.id);
    if (!art) return res.status(404).json({ message: "Art not found" });
    res.json(art);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. CREATE ART (For Admin "Add" Button)
router.post("/", async (req, res) => {
  const art = new Art({
    title: req.body.title,
    artist: req.body.artist,
    description: req.body.description,
    image: req.body.image,
    available: req.body.available,
  });

  try {
    const newArt = await art.save();
    res.status(201).json(newArt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. UPDATE ART (For Admin "Edit" Button)
router.put("/:id", async (req, res) => {
  try {
    const art = await Art.findById(req.params.id);
    if (!art) return res.status(404).json({ message: "Art not found" });

    // Update only the fields that are sent
    if (req.body.title != null) art.title = req.body.title;
    if (req.body.artist != null) art.artist = req.body.artist;
    if (req.body.description != null) art.description = req.body.description;
    if (req.body.image != null) art.image = req.body.image;
    if (req.body.available != null) art.available = req.body.available;

    const updatedArt = await art.save();
    res.json(updatedArt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. DELETE ART (For Admin "Trash" Button)
router.delete("/:id", async (req, res) => {
  try {
    const art = await Art.findById(req.params.id);
    if (!art) return res.status(404).json({ message: "Art not found" });

    await art.deleteOne(); 
    res.json({ message: "Artwork deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;