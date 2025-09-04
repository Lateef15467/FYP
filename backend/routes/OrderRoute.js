import express from "express";
import {
  placeJezzcash,
  placeOrder,
  placeOrderEasypaise,
  allOrders,
  userOrders,
  updateStatus,
} from "../controller/OrderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

//admin feature
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

//payment feature

orderRouter.post("/place", authUser, placeOrder);

// user feature

orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter;
