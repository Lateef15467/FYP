// routes/OrderRoute.js
import express from "express";
import {
  placeOrder,
  placeOrderEasypaise,
  initiateJazzcash,
  jazzcashResponse,
  allOrders,
  userOrders,
  updateStatus,
  jazzcashIPN,
} from "../controller/OrderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin routes
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// User routes
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/userorders", authUser, userOrders);

// Payments
orderRouter.post("/placeEasypaisa", authUser, placeOrderEasypaise);
orderRouter.post("/initiateJazzcash", authUser, initiateJazzcash);

// JazzCash callback (public endpoint, no auth)
orderRouter.post("/jazzcash/response", jazzcashResponse);
orderRouter.post("/jazzcash/ipn", jazzcashIPN);

export default orderRouter;
