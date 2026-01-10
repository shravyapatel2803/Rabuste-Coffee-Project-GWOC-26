import "dotenv/config";   
import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.error("RESEND_API_KEY is missing");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendRealEmail = async ({ to, subject, text }) => {
  try {
    await resend.emails.send({
      from: "Rabuste Coffee <onboarding@resend.dev>",
      to,
      subject,
      text
    });
    return true;
  } catch (error) {
    console.error("Resend Email Error:", error.message);
    return false;
  }
};
