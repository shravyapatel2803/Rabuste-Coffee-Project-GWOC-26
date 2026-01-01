import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  workshopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workshop",
    required: true
  },
  
  // User Details
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },

  // Booking Details
  tickets: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true
  },
  
  // Payment Info 
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "free"],
    default: "pending"
  },
  
  status: {
    type: String,
    enum: ["confirmed", "cancelled"],
    default: "confirmed"
  }
}, { timestamps: true });

const WorkshopRegistration = mongoose.model("WorkshopRegistration", registrationSchema);

export default WorkshopRegistration;