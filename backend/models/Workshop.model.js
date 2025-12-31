import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    shortDescription: {
      type: String,
      trim: true
    },

    category: {
      type: String,
      required: true
      // coffee | art | community | special
    },

    date: {
      type: Date,
      required: true
    },

    startTime: {
      type: String,
      required: true
    },

    endTime: {
      type: String
      // optional
    },

    durationMinutes: {
      type: Number
    },

    capacity: {
      type: Number,
      required: true
    },

    registeredCount: {
      type: Number,
      default: 0
    },

    isFree: {
      type: Boolean,
      default: true
    },

    price: {
      type: Number,
      default: 0
    },

    currency: {
      type: String,
      default: "INR"
    },

    image: {
      url: {
        type: String,
        required: true
      },
      publicId: String,
      alt: String
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    visibility: {
      type: String,
      enum: ["public", "hidden"],
      default: "public"
    },

    viewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// indexes
workshopSchema.index({ date: 1 });
workshopSchema.index({ category: 1 });
workshopSchema.index({ visibility: 1, isActive: 1 });
workshopSchema.index({ createdAt: -1 });

const Workshop = mongoose.model("Workshop", workshopSchema);

export default Workshop;
