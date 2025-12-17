import express from "express";
import Art from "../models/Art.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const art = await Art.find();
    res.json(art);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
