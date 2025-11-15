import express from "express";
import {
  placeOrder,
  userOrders,
  allOrders,
  updateStatus,
  initiateJazzcash,
  jazzcashResponse,
} from "../controller/OrderController.js";

import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/place", authUser, placeOrder);
router.post("/userorders", authUser, userOrders);

router.post("/initiateJazzcash", authUser, initiateJazzcash);
router.post("/jazzcash/response", jazzcashResponse);

router.post("/list", adminAuth, allOrders);
router.post("/status", adminAuth, updateStatus);

export default router;
