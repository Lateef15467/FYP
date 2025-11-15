// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/UserRoute.js";
import productRouter from "./routes/ProductRoute.js";
import cartRouter from "./routes/CartRoute.js";
import orderRouter from "./routes/OrderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect services
connectDB();
connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());

// JazzCash callback sends x-www-form-urlencoded form data.
// Must be BEFORE route that handles /api/orders/jazzcash/response
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

// Health check
app.get("/", (req, res) => res.send("API Working"));

// Start
app.listen(port, () => console.log("Server started on port: " + port));
