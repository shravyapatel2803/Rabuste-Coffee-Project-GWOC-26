import express from "express";
import { 
  initRazorpayOrder, 
  createOrder, 
  getAllOrders,    
  getOrderById,  
  updateOrderStatus   
} from "../controllers/order.controller.js";

const router = express.Router();

// user side
router.post("/razorpay/init", initRazorpayOrder);  
router.post("/create", createOrder);      

// admin side
router.get("/all", getAllOrders);              
router.get("/:id", getOrderById);       
router.put("/update/:id", updateOrderStatus);  

export default router;