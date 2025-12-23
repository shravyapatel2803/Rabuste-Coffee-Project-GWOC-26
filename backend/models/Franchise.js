import mongoose from "mongoose";

const franchiseSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  city: String,
  message: String,
  status: { type: String, default: "Pending" }, // Added status
  date: { type: Date, default: Date.now } // Added date
});

export default mongoose.model("Franchise", franchiseSchema);