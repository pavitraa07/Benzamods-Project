// utils/sendOrderEmail.js
import nodemailer from "nodemailer";

export const sendOrderEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your Gmail from .env
      pass: process.env.EMAIL_PASS, // your app password from .env
    },
  });

  await transporter.sendMail({
    from: `"Benzamods" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
