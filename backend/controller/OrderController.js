import orderModel from "../models/OrderModel.js";
import userModel from "../models/userModel.js";
import axios from "axios";
import { generateJazzcashHash } from "../utils/jazzcashHelper.js";
import dotenv from "dotenv";
dotenv.config();

//placing order using cod method

const placeOrder = async (req, res) => {
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
    const newOrder = new orderModel(orderData);

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "order placing" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//  all orders data for admin panel

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//user order data for frontend

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//  update order status from admin panel

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//placing order using easypaise method

const placeOrderEasypaise = async (req, res) => {
  try {
    const { userId, items, amount, address, transactionId } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "easypaisa",
      payment: true, // since online payment
      transactionId, // keep track of payment reference
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed with Easypaisa" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
// NOTE: replace your current placeJezzcash with this initiate function
const initiateJazzcash = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const transactionId = "T" + Date.now();

    // save order
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "jazzcash",
      payment: false,
      transactionId,
      date: Date.now(),
      status: "pending",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // JazzCash datetime format: yyyyMMddHHmmss
    const formattedDate = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    // ✅ Create payload
    const postData = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
      pp_Password: process.env.JAZZCASH_PASSWORD,
      pp_TxnRefNo: transactionId,
      pp_Amount: String(Math.round(amount * 100)), // e.g. 250.00 -> 25000
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: formattedDate,
      pp_BillReference: "billRef",
      pp_Description: "Order Payment",
      pp_ReturnURL: process.env.JAZZCASH_RETURN_URL,
      pp_SecureHash: "", // will add below
      ppmpf_1: userId || "user",
      ppmpf_2: "ecommerce",
      ppmpf_3: "order",
      ppmpf_4: "website",
      ppmpf_5: "12345",
    };

    // ✅ generate hash and attach
    postData.pp_SecureHash = generateJazzcashHash(postData);

    const paymentUrl =
      process.env.JAZZCASH_PAYMENT_URL ||
      "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/";

    // ✅ Generate auto-submitting HTML form
    const inputs = Object.entries(postData)
      .map(([k, v]) => `<input type="hidden" name="${k}" value="${v}" />`)
      .join("\n");

    const html = `
      <!doctype html>
      <html>
        <head><meta charset="utf-8"><title>Redirecting to JazzCash...</title></head>
        <body>
          <p>Redirecting to JazzCash for payment...</p>
          <form id="jazzForm" method="POST" action="${paymentUrl}">
            ${inputs}
          </form>
          <script>document.getElementById('jazzForm').submit();</script>
        </body>
      </html>
    `;

    return res.json({
      success: true,
      message: "Redirecting to JazzCash",
      html,
      orderId: newOrder._id,
      transactionId,
    });
  } catch (error) {
    console.error("initiateJazzcash error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const jazzcashResponse = async (req, res) => {
  try {
    const body = req.body;
    console.log("🎯 JazzCash callback body:", body);

    const responseCode = body.pp_ResponseCode || body.PP_ResponseCode;

    // Successful
    if (responseCode === "000") {
      // Update payment in DB (optional)
      await orderModel.findOneAndUpdate(
        { transactionId: body.pp_TxnRefNo },
        { payment: true, status: "Payment Successful" }
      );

      // Redirect to frontend success page
      return res.redirect("https://shopnowf.vercel.app/payment-success");
    }

    // Failed
    await orderModel.findOneAndUpdate(
      { transactionId: body.pp_TxnRefNo },
      { payment: false, status: "Payment Failed" }
    );

    return res.redirect("https://shopnowf.vercel.app/payment-failed");
  } catch (err) {
    console.error("💥 jazzcashResponse error:", err);
    return res.redirect("https://shopnowf.vercel.app/payment-error");
  }
};

export {
  placeOrder,
  initiateJazzcash,
  allOrders,
  userOrders,
  updateStatus,
  placeOrderEasypaise,
  jazzcashResponse,
};
