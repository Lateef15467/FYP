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

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully (COD)." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

/* -------------------------- Get All Orders (Admin) -------------------------- */
export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
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
    res.json({ success: false, message: error.message });
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
    res.json({ success: false, message: error.message });
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

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order placed successfully (Easypaisa).",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

/* -------------------------- JazzCash Initiate -------------------------- */
export const initiateJazzcash = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const transactionId = "T" + Date.now();

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "jazzcash",
      payment: false,
      transactionId,
      date: Date.now(),
      status: "Pending",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Format date as yyyyMMddHHmmss
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
      pp_Amount: String(Math.round(amount * 100)), // convert to paisa
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

    console.log("✅ Initiating JazzCash:", {
      transactionId,
      amount: postData.pp_Amount,
      date: postData.pp_TxnDateTime,
    });

    const paymentUrl =
      process.env.JAZZCASH_PAYMENT_URL ||
      "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/";

    const inputs = Object.entries(postData)
      .map(([k, v]) => `<input type="hidden" name="${k}" value="${v}" />`)
      .join("\n");

    const html = `
      <!doctype html>
      <html>
        <head><meta charset="utf-8"><title>Redirecting to JazzCash...</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:Arial;">
          <p style="font-size:1.3em;font-weight:bold;">Redirecting to JazzCash for payment...</p>
          <form id="jazzForm" method="POST" action="${paymentUrl}">
            ${inputs}
          </form>
          <script>document.getElementById('jazzForm').submit();</script>
        </body>
      </html>
    `;

    res.json({
      success: true,
      message: "Redirecting to JazzCash...",
      html,
      orderId: newOrder._id,
      transactionId,
    });
  } catch (error) {
    console.error("💥 initiateJazzcash error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* -------------------------- JazzCash Response -------------------------- */
export const jazzcashResponse = async (req, res) => {
  try {
    console.log("🎯 JazzCash Raw Callback Body:", req.body);

    const responseCode = req.body.pp_ResponseCode || req.body.PP_ResponseCode;
    const responseMsg =
      req.body.pp_ResponseMessage || req.body.PP_ResponseMessage;
    const txnRefNo = req.body.pp_TxnRefNo || req.body.PP_TxnRefNo;

    console.log("✅ Response Code:", responseCode);
    console.log("💬 Response Message:", responseMsg);
    console.log("🧾 Transaction Ref No:", txnRefNo);

    if (responseCode === "000") {
      await orderModel.findOneAndUpdate(
        { transactionId: txnRefNo },
        { payment: true, status: "Payment Successful" }
      );
      return res.redirect("https://shopnowf.vercel.app/payment-success");
    }

    await orderModel.findOneAndUpdate(
      { transactionId: txnRefNo },
      { payment: false, status: "Payment Failed" }
    );

    return res.redirect("https://shopnowf.vercel.app/payment-failed");
  } catch (error) {
    console.error("💥 JazzCash Response Error:", error);
    return res.redirect("https://shopnowf.vercel.app/payment-error");
  }
};
