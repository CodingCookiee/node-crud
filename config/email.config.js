import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

//  create transporter
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//  verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email config error", error);
  } else {
    console.log("Email server is ready");
  }
});
