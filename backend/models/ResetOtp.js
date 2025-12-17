// /models/ResetOtp.js
import mongoose from "mongoose";

const resetOtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ResetOtp ||
  mongoose.model("ResetOtp", resetOtpSchema);
