import express from "express";
import Franchise from "../models/Franchise.js";

const router = express.Router();

// 1. SUBMIT ENQUIRY (For Public User)
router.post("/", async (req, res) => {
  const enquiry = new Franchise(req.body);
  await enquiry.save();
  res.status(201).json({ message: "Enquiry submitted" });
});

// 2. GET ALL ENQUIRIES (For Admin)
router.get("/", async (req, res) => {
  try {
    // Sort by newest first
    const enquiries = await Franchise.find().sort({ date: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. UPDATE STATUS (Mark as Contacted)
router.put("/:id", async (req, res) => {
  try {
    const enquiry = await Franchise.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;