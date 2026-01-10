import Razorpay from "razorpay";
import dotenv from "dotenv";
import PreOrder from "../models/PreOrder.model.js"; 
import Admin from "../models/admin.model.js"; 
import { logNotification } from "../services/notification.service.js"; 

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ===========================
   INIT RAZORPAY ORDER
=========================== */
export const initRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: "Amount is required" });

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Razorpay Init Error:", error);
    res.status(500).json({ message: "Payment initialization failed" });
  }
};

/* ===========================
   CREATE ORDER (USER)
=========================== */
export const createOrder = async (req, res) => {
  try {
    const { 
      name, phone, email, items, totalAmount, 
      pickupDate, pickupTime, paymentMethod, 
      paymentStatus, razorpayOrderId, specialRequest 
    } = req.body;

    const newOrder = new PreOrder({
      name,
      phone,
      email,
      items,
      totalAmount,
      pickupDate,
      pickupTime,
      paymentMethod,
      paymentStatus: paymentStatus || "pending",
      razorpayOrderId,
      specialRequest
    });

    const savedOrder = await newOrder.save();

    /* USER NOTIFICATION (NON-BLOCKING) */
    logNotification({
      type: "preorder",
      referenceId: savedOrder._id.toString(),
      recipient: { name, email, phone },
      data: { amount: totalAmount, pickupTime }
    });

    /* ADMIN NOTIFICATION (NON-BLOCKING) */
    const allAdmins = await Admin.find({ isActive: true });

    if (allAdmins.length > 0) {
      allAdmins.forEach(admin => {
        logNotification({
          type: "admin_new_order",
          referenceId: savedOrder._id.toString(),
          recipient: {
            name: admin.name,
            email: admin.email,
            phone: ""
          },
          data: {
            amount: totalAmount,
            pickupTime,
            customerName: name
          }
        });
      });
    }

    res.status(201).json(savedOrder);

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message
    });
  }
};

/* ===========================
   GET ALL ORDERS (ADMIN)
=========================== */
export const getAllOrders = async (req, res) => {
  try {
    const { timeFilter, status, paymentStatus, search, date } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { _id: { $regex: search, $options: "i" } }
      ];
    }

    if (status && status !== "All") {
      query.orderStatus = status;
    }

    if (paymentStatus && paymentStatus !== "All") {
      if (paymentStatus === "Paid") query.paymentStatus = "paid";
      if (paymentStatus === "Pending") query.paymentStatus = "pending";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);
      query.createdAt = { $gte: selectedDate, $lt: nextDay };
    } else if (timeFilter) {
      if (timeFilter === "Today") {
        query.createdAt = { $gte: today };
      } else if (timeFilter === "Yesterday") {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        query.createdAt = { $gte: yesterday, $lt: today };
      } else if (timeFilter === "Last Week") {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        query.createdAt = { $gte: lastWeek };
      } else if (timeFilter === "Last Month") {
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        query.createdAt = { $gte: lastMonth };
      }
    }

    const orders = await PreOrder.find(query).sort({ createdAt: -1 });
    res.status(200).json(orders);

  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ===========================
   GET SINGLE ORDER (ADMIN)
=========================== */
export const getOrderById = async (req, res) => {
  try {
    const order = await PreOrder.findByIdAndUpdate(
      req.params.id,
      { isViewed: true },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Get Order By ID Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ===========================
   UPDATE ORDER STATUS (ADMIN)
=========================== */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const updatedOrder = await PreOrder.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentStatus: paymentStatus
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    /* USER NOTIFICATION (NON-BLOCKING) */
    logNotification({
      type: "order_update",
      referenceId: updatedOrder._id.toString(),
      recipient: {
        name: updatedOrder.name,
        email: updatedOrder.email,
        phone: updatedOrder.phone
      },
      data: { status }
    });

    res.status(200).json(updatedOrder);

  } catch (error) {
    console.error("Update Order Error:", error);
    res.status(500).json({ message: "Update failed" });
  }
};
