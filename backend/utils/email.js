import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,       
  secure: false,          
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false 
  }
});

export const sendRealEmail = async ({ to, subject, text }) => {
  try {
    const mailOptions = {
      from: `"Rabuste Coffee" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
    };

    console.log("⏳ Sending email to:", to); 
    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent: " + info.messageId);
    return true;

  } catch (error) {
    console.error(" Email Sending Failed:", error.message);
    return false;
  }
};