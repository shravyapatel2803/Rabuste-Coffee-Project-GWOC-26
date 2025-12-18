import mongoose from "mongoose";

const franchiseSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  city: String,
  message: String,
});

export default mongoose.model("Franchise", franchiseSchema);
