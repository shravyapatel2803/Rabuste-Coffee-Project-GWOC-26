import mongoose from "mongoose";
import slugPlugin from "../utils/slug.plugin.js";

const itemSchema = new mongoose.Schema(
  {
    // basic info
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true
    },

    description: {
      type: String,
      required: true
    },

    shortDescription: {
      type: String
    },

    // pricing
    price: {
      type: Number,
      required: true
    },

    // classification
    category: {
      type: String,
      required: true
    },

    type: {
      type: String,
      required: true
    },

    showIn: {
      type: [String],
      enum: ["menu", "shop"],
      default: ["menu"]
    },

    // coffee specific details
    roastType: {
      type: String,
      enum: ["light", "medium", "dark", "extra-dark", null],
      default: null
    },

    strengthLevel: {
      type: Number,
      min: 0,
      max: 5
    },

    bitterness: {
      type: Number,
      min: 0,
      max: 5
    },

    caffeineLevel: {
      type: Number,
      min: 0,
      max: 5
    },

    milkBased: {
      type: Boolean,
      default: false
    },

    flavorNotes: {
      type: [String],
      default: []   // bold, smoky, nutty, chocolatey
    },

   // for ai recommendations
    bestForMood: {
      type: [String],
      default: [] // energetic | focused | calm | cozy | creative
    },

    bestTime: {
      type: [String],
      default: [] // morning | afternoon | evening | night
    },

    // coffee-art pairing
    bestPairedArtMood: {
      type: [String],
      default: [] // bold | abstract | minimal | calm | expressive
    },

    pairingExplanation: {
      type: Map,
      of: String
    },

    // image
    image: {
      url: {
        type: String,
        required: true
      },
      publicId: String,
      alt: String
    },

    // availability
    availability: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      isSoldOut: {
        type: Boolean,
        default: false
      }
    },

    // tags & features
    tags: {
      type: [String],
      default: []
      // bestseller | signature | vegan | iced | hot | trending
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    // analytics
    viewCount: {
      type: Number,
      default: 0
    },

    orderCount: {
      type: Number,
      default: 0
    },

    // visibility
    visibility: {
      type: String,
      enum: ["public", "hidden"],
      default: "public"
    }
  },
  { timestamps: true }
);


// indexes
itemSchema.index({ category: 1 });
itemSchema.index({ tags: 1 });
itemSchema.index({ bestForMood: 1 });
itemSchema.index({ bestTime: 1 });
itemSchema.index({ bestPairedArtMood: 1 });
itemSchema.index({ visibility: 1 });

// plugins
itemSchema.plugin(slugPlugin, { source: "name" });

const Item = mongoose.model("Item", itemSchema);

export default Item;
