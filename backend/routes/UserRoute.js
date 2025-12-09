import express from "express";
import {
  registerUser,
  loginUser,
  adminLogin,
  forgotPassword,
  resetPassword,
  getUserById,
  updateUser,
  verifyOtp,
  resendOtp,
  getAllUsers,
  toggleBlockUser,
} from "../controller/UserController.js";
// rate limiter
import createLimiter from "../middleware/rateLimiter.js";
const loginLimiter = createLimiter(
  60 * 1000,
  2,
  "You reached the 2 request limit!"
);

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginLimiter, loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.put("/update/:id", updateUser);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/resend-otp", resendOtp);

// LIST routes first
userRouter.put("/block/:id", toggleBlockUser);
userRouter.get("/users", getAllUsers);
userRouter.get("/users/:id", getUserById);

export default userRouter;
