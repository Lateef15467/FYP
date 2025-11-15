// controller/OrderController.js
import orderModel from "../models/OrderModel.js";
import userModel from "../models/userModel.js";
import { generateJazzcashHash } from "../utils/jazzcashHelper.js";
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

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    if (userId) {
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
    }

    res.json({ success: true, message: "Order placed successfully (COD)." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------- Get All Orders (Admin) -------------------------- */
export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------- Get Orders for User -------------------------- */
export const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------- Update Order Status (Admin) -------------------------- */
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------- Easypaisa Order -------------------------- */
export const placeOrderEasypaise = async (req, res) => {
  try {
    const { userId, items, amount, address, transactionId } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "easypaisa",
      payment: true,
      transactionId,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    if (userId) {
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
    }

    res.json({
      success: true,
      message: "Order placed successfully (Easypaisa).",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------- JazzCash Initiate -------------------------- */
export const initiateJazzcash = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    // unique txnRef (use something identifiable)
    const transactionId = `T${Date.now()}`;

    // Save order in DB BEFORE redirect
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
    // optional: clear cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // JazzCash datetime format: yyyyMMddHHmmss
    const formattedDate = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    // Build payload (pp_SecureHash left empty for now)
    const postData = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
      pp_Password: process.env.JAZZCASH_PASSWORD,
      pp_TxnRefNo: transactionId,
      pp_Amount: String(Math.round(Number(amount) * 100)), // paisa as integer string
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: formattedDate,
      pp_BillReference: newOrder._id.toString(),
      pp_Description: "Order Payment",
      pp_ReturnURL: process.env.JAZZCASH_RETURN_URL,
      // optional merchant profile fields:
      ppmpf_1: userId || "user",
      ppmpf_2: "ecommerce",
      // pp_SecureHash will be appended after generation
      pp_SecureHash: "",
    };

    // Generate secure hash and set it
    postData.pp_SecureHash = generateJazzcashHash(postData);

    const paymentUrl = process.env.JAZZCASH_PAYMENT_URL;

    // Build auto-submitting HTML form
    const inputs = Object.entries(postData)
      .map(([k, v]) => `<input type="hidden" name="${k}" value="${v}" />`)
      .join("\n");

    const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Redirecting to JazzCash...</title></head>
  <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial,Helvetica,sans-serif">
    <div style="text-align:center">
      <p style="font-weight:bold">Redirecting to JazzCash for payment...</p>
      <form id="jazzForm" method="POST" action="${paymentUrl}">
        ${inputs}
      </form>
    </div>
    <script>document.getElementById('jazzForm').submit();</script>
  </body>
</html>`;

    // Return html so frontend can open a new page and render it (or we can directly respond with it)
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

// JazzCash callback handler
export const jazzcashResponse = async (req, res) => {
  try {
    // JazzCash sends a form post (urlencoded). Make sure express.urlencoded() is enabled.
    console.log("🎯 JazzCash callback body:", req.body);

    // Grab response code (different cases sometimes used)
    const responseCode =
      req.body.pp_ResponseCode ||
      req.body.PP_ResponseCode ||
      req.body.pp_responseCode;
    const txnRef =
      req.body.pp_TxnRefNo || req.body.PP_TxnRefNo || req.body.pp_txnRefNo;

    // Optional: validate secure hash returned by JazzCash (they may send one)
    // If provided, you can re-generate a hash from returned fields and compare.

    // Find order by transactionId (we set pp_TxnRefNo to transactionId earlier)
    const order = await orderModel.findOne({ transactionId: txnRef });
    if (!order) {
      console.warn("Order not found for txnRef:", txnRef);
    }

    if (responseCode === "000") {
      // success
      if (order) {
        order.payment = true;
        order.status = "Payment Successful";
        await order.save();
      }
      // redirect user to frontend success page
      return res.redirect("https://shopnowf.vercel.app/payment-success");
    } else {
      // failure
      if (order) {
        order.payment = false;
        order.status = `Payment Failed (${responseCode})`;
        await order.save();
      }
      return res.redirect("https://shopnowf.vercel.app/payment-failed");
    }
  } catch (err) {
    console.error("💥 jazzcashResponse error:", err);
    return res.redirect("https://shopnowf.vercel.app/payment-error");
  }
};
export const jazzcashIPN = async (req, res) => {
  try {
    console.log("🎯 JazzCash IPN Received:", req.body);

    const responseCode = req.body.pp_ResponseCode;
    const transactionId = req.body.pp_TxnRefNo;

    if (!transactionId) {
      console.log("❌ Missing Transaction ID in IPN");
      return res.status(200).send("INVALID");
    }

    if (responseCode === "000") {
      await orderModel.findOneAndUpdate(
        { transactionId },
        { payment: true, status: "Payment Successful (IPN)" }
      );

      console.log("✅ Payment marked as successful via IPN");
    } else {
      await orderModel.findOneAndUpdate(
        { transactionId },
        { payment: false, status: "Payment Failed (IPN)" }
      );

      console.log("❌ Payment failed via IPN");
    }

    return res.status(200).send("IPN OK");
  } catch (error) {
    console.log("💥 IPN Error:", error);
    return res.status(200).send("IPN ERROR");
  }
};
