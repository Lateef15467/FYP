import orderModel from "../models/OrderModel.js";
import userModel from "../models/userModel.js";
import { generateJazzcashHash } from "../utils/jazzcashHelper.js";
import { sendOrderEmail } from "../utils/SendOrderEmail.js";

import dotenv from "dotenv";
dotenv.config();

/* -------------------------- COD Order -------------------------- */
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "cod",
      payment: false,
      date: Date.now(),
    };

    // Save order
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // -------------------------------
    // 👉 SEND ORDER CONFIRMATION EMAIL
    // -------------------------------
    try {
      await sendOrderEmail(address.email, newOrder._id, amount, items);
    } catch (emailErr) {
      console.log("Order email error:", emailErr.message);
    }

    res.json({ success: true, message: "Order placed successfully (COD)." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* -------------------------- All Orders (Admin) -------------------------- */
export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* -------------------------- User Orders -------------------------- */
export const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* -------------------------- Update Order Status -------------------------- */
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    let payment = false;

    // ✅ Only Delivered means payment done (COD)
    if (status === "Delivered") {
      payment = true;
    }

    await orderModel.findByIdAndUpdate(orderId, {
      status,
      payment,
    });

    res.json({ success: true, message: "Status updated successfully." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderModel.findByIdAndDelete(id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("deleteOrder error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
/* -------------------------- Easypaisa Order -------------------------- */
export const placeOrderEasypaise = async (req, res) => {
  try {
    const { userId, items, amount, address, transactionId } = req.body;

    const newOrder = new orderModel({
      userId,
      items,
      address,
      amount,
      paymentMethod: "easypaisa",
      payment: true,
      transactionId,
      date: Date.now(),
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order placed successfully (Easypaisa).",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* -------------------------- JazzCash Initiate -------------------------- */
export const initiateJazzcash = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const transactionId = "T" + Date.now();

    const newOrder = new orderModel({
      userId,
      items,
      address,
      amount,
      paymentMethod: "jazzcash",
      payment: false,
      transactionId,
      date: Date.now(),
      status: "Pending",
    });

    await newOrder.save();

    const formattedDate = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const postData = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
      pp_Password: process.env.JAZZCASH_PASSWORD,
      pp_IPNURL: process.env.JAZZCASH_IPN_URL,
      pp_TxnRefNo: transactionId,
      pp_Amount: String(Math.round(amount * 100)),
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: formattedDate,
      pp_BillReference: "BillRef",
      pp_Description: "E-commerce order payment",
      pp_ReturnURL: process.env.JAZZCASH_RETURN_URL,
      ppmpf_1: userId || "",
      ppmpf_2: "Ecommerce",
      ppmpf_3: "Order",
      ppmpf_4: "Website",
      ppmpf_5: "12345",
    };

    postData.pp_SecureHash = generateJazzcashHash(postData);

    const paymentUrl = process.env.JAZZCASH_PAYMENT_URL;

    const inputs = Object.entries(postData)
      .map(([k, v]) => `<input type="hidden" name="${k}" value="${v}" />`)
      .join("\n");

    const html = `
      <!doctype html>
      <html>
        <body onload="document.forms[0].submit()">
          <form method="POST" action="${paymentUrl}">
            ${inputs}
          </form>
        </body>
      </html>
    `;

    res.json({
      success: true,
      html,
      orderId: newOrder._id,
      transactionId,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* -------------------------- JazzCash Callback -------------------------- */
export const jazzcashResponse = async (req, res) => {
  try {
    const code = req.body.pp_ResponseCode || req.body.PP_ResponseCode;
    const msg = req.body.pp_ResponseMessage || req.body.PP_ResponseMessage;
    const refNo = req.body.pp_TxnRefNo || req.body.PP_TxnRefNo;

    if (code === "000") {
      await orderModel.findOneAndUpdate(
        { transactionId: refNo },
        { payment: true, status: "Payment Successful" }
      );
      return res.redirect("https://shopnowf.vercel.app/payment-success");
    }

    await orderModel.findOneAndUpdate(
      { transactionId: refNo },
      { payment: false, status: "Payment Failed" }
    );

    res.redirect("https://shopnowf.vercel.app/payment-failed");
  } catch (error) {
    res.redirect("https://shopnowf.vercel.app/payment-error");
  }
};
export const jazzcashIPN = async (req, res) => {
  try {
    console.log("📩 JazzCash IPN:", req.body);

    const responseCode = req.body.pp_ResponseCode;
    const txnRefNo = req.body.pp_TxnRefNo;

    if (!txnRefNo) {
      console.log("❌ IPN Missing transaction reference");
      return res.status(400).send("Invalid IPN");
    }

    if (responseCode === "000") {
      await orderModel.findOneAndUpdate(
        { transactionId: txnRefNo },
        { payment: true, status: "Payment Successful" }
      );
      console.log("✅ Payment confirmed via IPN");
      return res.status(200).send("IPN Received");
    }

    await orderModel.findOneAndUpdate(
      { transactionId: txnRefNo },
      { payment: false, status: "Payment Failed" }
    );

    console.log("❌ Payment failed via IPN");
    return res.status(200).send("IPN Received");
  } catch (error) {
    console.error("💥 IPN Error:", error);
    return res.status(500).send("IPN Error");
  }
};
