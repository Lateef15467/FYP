// routes/OrderRoute.js
import express from "express";
import {
  placeOrder,
  placeOrderEasypaise,
  initiateJazzcash,
  jazzcashResponse,
  allOrders,
  userOrders,
  deleteOrder,
  updateStatus,
  jazzcashIPN,
} from "../controller/OrderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";
import vendorAuth from "../middleware/vendorAuth.js";

const orderRouter = express.Router();

// Admin and vendor routes
orderRouter.post("/list", vendorAuth, allOrders);
orderRouter.post("/status", vendorAuth, updateStatus);

// User routes
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/userorders", authUser, userOrders);

// Payments
orderRouter.post("/placeEasypaisa", authUser, placeOrderEasypaise);
orderRouter.post("/initiateJazzcash", authUser, initiateJazzcash);

// JazzCash callback (public endpoint, no auth)
orderRouter.post("/jazzcash/response", jazzcashResponse);
orderRouter.post("/jazzcash/ipn", jazzcashIPN);

orderRouter.delete("/delete/:id", vendorAuth, deleteOrder);

export default orderRouter;
