// import jwt from "jsonwebtoken";

// const adminAuth = async (req, res, next) => {
//   try {
//     const { token } = req.headers;
//     if (!token) {
//       return res.json({ success: false, message: "not authorized " });
//     }
//     const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//     if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
//       return res.json({ success: false, message: "not authorized " });
//     }
//     next();
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };
// export default adminAuth;

// from her furman added
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.json({
        success: false,
        message: "Not authorized",
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user
    const admin = await userModel.findById(decoded.id);

    if (!admin || admin.role !== "admin") {
      return res.json({
        success: false,
        message: "Admin access only",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Authorization failed",
    });
  }
};

export default adminAuth;
