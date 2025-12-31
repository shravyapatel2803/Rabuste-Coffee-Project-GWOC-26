import mongoose from "mongoose";

const preOrderSchema = new mongoose.Schema(
  {
    // customer info
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    // order items
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true
        },

        nameSnapshot: {
          type: String,
          required: true
        },

        priceSnapshot: {
          type: Number,
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],

    isViewed: {
      type: Boolean,
      default: false 
    },

    // pricing
    totalAmount: {
      type: Number,
      required: true
    },

    // pickup details
    pickupDate: {
      type: Date,
      required: true
    },

    pickupTime: {
      type: String,
      required: true
    },

    // payment
    paymentMethod: {
      type: String,
      enum: ["online", "offline"],
      default: "offline"
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },

    razorpayOrderId: {
      type: String
    },

    // order status
    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "preparing", "ready", "completed", "cancelled", "no-show"],
      default: "placed"
    },

    specialRequest: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// indexes
preOrderSchema.index({ phone: 1 });
preOrderSchema.index({ pickupDate: 1 });
preOrderSchema.index({ orderStatus: 1 });
preOrderSchema.index({ createdAt: -1 });

const PreOrder = mongoose.model("PreOrder", preOrderSchema);

export default PreOrder;
