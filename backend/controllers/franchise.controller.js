import FranchiseEnquiry from "../models/Franchise.model.js";
import { logNotification } from "../services/notification.service.js";

export const createEnquiry = async (req, res) => {
  try {
    const newEnquiry = new FranchiseEnquiry(req.body);
    await newEnquiry.save();
    
    const adminEmail = process.env.ADMIN_EMAIL; 
    
    await logNotification({
      type: "admin_franchise_enquiry",
      referenceId: newEnquiry._id,
      recipient: { name: "Admin", email: adminEmail },
      data: newEnquiry 
    });

    res.status(201).json({ 
      success: true, 
      message: "Enquiry submitted successfully!", 
      data: newEnquiry 
    });
  } catch (error) {
    console.error("Franchise Enquiry Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await FranchiseEnquiry.find().sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enquiries" });
  }
};

export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await FranchiseEnquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } 
    );

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    await logNotification({
      type: "franchise_status_update",
      referenceId: enquiry._id,
      recipient: { name: enquiry.name, email: enquiry.email },
      data: { 
          status: status, 
          city: enquiry.city 
      }
    });

    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({ message: "Error updating status" });
  }
};