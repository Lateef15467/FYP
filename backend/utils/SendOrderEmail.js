import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOrderEmail = async (email, orderId, amount) => {
  try {
    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // your App Password
      },
    });

    // Email content
    const mailOptions = {
      from: `ShopNow <${process.env.EMAIL_USER}>`, // ✔ Store name fixed
      to: email,
      subject: "ShopNow - Order Confirmation", // ✔ Better subject
      html: `
        <h2>Your Order is Confirmed 🎉</h2>
        <p>Thank you for ordering from <strong>ShopNow</strong>.</p>

        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total Amount:</strong> Rs. ${amount}</p>

        <br>
        <p>We will inform you once your order is shipped.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Order email sent!");
  } catch (err) {
    console.log("Email sending failed:", err.message);
  }
};
