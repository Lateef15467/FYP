import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Pending" },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, default: false },
  transactionId: { type: String }, // REQUIRED FOR JAZZCASH
  date: { type: Number, required: true },
});

export default mongoose.model("order", orderSchema);
