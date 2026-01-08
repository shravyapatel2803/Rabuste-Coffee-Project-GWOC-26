import express from "express";
import { loginAdmin, getMe, createNewAdmin, forgotPassword, changePassword } from "../controllers/auth.controller.js"; 
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPassword);

// Protected Routes
router.get("/me", protect, getMe);         
router.post("/create", protect, createNewAdmin); 
router.put("/change-password", protect, changePassword); 

export default router;