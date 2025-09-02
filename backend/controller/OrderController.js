import orderModel from "../models/OrderModel.js";
import userModel from "../models/userModel.js";

//placing order using cod method

const placeOrder = async (req, res) => {
  try {
    const { userId, cartItems, amount, address } = req.body;

    const orderData = {
      userId,
      cartItems,
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

const allOrder = async (req, res) => {};
//user order data for frontend

const userOrders = async (req, res) => {};
//  update order status from admin panel

const updateStatus = async (req, res) => {};

//placing order using easypaise method

const placeOrderEasypaise = async (req, res) => {};
//placing order using jezzcash method

const placeJezzcash = async (req, res) => {};
export {
  placeOrder,
  placeJezzcash,
  allOrder,
  userOrders,
  updateStatus,
  placeOrderEasypaise,
};
