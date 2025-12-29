import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

export const addVendor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "All fields required",
      });
    }

    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "vendor",
      isVerified: true,
    });

    res.json({
      success: true,
      message: "Vendor added successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Failed to add vendor",
    });
  }
};
export const getVendors = async (req, res) => {
  try {
    const vendors = await userModel
      .find({ role: "vendor" })
      .select("-password");

    res.json({
      success: true,
      vendors,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to fetch vendors",
    });
  }
};
export const toggleVendorBlock = async (req, res) => {
  try {
    const vendor = await userModel.findById(req.params.id);

    if (!vendor) {
      return res.json({
        success: false,
        message: "Vendor not found",
      });
    }

    vendor.blocked = !vendor.blocked;
    await vendor.save();

    res.json({
      success: true,
      message: vendor.blocked ? "Vendor blocked" : "Vendor unblocked",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Action failed",
    });
  }
};
