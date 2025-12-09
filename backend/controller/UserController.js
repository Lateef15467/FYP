import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEMail } from "../utils/SendEmail.js";
import { resendOtpEmail } from "../utils/SendEmail.js";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";
import VerifyOtp from "../models/VerifyOtp.js";
dotenv.config();

const pendingUsers = new Map();

// Temporary store for reset tokens
const resetTokens = new Map();

// =============== Forgot Password ===============
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    resetTokens.set(token, {
      email: email,
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${user.name || "User"},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #000; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetLink}</p>
        <p><strong>This link expires in 15 minutes.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail(email, "Reset Your Password - ShopNow", html);

    console.log(`Reset link sent to: ${email}`);
    res.json({
      success: true,
      message: "Reset link sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// =============== Reset Password ===============
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.json({
        success: false,
        message: "Token and password are required",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const record = resetTokens.get(token);
    if (!record) {
      return res.json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    // Check if token expired
    if (record.expires < Date.now()) {
      resetTokens.delete(token);
      return res.json({
        success: false,
        message: "Reset link has expired",
      });
    }

    const user = await userModel.findOne({ email: record.email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Remove used token
    resetTokens.delete(token);

    console.log(`Password reset successful for: ${record.email}`);
    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }
    if (!user.isVerified) {
      return res.json({
        success: false,
        message: "Please verify your email before login",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);

      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user register
// ================== REGISTER (NO USER CREATION YET) ==================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check user exists
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Email validation
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Store user info in temporary memory BEFORE verification
    pendingUsers.set(email, {
      name,
      email,
      password,
      role: role || "user",
      createdAt: Date.now(),
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete old OTP
    await VerifyOtp.deleteMany({ email });

    await VerifyOtp.create({
      email,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // expires 10 mins
    });

    // Send OTP email
    sendEMail({
      to: email,
      name,
      otp,
      subject: "Verify Your Email",
    });

    return res.json({
      success: true,
      message: "OTP sent to email. Complete verification to create account.",
    });
  } catch (error) {
    console.log("Registration Error:", error);
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
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get user info by ID
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ success: false, message: "Invalid user ID" });
    }

    const user = await userModel.findById(id).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Update user info
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, profilePic } = req.body;

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

// ================== VERIFY OTP & CREATE USER ==================
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await VerifyOtp.findOne({ email });
    if (!otpRecord) {
      return res.json({ success: false, message: "OTP not found" });
    }

    if (otpRecord.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < Date.now()) {
      await VerifyOtp.deleteOne({ email });
      return res.json({ success: false, message: "OTP expired" });
    }

    // Get stored data from pending list
    const pending = pendingUsers.get(email);
    if (!pending) {
      return res.json({
        success: false,
        message: "User session expired. Register again.",
      });
    }

    // Hash password now
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pending.password, salt);

    // Create user in DB now
    const newUser = await userModel.create({
      name: pending.name,
      email: pending.email,
      password: hashedPassword,
      role: pending.role,
      isVerified: true,
    });

    // Cleanup
    await VerifyOtp.deleteOne({ email });
    pendingUsers.delete(email);

    return res.json({
      success: true,
      message: "Email verified and account created",
      userId: newUser._id,
    });
  } catch (error) {
    console.log("OTP Verify Error:", error);
    res.json({ success: false, message: error.message });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!pendingUsers.has(email)) {
      return res.json({
        success: false,
        message: "No pending registration found. Register again.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await VerifyOtp.deleteOne({ email });

    await VerifyOtp.create({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    resendOtpEmail({
      to: email,
      name: pendingUsers.get(email).name,
      otp,
      subject: "Your New OTP",
    });

    res.json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    return res.json({ success: true, users });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    if (!user) return res.json({ success: false, message: "User not found" });

    user.blocked = !user.blocked;
    await user.save();

    res.json({
      success: true,
      message: user.blocked ? "User blocked" : "User unblocked",
      user,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
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
  verifyOtp,
  resendOtp,
  getAllUsers,
  toggleBlockUser,
};
