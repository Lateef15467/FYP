import orderModel from "../models/OrderModel.js";
import userModel from "../models/userModel.js";

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
//placing order using jezzcash method

const placeJezzcash = async (req, res) => {};
export {
  placeOrder,
  placeJezzcash,
  allOrders,
  userOrders,
  updateStatus,
  placeOrderEasypaise,
};
