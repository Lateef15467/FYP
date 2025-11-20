import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOrderEmail = async (email, orderId, amount, items) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ----------------------------
    // Generate dynamic product rows
    // ----------------------------
    const productRows = items
      .map(
        (item) => `
      <tr style="border-bottom:1px solid #eee;">
        <td style="padding:10px; text-align:center;">
          <img src="${item.image}" width="60" height="60" style="border-radius:8px;" />
        </td>
        <td style="padding:10px;">${item.name}</td>
        <td style="padding:10px; text-align:center;">${item.quantity}</td>
        <td style="padding:10px; text-align:right;">Rs. ${item.price}</td>
      </tr>
    `
      )
      .join("");

    // ----------------------------
    // HTML Email Template
    // ----------------------------
    const mailOptions = {
      from: `ShopNow <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `ShopNow - Order Confirmation #${orderId}`,
      html: `
        <div style="
          width:100%;
          background:#f7f7f7;
          padding:20px 0;
          font-family:Arial, sans-serif;
        ">
          <div style="
            max-width:600px;
            background:white;
            margin:auto;
            padding:20px;
            border-radius:10px;
            box-shadow:0 0 10px rgba(0,0,0,0.1);
          ">
            
            <h2 style="color:#2c3e50; text-align:center;">
              Your Order is Confirmed 🎉
            </h2>
            
            <p style="text-align:center; font-size:16px;">
              Thank you for ordering from <strong>ShopNow</strong>!
            </p>

            <hr style="margin:20px 0;">

            <h3>📦 Order Details</h3>

            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>

            <h3 style="margin-top:20px;">🛍️ Ordered Items</h3>

            <table width="100%" style="border-collapse:collapse;">
              <tr style="background:#f2f2f2;">
                <th style="padding:10px;">Image</th>
                <th style="padding:10px;">Product</th>
                <th style="padding:10px;">Qty</th>
                <th style="padding:10px;">Price</th>
              </tr>

              ${productRows}
            </table>

            <hr style="margin:20px 0;">

            <h3 style="text-align:right; color:#16a34a;">
              Total Amount: Rs. ${amount}
            </h3>

            <p style="margin-top:20px;">
              We will notify you once your order is shipped.  
              You can contact support anytime.
            </p>

            <div style="text-align:center; margin-top:30px;">
              <a href="#" style="
                background:#2563eb;
                color:white;
                padding:12px 20px;
                text-decoration:none;
                border-radius:6px;
                font-weight:bold;
              ">
                Visit ShopNow
              </a>
            </div>

            <p style="text-align:center; margin-top:20px; color:#888;">
              © ${new Date().getFullYear()} ShopNow. All rights reserved.
            </p>

          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order email sent successfully!");
  } catch (err) {
    console.log("Email sending failed:", err.message);
  }
};
