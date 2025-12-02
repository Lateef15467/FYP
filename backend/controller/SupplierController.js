// controller/SupplierController.js
import Supplier from "../models/SupplierModel.js";

export const addSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.json({ success: true, message: "Supplier added", supplier });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json({ success: true, suppliers });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Supplier deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
