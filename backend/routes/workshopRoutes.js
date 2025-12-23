import express from "express";
import Workshop from "../models/Workshop.js";

const router = express.Router();

// 1. GET ALL WORKSHOPS
router.get("/", async (req, res) => {
  try {
    const workshops = await Workshop.find();
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. CREATE WORKSHOP
router.post("/", async (req, res) => {
  const workshop = new Workshop(req.body);
  try {
    const newWorkshop = await workshop.save();
    res.status(201).json(newWorkshop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. UPDATE WORKSHOP (Edit & Toggle Status)
router.put("/:id", async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(workshop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. DELETE WORKSHOP
router.delete("/:id", async (req, res) => {
  try {
    await Workshop.findByIdAndDelete(req.params.id);
    res.json({ message: "Workshop deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;