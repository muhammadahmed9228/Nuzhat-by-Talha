import nodemailer from "nodemailer";
import { 
    getOrderConfirmationTemplate, 
    getOrderStatusUpdateTemplate, 
    getPasswordResetTemplate 
} from "../utils/emailTemplates.js";

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"Nuzhat by Talha" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`Email sending failed to ${to}:`, error.message);
        // We do NOT throw the error to prevent breaking the main transaction flow
    }
};

export const sendOrderConfirmationEmail = async (order) => {
    await sendEmail({
        to: order.customerInfo.email,
        subject: `Order Confirmation - #${order.orderNumber}`,
        html: getOrderConfirmationTemplate(order)
    });
};

export const sendAdminNewOrderNotification = async (order) => {
    await sendEmail({
        to: process.env.SMTP_USER, // Sending to the admin/store email
        subject: `New Order Received - #${order.orderNumber}`,
        html: `<p>A new order (#${order.orderNumber}) has been placed by ${order.customerInfo.name} for Rs. ${order.pricing.total}.</p>`
    });
};

export const sendOrderStatusEmail = async (order) => {
    await sendEmail({
        to: order.customerInfo.email,
        subject: `Update on Order #${order.orderNumber}`,
        html: getOrderStatusUpdateTemplate(order)
    });
};

export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail({
        to: email,
        subject: "Password Reset Request",
        html: getPasswordResetTemplate(resetUrl)
    });
};