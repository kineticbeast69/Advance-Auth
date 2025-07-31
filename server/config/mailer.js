import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER_HOST, // 'smtp-relay.brevo.com'
  port: Number(process.env.SMTP_PORT), // 587
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
