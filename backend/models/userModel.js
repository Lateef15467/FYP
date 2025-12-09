import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    cartData: { type: Object, default: {} },
    profilePic: { type: String, default: "" },
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    blocked: { type: Boolean, default: false },
  },

  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//       minlength: [2, "Name must be at least 2 characters"],
//       maxlength: [50, "Name cannot exceed 50 characters"],
//     },

//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       trim: true,
//       lowercase: true,
//       match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters"],
//       match: [
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
//         "Password must include uppercase, lowercase, number, and symbol",
//       ],
//     },

//     cartData: {
//       type: Object,
//       default: {},
//     },

//     profilePic: {
//       type: String,
//       default: "",
//     },

//     otp: {
//       type: String,
//       minlength: [4, "OTP must be 4 digits"],
//       maxlength: [6, "OTP cannot exceed 6 digits"],
//     },

//     otpExpiry: {
//       type: Date,
//     },

//     isVerified: {
//       type: Boolean,
//       default: false,
//     },

//     role: {
//       type: String,
//       enum: {
//         values: ["user", "admin"],
//         message: "Role must be 'user' or 'admin'",
//       },
//       default: "user",
//     },

//     blocked: {
//       type: Boolean,
//       default: false,
//     },
//   },

//   { minimize: false }
// );

// const userModel = mongoose.models.user || mongoose.model("user", userSchema);
// export default userModel;
