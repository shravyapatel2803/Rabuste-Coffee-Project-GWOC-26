import mongoose from "mongoose";

const franchiseSchema = new mongoose.Schema(
  {
    // basic info
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    // location info
    city: {
      type: String,
      required: true,
      trim: true
    },

    state: {
      type: String,
      trim: true
    },

    investmentRange: {
      type: String,
      trim: true
      // example: "10–15 Lakhs", "15–25 Lakhs"
    },

    experienceInBusiness: {
      type: Boolean,
      default: false
    },

    message: {
      type: String,
      trim: true
    },

    // status info
    status: {
      type: String,
      enum: ["new", "contacted", "in-discussion", "closed"],
      default: "new"
    },

    notes: {
      type: String,
      trim: true
      // internal admin notes
    }
  },
  {
    timestamps: true
  }
);

// indexes
franchiseSchema.index({ email: 1 });
franchiseSchema.index({ phone: 1 });
franchiseSchema.index({ status: 1 });
franchiseSchema.index({ createdAt: -1 });

const FranchiseEnquiry = mongoose.model(
  "FranchiseEnquiry",
  franchiseSchema
);

export default FranchiseEnquiry;
