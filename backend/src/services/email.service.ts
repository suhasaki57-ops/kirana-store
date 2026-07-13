import nodemailer from 'nodemailer';
import logger from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `${process.env.BUSINESS_NAME || 'E-Commerce'} <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
  } catch (error) {
    logger.error('Email send error:', error);
    throw error;
  }
};

export const sendOrderConfirmationEmail = async (
  email: string,
  orderNumber: string,
  orderDetails: { total: number }
): Promise<void> => {
  await sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order!</p>
      <h2>Order #${orderNumber}</h2>
      <p>Total: $${orderDetails.total.toFixed(2)}</p>
      <p>We'll send you updates as your order ships.</p>
    `,
  });
};

export const sendOrderStatusEmail = async (
  email: string,
  orderNumber: string,
  status: string
): Promise<void> => {
  await sendEmail({
    to: email,
    subject: `Order Status Update - ${orderNumber}`,
    html: `
      <h1>Order Status Update</h1>
      <p>Your order <strong>#${orderNumber}</strong> is now: <strong>${status}</strong></p>
    `,
  });
};
