import mongoose from "mongoose";
import slugPlugin from "../utils/slug.plugin.js";

const artSchema = new mongoose.Schema(
  {
    // basic info
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

    storyBehindArt: {
      type: String,
      trim: true
    },

    image: {
      url: {
        type: String,
        required: true
      },
      publicId: {
        type: String,
        required: true
      },
      alt: {
        type: String,
        default: ""
      }
    },

    // artist info
    artistName: {
      type: String,
      required: true,
      trim: true
    },

    artistBio: {
      type: String,
      trim: true
    },

    // art details
    medium: {
      type: String,
      required: true,
      trim: true
    },

    artStyle: {
      type: String,
      required: true,
      trim: true
    },

    artMood: {
      type: [String],
      default: [] // bold | calm | abstract | expressive | minimal
    },

    dimensions: {
      width: Number,
      height: Number
    },

    framed: {
      type: Boolean,
      default: false
    },

    // pricing & availability
    price: {
      type: Number,
      default: null
    },

    availabilityStatus: {
      type: String,
      enum: ["available", "sold", "not-for-sale"],
      default: "not-for-sale"
    },

    displayLocation: {
      type: String,
      trim: true
    },

    isCurrentlyDisplayed: {
      type: Boolean,
      default: true
    },

    visibility: {
      type: String,
      enum: ["public", "hidden"],
      default: "public"
    },

    // item pairing
    bestPairedCoffee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      default: null
    },

    // analytics
    viewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

// indexes
artSchema.index({ artMood: 1 });
artSchema.index({ artStyle: 1 });
artSchema.index({ availabilityStatus: 1 });
artSchema.index({ visibility: 1, isCurrentlyDisplayed: 1 });
artSchema.index({ createdAt: -1 });

artSchema.plugin(slugPlugin, { source: "title" });

export default mongoose.model("Art", artSchema);
