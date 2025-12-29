import mongoose from "mongoose";

const aiConfigSchema = new mongoose.Schema(
  {
    feature: {
      type: String,
      required: true,
      unique: true
      // coffee-discovery | art-pairing
    },

    config: {
      type: Object,
      default: {}
      /*
        example:
        {
          moodWeight: 0.5,
          timeWeight: 0.3,
          strengthWeight: 0.2
        }
      */
    },

    isEnabled: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("AIConfig", aiConfigSchema);
