import Workshop from "../models/Workshop.model.js";
import WorkshopRegistration from "../models/WorkshopRegistration.model.js";
import { logNotification } from "../services/notification.service.js"; 

// ================= USER SIDE =================

export const getAllWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find({ 
      isActive: true, 
      visibility: "public" 
    })
    .select("-__v") 
    .sort({ date: 1 }); 

    res.status(200).json(workshops);
  } catch (error) {
    console.error("Error fetching workshops:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getWorkshopBySlug = async (req, res) => {
  try {
    const workshop = await Workshop.findOne({ 
      slug: req.params.slug,
      isActive: true 
    });

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json(workshop);
  } catch (error) {
    console.error("Error fetching workshop:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const registerForWorkshop = async (req, res) => {
  try {
    const { workshopId, name, email, phone, tickets } = req.body;

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    const spotsLeft = workshop.capacity - workshop.registeredCount;
    const requestedTickets = parseInt(tickets, 10);

    if (requestedTickets > spotsLeft) {
      return res.status(400).json({ message: `Only ${spotsLeft} spots remaining.` });
    }

    const totalAmount = workshop.isFree ? 0 : workshop.price * requestedTickets;

    const newRegistration = new WorkshopRegistration({
      workshopId,
      name,
      email,
      phone,
      tickets: requestedTickets,
      totalAmount,
      paymentStatus: workshop.isFree ? "free" : "pending"
    });

    const savedRegistration = await newRegistration.save();

    workshop.registeredCount += requestedTickets;
    await workshop.save();

    /* NOTIFICATION (NON-BLOCKING) */
    logNotification({
      type: "workshop_registration",
      referenceId: savedRegistration._id.toString(),
      recipient: { name, email, phone },
      data: { 
        workshopTitle: workshop.title,
        date: workshop.date,
        time: workshop.startTime,
        tickets: requestedTickets
      }
    });

    res.status(201).json({ 
      success: true, 
      message: "Registration successful", 
      data: savedRegistration 
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// ================= ADMIN SIDE =================

export const getAdminWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find().sort({ createdAt: -1 });
    res.status(200).json(workshops);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin workshops", error: error.message });
  }
};

export const createWorkshop = async (req, res) => {
  try {
    const { 
      title, description, shortDescription, category, 
      date, startTime, endTime, price, capacity, instructor 
    } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "Workshop image is required" });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + "-" + Date.now();

    const newWorkshop = new Workshop({
      title,
      slug,
      description,
      shortDescription,
      category,
      date,
      startTime,
      endTime,
      price: price || 0,
      isFree: price > 0 ? false : true,
      capacity,
      instructor, 
      image: {
        url: req.file.path, 
        alt: title
      }
    });

    await newWorkshop.save();
    res.status(201).json(newWorkshop);

  } catch (error) {
    console.error("Create Workshop Error:", error);
    res.status(500).json({ message: "Failed to create workshop", error: error.message });
  }
};

export const updateWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = {
        url: req.file.path,
        alt: updateData.title || "Workshop Image"
      };
    }

    if (updateData.price !== undefined) {
      updateData.isFree = updateData.price == 0;
    }

    const updatedWorkshop = await Workshop.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedWorkshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json(updatedWorkshop);

  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

export const deleteWorkshop = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedWorkshop = await Workshop.findByIdAndDelete(id);
    if (!deletedWorkshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json({ 
      success: true,
      message: "Workshop deleted successfully" 
    });

  } catch (error) {
    console.error("Delete Workshop Error:", error);
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

export const getWorkshopRegistrations = async (req, res) => {
  try {
    const { id } = req.params;

    const registrations = await WorkshopRegistration.find({ workshopId: id })
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);

  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Failed to fetch registrations", error: error.message });
  }
};
