import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  amount: { type: Number, required: true },
  for: { type: String, required: true }, // e.g. training title
  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },
  bookingId: { type: String }, // Store the booking ID
  status: { type: String, default: "success" },
  receiptLink: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
export default Transaction;
