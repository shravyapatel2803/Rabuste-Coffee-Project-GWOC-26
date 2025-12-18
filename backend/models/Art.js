import mongoose from "mongoose";

const artSchema = new mongoose.Schema({
  title: String,
  artist: String,
  description: String,
  image: String,
  available: Boolean,
});

export default mongoose.model("Art", artSchema);
