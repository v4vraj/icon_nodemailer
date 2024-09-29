import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // Environment variable for email user
    pass: process.env.EMAIL_APP_PWD, // Environment variable for email password
  },
});

export default transporter; // Export transporter using ES6 syntax
