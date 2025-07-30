import nodemailer from "nodemailer";

// transporter function
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER_HOST,
  port: process.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
