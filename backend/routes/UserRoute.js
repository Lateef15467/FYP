import express from "express";
import {
  registerUser,
  loginUser,
  adminLogin,
  forgotPassword,
  resetPassword,
  getUserById,
  updateUser,
} from "../controller/UserController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/:id", getUserById);

// ✔ KEEPING SAME ROUTE
userRouter.put("/update/:id", updateUser);

export default userRouter;
