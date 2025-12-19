// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, require: true },
//     email: { type: String, require: true, unique: true },
//     password: { type: String, require: true },
//     cartData: { type: Object, default: {} },
//     profilePic: { type: String, default: "" },
//     otp: { type: String },
//     otpExpiry: { type: Date },
//     isVerified: { type: Boolean, default: false },
//     role: {
//       type: String,
//       enum: ["user", "admin", "vendor"],
//       default: "user",
//     },
//     blocked: { type: Boolean, default: false },
//   },

//   { minimize: false }
// );

// const userModel = mongoose.models.user || mongoose.model("user", userSchema);
// export default userModel;

// coded by furman ali
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    cartData: { type: Object, default: {} },
    profilePic: { type: String, default: "" },

    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },

    role: {
      type: String,
      enum: ["user", "admin", "vendor"],
      default: "user",
    },

    blocked: { type: Boolean, default: false },

    // 🔐 PASSWORD RESET FIELDS (REQUIRED)
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { minimize: false, timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
