import { transporter } from "../config/email.config.js";

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email send error", error);
    throw error;
  }
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  const subject = "Welcome to Our E-Commerce Store!";
  const html = `
    <h1>Welcome ${userName}!</h1>
    <p>Thank you for registering with us.</p>
    <p>Start shopping now and enjoy exclusive deals!</p>`;
  await sendEmail(userEmail, subject, html);
};

export const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const subject = `Order Confirmation - #${orderDetails.orderId}`;
  const html = `
    <h1>Order Confirmed!</h1>
    <p>Thank you for your order.</p>
    <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
    <p><strong>Total:</strong> $${orderDetails.total}</p>
    <p>We'll send you another email when your order ships.</p>
  `;

  await sendEmail(userEmail, subject, html);
};

export const sendOrderStatusEmail = async (userEmail, orderDetails) => {
  const subject = `Order Update - #${orderDetails.orderId}`;
  const html = `
    <h1>Order Status Updated</h1>
    <p>Your order status has been updated.</p>
    <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
    <p><strong>Status:</strong> ${orderDetails.status.toUpperCase()}</p>
  `;

  await sendEmail(userEmail, subject, html);
};
