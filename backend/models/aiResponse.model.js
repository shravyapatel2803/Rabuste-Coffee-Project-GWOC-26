import mongoose from "mongoose";

const aiResponseSchema = new mongoose.Schema(
  {
    // unique key for each QA pair
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true
      // example: "what_is_robusta"
    },

    // user-facing question
    question: {
      type: String,
      required: true,
      trim: true
    },

    // static ai answer
    answer: {
      type: String,
      required: true,
      trim: true
    },

    // category of the response
    category: {
      type: String,
      required: true
      // coffee | art | workshop | general
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

aiResponseSchema.index({ category: 1 });
aiResponseSchema.index({ isActive: 1 });

export default mongoose.model("AIResponse", aiResponseSchema);
