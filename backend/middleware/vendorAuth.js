import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const vendorAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) return res.json({ success: false, message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user || !["vendor", "admin"].includes(user.role)) {
      return res.json({ success: false, message: "Access denied" });
    }

    req.user = user;
    next();
  } catch {
    res.json({ success: false, message: "Authorization failed" });
  }
};

export default vendorAuth;
