import express from "express";
import {
  listProduct,
  addProduct,
  removeProduct,
  singleProduct,
  getProductById,
  updateProduct,
} from "../controller/ProductController.js";
import upload from "../middleware/Multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);

productRouter.post("/remove", removeProduct);
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProduct);

// 🔥 UPDATE ROUTE MUST COME BEFORE /:id
productRouter.put(
  "/update/:id",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  updateProduct
);

// ❗ THIS MUST BE LAST — otherwise it breaks update route
productRouter.get("/:id", getProductById);

export default productRouter;
