import mongoose from "mongoose";

const aiResponseSchema = new mongoose.Schema(
  {
    // internal identifier
    key: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    // sample user question
    question: {
      type: String,
      required: true,
      trim: true
    },

    // actual bot reply
    answer: {
      type: String,
      required: true,
      trim: true
    },

    // classification
    category: {
      type: String,
      enum: ["general", "coffee", "art", "support"],
      default: "general"
    },

    // example: ["rabusta", "rabuste", "coffee"]
    tags: {
      type: [String],
      default: [],
    },

    // enable / disable response
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);


const AIResponse = mongoose.model("AIResponse", aiResponseSchema);

export default AIResponse;
