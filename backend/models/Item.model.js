import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  category: {
    type: String,     // coffee | special | snack | dessert | combo | seasonal | limited
    required: true
  },

  type: {
    type: String  // drink | product | food | merchandise
  },

  showIn: {
      type: [String],
      enum: ["menu", "shop"],
      required: true,
      default: ["menu"]
    },

  roastType: {
    type: String,
    default: null // light | medium | dark | extra-dark | null
  },

  strengthLevel: {
    type: Number,
    min: 1,
    max: 5
    // 1 = very mild
    // 3 = balanced
    // 5 = very strong
  },

  bitterness: {
    type: Number,
    min: 1,
    max: 5
    // 1 = smooth
    // 5 = very bitter
  },

  milkBased: {
    type: Boolean,
    default: false
  },

  caffeineLevel: {
    type: Number,
    min: 0,
    max: 5
    // 0 = low caffeine
    // 5 = high caffeine kick
  },

  flavorNotes: {
    type: [String],
    default: []
    // ["bold", "smoky", "nutty", "chocolatey", "caramel", "fruity"]
  },

  bestForMood: {
    type: [String],
    default: []
    // energetic | focused | relaxed | creative | cozy | refreshing
  },

  bestTime: {
    type: [String],
    default: []
    // morning | afternoon | evening | night | anytime
  },

  image: {
    url: String,
    publicId: String,
    alt: String
  },

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

  tags: {
    type: [String],
    default: []
    // bestseller | signature | chef-special | recommended
    // vegan | sugar-free | iced | hot | new | trending
  }

}, 
 { timestamps: true });

const Item = mongoose.model("Item", itemSchema);

export default Item;