import express from "express";
import upload from "../middlewares/upload.js"; 
import { 
  // User Side
  getAllWorkshops, 
  getWorkshopBySlug, 
  registerForWorkshop,

  // Admin Side 
  getAdminWorkshops,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  getWorkshopRegistrations
} from "../controllers/workshop.controller.js";

const router = express.Router();

// user side
router.get("/workshops", getAllWorkshops); 
router.get("/workshops/:slug", getWorkshopBySlug);
router.post("/workshops/register", registerForWorkshop);

// admin side
router.get("/admin/workshops", getAdminWorkshops);
router.post("/admin/workshops", upload.single("image"), createWorkshop);
router.put("/admin/workshops/:id", upload.single("image"), updateWorkshop);
router.delete("/admin/workshops/:id", deleteWorkshop);
router.get("/admin/workshops/:id/registrations", getWorkshopRegistrations);

export default router;