import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
});

export default mongoose.model("Menu", menuSchema);
