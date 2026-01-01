import NotificationLog from "../models/notification.model.js"; 
import { sendRealEmail } from "../utils/email.js"; 

export const logNotification = async ({ type, referenceId, recipient, data }) => {
  try {
    const { name, email } = recipient;
    const notifications = [];

    let emailMessage = "";
    let title = "";

    switch (type) {
      
      // order status
      case "order_update":
        const status = data.status;
        title = `Order Update: ${status} - Rabuste Coffee`;
        
        if (status === "Confirmed") {
          emailMessage = `Hi ${name},\n\nGood news! Your order #${referenceId.slice(-6).toUpperCase()} has been CONFIRMED. We are getting things ready.`;
        } else if (status === "Preparing") {
          emailMessage = `Hi ${name},\n\nYour order is now being PREPARED by our chefs. 👨‍🍳`;
        } else if (status === "Ready") {
          emailMessage = `Hi ${name},\n\nYour order is READY for pickup! ☕\nPlease collect it from the counter.\n\nOrder ID: ${referenceId}`;
        } else if (status === "Completed") {
          emailMessage = `Hi ${name},\n\nThank you for visiting Rabuste Coffee! Your order has been marked as COMPLETED. Hope you enjoyed it!`;
        } else if (status === "Cancelled") {
          emailMessage = `Hi ${name},\n\nYour order #${referenceId.slice(-6).toUpperCase()} has been CANCELLED.\nIf you paid online, the refund process will be initiated manually within 24-48 hours.`;
        }
        break;

      // customer order complete
      case "preorder":
        title = "Order Confirmation - Rabuste Coffee";
        emailMessage = `Hi ${name},\n\nYour order for ₹${data.amount} has been placed successfully.\nOrder ID: ${referenceId}\nPickup Time: ${data.pickupTime}.\n\nThank you,\nRabuste Team`;
        break;

      // admin order email
      case "admin_new_order":
        title = `📢 New Order Received: ₹${data.amount}`;
        emailMessage = `Hello Admin,\n\nYou have received a NEW ORDER! 🎉\n\nCustomer Name: ${data.customerName}\nOrder ID: ${referenceId}\nTotal Amount: ₹${data.amount}\nPickup Time: ${data.pickupTime}\n\nPlease check the dashboard to accept/reject.`;
        break;
      
      // workshop registration
      case "workshop_registration":
        title = `Workshop Ticket Confirmed: ${data.workshopTitle} - Rabuste Coffee`;
        emailMessage = `Hi ${name},\n\nYou have successfully registered for the workshop: "${data.workshopTitle}".\n\n📅 Date: ${new Date(data.date).toLocaleDateString()}\n⏰ Time: ${data.time}\n🎟 Tickets: ${data.tickets}\n📍 Location: Rabuste HQ, Gandhinagar\n\nYour Registration ID is: ${referenceId}\n\nSee you there! ☕`;
        break;
    
      default:
        title = "Notification";
        emailMessage = "New notification from Rabuste.";
    }

    if (email) {
      const emailLog = {
        type,
        referenceId,
        channel: "email",
        recipient: email,
        title,
        message: emailMessage,
        status: "pending" 
      };

      const isSent = await sendRealEmail({
        to: email,
        subject: title,
        text: emailMessage
      });

      if (isSent) emailLog.status = "sent";
      else emailLog.status = "failed";

      notifications.push(emailLog);
    }
    
    if (notifications.length > 0) {
      await NotificationLog.insertMany(notifications);
    }

  } catch (error) {
    console.error("Notification Error:", error);
  }
};