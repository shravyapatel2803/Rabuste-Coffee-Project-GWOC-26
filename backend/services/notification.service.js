import NotificationLog from "../models/notification.model.js";
import { sendRealEmail } from "../utils/email.js";

export const logNotification = async ({ type, referenceId, recipient, data }) => {
  try {
    const { name, email } = recipient || {};
    let emailMessage = "";
    let title = "";

    switch (type) {
      case "order_update": {
        const status = data.status;
        title = `Order Update: ${status} - Rabuste Coffee`;

        if (status === "Confirmed")
          emailMessage = `Hi ${name},\n\nGood news! Your order #${referenceId
            .slice(-6)
            .toUpperCase()} has been CONFIRMED.`;
        else if (status === "Preparing")
          emailMessage = `Hi ${name},\n\nYour order is now being PREPARED by our chefs. 👨‍🍳`;
        else if (status === "Ready")
          emailMessage = `Hi ${name},\n\nYour order is READY for pickup! ☕\nOrder ID: ${referenceId}`;
        else if (status === "Completed")
          emailMessage = `Hi ${name},\n\nThank you for visiting Rabuste Coffee! Your order is COMPLETED.`;
        else if (status === "Cancelled")
          emailMessage = `Hi ${name},\n\nYour order #${referenceId
            .slice(-6)
            .toUpperCase()} has been CANCELLED.`;
        break;
      }

      case "preorder":
        title = "Order Confirmation - Rabuste Coffee";
        emailMessage = `Hi ${name},\n\nYour order for ₹${data.amount} has been placed successfully.\nOrder ID: ${referenceId}`;
        break;

      case "admin_new_order":
        title = `📢 New Order Received: ₹${data.amount}`;
        emailMessage = `Hello Admin,\n\nNew Order!\nCustomer: ${data.customerName}\nAmount: ₹${data.amount}`;
        break;

      case "workshop_registration":
        title = `Workshop Ticket Confirmed: ${data.workshopTitle}`;
        emailMessage = `Hi ${name},\n\nRegistration Confirmed: "${data.workshopTitle}".\nDate: ${new Date(
          data.date
        ).toLocaleDateString()}\nTickets: ${data.tickets}`;
        break;

      case "admin_franchise_enquiry":
        title = `📢 New Franchise Enquiry: ${data.city}`;
        emailMessage = `Hello Admin,\n\nYou have received a new Franchise Enquiry!\n\nName: ${data.name}\nCity: ${data.city}, ${data.state}\nBudget: ${data.investmentRange}\nPhone: ${data.phone}\nEmail: ${data.email}\n\nMessage:\n"${data.message}"`;
        break;

      case "franchise_status_update":
        title = `Update on your Franchise Enquiry - Rabuste Coffee`;
        emailMessage = `Hi ${name},\n\nYour franchise enquiry status has been updated to: ${data.status.toUpperCase()}.\n\nBest Regards,\nRabuste Team`;
        break;

      case "admin_password_reset":
        title = "🔒 Security Alert: Password Reset - Rabuste Admin";
        emailMessage = `Hello ${name},\n\nYour password has been reset.\nTemporary Password: ${data.tempPassword}\n\nPlease change it after login.`;
        break;

      default:
        title = "Notification - Rabuste";
        emailMessage = "You have a new notification from Rabuste Coffee.";
    }


    if (email) {
      const emailLog = {
        type,
        referenceId,
        channel: "email",
        recipient: email,
        title,
        message: emailMessage,
        status: "queued" 
      };

      // SEND EMAIL IN BACKGROUND (NO await)
      sendRealEmail({
        to: email,
        subject: title,
        text: emailMessage
      })
        .then(() => {
          emailLog.status = "sent";
          NotificationLog.create(emailLog);
        })
        .catch((err) => {
          emailLog.status = "failed";
          NotificationLog.create(emailLog);
          console.error("Email failed:", err.message);
        });
    }

  } catch (error) {
    console.error("Notification Service Error:", error);
  }
};
