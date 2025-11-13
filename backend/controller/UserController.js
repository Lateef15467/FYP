import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/SendEmail.js";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";
dotenv.config();

// temporary store for reset tokens (or use DB)
let resetTokens = new Map();

// =============== Forgot Password ===============
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    resetTokens.set(token, { email, expires: Date.now() + 15 * 60 * 1000 }); // 15 min

    const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${token}`;
    const html = `
      <p>Hello ${user.name || "User"},</p>
      <p>Click below to reset your password:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>This link expires in 15 minutes.</p>
    `;

    await sendEmail(email, "Reset Your Password", html);

    res.json({ success: true, message: "Reset link sent to email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// =============== Reset Password ===============
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const record = resetTokens.get(token);
    if (!record)
      return res.json({ success: false, message: "Invalid or expired link" });

    if (record.expires < Date.now()) {
      resetTokens.delete(token);
      return res.json({ success: false, message: "Link expired" });
    }

    const user = await userModel.findOne({ email: record.email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    resetTokens.delete(token);
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);

      // ✅ added user info here
      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.json({ success: false, message: "invalid crediential" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking user already exist or not
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({ success: false, message: "user already exist" });
    }

    // validating email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "enter strong password" });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    // ✅ added user info here
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "invalid crediential" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// Get user info by ID
const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Update user info (name, email, profilePic)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, profilePic } = req.body; // include email too

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { name, email, profilePic },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
};
