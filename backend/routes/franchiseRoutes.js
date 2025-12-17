import express from "express";
import Franchise from "../models/Franchise.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const enquiry = new Franchise(req.body);
  await enquiry.save();
  res.status(201).json({ message: "Enquiry submitted" });
});

export default router;
