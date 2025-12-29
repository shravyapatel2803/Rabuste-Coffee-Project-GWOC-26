import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true // preorder | workshop | franchise
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    channel: {
      type: String,
      enum: ["email", "sms"],
      required: true
    },

    recipient: {
      type: String,
      required: true
    },

    title: {
      type: String
    },

    message: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent"
    }
  },
  { timestamps: true }
);

export default mongoose.model("NotificationLog", notificationSchema);
