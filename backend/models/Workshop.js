import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  price: { type: Number, default: 0 }, // Added price
  active: { type: Boolean, default: true }, // Added active status
});

export default mongoose.model("Workshop", workshopSchema);