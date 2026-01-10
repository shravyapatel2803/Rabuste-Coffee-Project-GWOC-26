import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logNotification } from "../services/notification.service.js";

//  LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Check Email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found with this email" });
    }

    //  Check Password
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // Check Active Status
    if (!admin.isActive) {
      return res.status(403).json({ message: "Account is disabled. Contact support." });
    }

    //  Generate Token 
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } 
    );

    //  Update Last Login Time
    admin.lastLoginAt = new Date();
    await admin.save();

    // FResponse
    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        lastLoginAt: admin.lastLoginAt
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//  GET CURRENT ADMIN 
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-passwordHash"); 

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      data: admin 
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//  CREATE NEW ADMIN (From Dashboard)
export const createNewAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check Duplicate
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create New Admin
    const newAdmin = new Admin({
      name,
      email,
      passwordHash,
      isActive: true
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: `New Admin '${name}' created successfully!`
    });

  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//  FORGOT PASSWORD (Resets to temporary password & emails it)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    //  Check Admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found with this email" });
    }

    //  Generate Temporary Password (Random 8 chars)
    const tempPassword = Math.random().toString(36).slice(-8); 

    // Hash New Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempPassword, salt);

    // Update Database
    admin.passwordHash = passwordHash;
    await admin.save();

    logNotification({
      type: "admin_password_reset",
      referenceId: admin._id,
      recipient: { name: admin.name, email: admin.email },
      data: { tempPassword: tempPassword } 
    });

    res.status(200).json({ success: true, message: "New password sent to your email!" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user.id; 

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    admin.passwordHash = passwordHash;
    await admin.save();

    res.status(200).json({ success: true, message: "Password changed successfully!" });

  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};