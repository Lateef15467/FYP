import express from "express";
import { addVendor } from "../controller/vendorController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/add", adminAuth, addVendor);

export default router;
