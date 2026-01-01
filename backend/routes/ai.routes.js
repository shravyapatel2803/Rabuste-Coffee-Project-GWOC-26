import express from "express";
import { 
  // User Controllers
  getAIFilters, 
  recommendCoffee, 
  pairArt, 
  chatWithAI,

  // Admin Controllers
  getAIConfig,
  updateAIConfig,
  getAllQAs,
  createQA,
  updateQA,
  deleteQA
} from "../controllers/ai.controller.js";

const router = express.Router();

// user side

router.get("/filters", getAIFilters);
router.post("/recommend", recommendCoffee);
router.get("/pair-art/:coffeeId", pairArt);
router.post("/chat", chatWithAI);


// admin side

router.get("/admin/config", getAIConfig);
router.put("/admin/config", updateAIConfig);
router.get("/admin/qa", getAllQAs);
router.post("/admin/qa", createQA);
router.put("/admin/qa/:id", updateQA);
router.delete("/admin/qa/:id", deleteQA);

export default router;