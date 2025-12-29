import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
      unique: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    // roll
    role: {
      type: String,
      enum: ["super-admin", "content-admin"],
      default: "content-admin"
    },

   // permissions
    permissions: {
      manageItems: {
        type: Boolean,
        default: false
      },
      manageArt: {
        type: Boolean,
        default: false
      },
      manageWorkshops: {
        type: Boolean,
        default: false
      },
      managePreOrders: {
        type: Boolean,
        default: false
      },
      manageFranchise: {
        type: Boolean,
        default: false
      },
      manageAI: {
        type: Boolean,
        default: false
      },
      viewAnalytics: {
        type: Boolean,
        default: false
      }
    },

    // status
    isActive: {
      type: Boolean,
      default: true
    },

    lastLoginAt: {
      type: Date
    }
  },
  { timestamps: true }
);


adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });
adminSchema.index({ isActive: 1 });

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
