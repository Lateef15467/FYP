import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  addVendor,
  getVendors,
  toggleVendorBlock,
} from "../controller/vendorController.js";

const router = express.Router();

router.post("/add", adminAuth, addVendor);
router.get("/list", adminAuth, getVendors);
router.put("/block/:id", adminAuth, toggleVendorBlock);

export default router;
