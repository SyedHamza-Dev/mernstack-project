// utils/email.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
  port: process.env.EMAIL_PORT, // e.g., 587
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

export const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: `"REHAISH Support" <${process.env.EMAIL_USER}>`, 
    to: email,
    subject: 'Email Verification',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <b>${code}</b></p>`,
  };

  await transporter.sendMail(mailOptions);
};
