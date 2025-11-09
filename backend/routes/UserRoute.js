import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  getUserById,
  updateUser,
} from "../controller/UserController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", updateUser);

export default userRouter;
