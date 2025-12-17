import express from "express";
import {
  addSupplier,
  getSuppliers,
  deleteSupplier,
} from "../controller/SupplierController.js";

const router = express.Router();

router.post("/add-supplier", addSupplier);
router.get("/all", getSuppliers);
router.delete("/delete/:id", deleteSupplier);

export default router;
