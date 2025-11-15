import orderModel from "../models/OrderModel.js";
import userModel from "../models/userModel.js";
import { generateJazzcashHash } from "../utils/jazzcashHelper.js";
import dotenv from "dotenv";
dotenv.config();

/* -------------------------------- COD -------------------------------- */
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const order = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: "cod",
      payment: false,
      date: Date.now(),
      status: "Order Placed",
    });

    await order.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ------------------------------- JazzCash ------------------------------ */
export const initiateJazzcash = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const transactionId = "T" + Date.now();

    const order = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: "jazzcash",
      status: "Pending Payment",
      transactionId,
      payment: false,
      date: Date.now(),
    });

    await order.save();

    /** JazzCash Required Dates */
    const now = new Date();
    const exp = new Date(now.getTime() + 60 * 60 * 1000);

    const format = (d) =>
      d
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
      pp_Amount: String(amount * 100), // convert rupees → paisa
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: format(now),
      pp_TxnExpiryDateTime: format(exp),
      pp_ReturnURL: process.env.JAZZCASH_RETURN_URL,
      pp_BillReference: "BillRef",
      pp_Description: "Order Payment",
      pp_MobileNumber: "03001234567", // sandbox required
      pp_CNIC: "3456789012345", // sandbox required
      ppmpf_1: userId,
    };

    postData.pp_SecureHash = generateJazzcashHash(postData);

    const paymentUrl = process.env.JAZZCASH_PAYMENT_URL;

    let inputs = "";
    Object.entries(postData).forEach(([key, value]) => {
      inputs += `<input type="hidden" name="${key}" value="${value}" />\n`;
    });

    const html = `
      <html>
      <body onload="document.forms[0].submit()">
        <form method="POST" action="${paymentUrl}">
          ${inputs}
        </form>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ----------------------------- JazzCash Callback ----------------------------- */
export const jazzcashResponse = async (req, res) => {
  try {
    console.log("JazzCash Callback:", req.body);

    const code = req.body.pp_ResponseCode;
    const txn = req.body.pp_TxnRefNo;

    if (!txn) return res.redirect("https://shopnowf.vercel.app/payment-error");

    if (code === "000") {
      await orderModel.findOneAndUpdate(
        { transactionId: txn },
        { payment: true, status: "Payment Successful" }
      );
      return res.redirect("https://shopnowf.vercel.app/payment-success");
    }

    await orderModel.findOneAndUpdate(
      { transactionId: txn },
      { payment: false, status: "Payment Failed" }
    );

    return res.redirect("https://shopnowf.vercel.app/payment-failed");
  } catch (error) {
    return res.redirect("https://shopnowf.vercel.app/payment-error");
  }
};

/* --------------------------------- User -------------------------------- */
export const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* --------------------------------- Admin -------------------------------- */
export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
