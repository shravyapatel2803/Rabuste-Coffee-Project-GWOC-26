import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  isPaid: Boolean,
});

export default mongoose.model("Workshop", workshopSchema);
