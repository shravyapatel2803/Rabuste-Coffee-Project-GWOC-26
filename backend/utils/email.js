import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: process.env.BREVO_SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,  
    pass: process.env.BREVO_SMTP_PASS   
  }
});

export const sendRealEmail = async ({ to, subject, text }) => {
  try {

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text
    });

    return true;

  } catch (error) {
    return false;
  }
};
