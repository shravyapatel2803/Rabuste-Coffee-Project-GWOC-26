import express from "express";
import Workshop from "../models/Workshop.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const workshops = await Workshop.find();
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
