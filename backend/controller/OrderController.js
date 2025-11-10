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

    // 1️⃣ Generate a transaction ID
    const transactionId = "T" + Date.now();

    // 2️⃣ Create the order in DB
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

    // 3️⃣ Prepare JazzCash request data
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
      pp_TxnRefNo: transactionId,
      pp_Amount: String(Math.round(amount * 100)),
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: formattedDate,
      pp_BillReference: "billRef",
      pp_Description: "Order Payment",
      pp_ReturnURL: process.env.JAZZCASH_RETURN_URL,

      // ✅ Add these 5 custom fields with dummy values
      ppmpf_1: userId || "user",
      ppmpf_2: "ecommerce",
      ppmpf_3: "order",
      ppmpf_4: "website",
      ppmpf_5: "12345",
    };

    // 4️⃣ Generate hash
    postData.pp_SecureHash = generateJazzcashHash(postData);

    // 5️⃣ Hosted payment page URL (Customer portal)
    const paymentUrl =
      process.env.JAZZCASH_PAYMENT_URL ||
      "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/";

    // 6️⃣ Create auto-submitting form
    const inputsHtml = Object.entries(postData)
      .map(([k, v]) => `<input type="hidden" name="${k}" value="${v}" />`)
      .join("\n");

    const htmlForm = `
      <!doctype html>
      <html>
        <head><meta charset="utf-8"><title>Redirecting to JazzCash...</title></head>
        <body>
          <p>Redirecting to JazzCash for payment...</p>
          <form id="jazzForm" method="post" action="${paymentUrl}">
            ${inputsHtml}
          </form>
          <script>document.getElementById('jazzForm').submit();</script>
        </body>
      </html>
    `;

    // 7️⃣ Send form HTML to frontend
    res.json({
      success: true,
      message: "Initiated JazzCash payment",
      html: htmlForm,
      orderId: newOrder._id,
      transactionId,
    });
  } catch (error) {
    console.error("initiateJazzcash error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const jazzcashResponse = async (req, res) => {
  try {
    // JazzCash will POST many fields. Inspect req.body in logs to see exact keys.
    const body = req.body;
    console.log("JazzCash callback body:", body);

    const merchantTxnRef =
      body.PP_MerchantTxnRefNo ||
      body.pp_MerchantTxnRefNo ||
      body.pp_MerchantTxnRefNo; // adapt
    const responseCode =
      body.PP_ResponseCode || body.pp_ResponseCode || body.pp_ResponseCode;

    // Optionally: verify secure hash here using generateJazzcashHash with the fields JazzCash expects.
    // If valid and responseCode === "000" -> success

    if (responseCode === "000") {
      await orderModel.findOneAndUpdate(
        { transactionId: merchantTxnRef },
        { payment: true, status: "Payment Successful" }
      );
      // send user-facing success HTML or JSON
      return res.send("Payment successful. Thank you.");
    } else {
      await orderModel.findOneAndUpdate(
        { transactionId: merchantTxnRef },
        { payment: false, status: "Payment Failed" }
      );
      return res.send("Payment failed or canceled.");
    }
  } catch (error) {
    console.error("jazzcashResponse error:", error);
    res.status(500).send("Server error");
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
