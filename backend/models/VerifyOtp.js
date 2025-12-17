import mongoose from "mongoose";

const verifyOtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.VerifyOtp ||
  mongoose.model("VerifyOtp", verifyOtpSchema);
