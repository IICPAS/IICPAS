import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  // Student information
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  // Course information
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  // Payment details
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },

  // UTR-based payment details
  utrNumber: { type: String, required: true },
  paymentMethod: { type: String, default: "UPI" },

  // UPI details
  upiDetails: {
    name: { type: String, default: "Lokesh Gupta" },
    upiHandle: { type: String, default: "8810380146@ptaxis" },
  },

  // Transaction status
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },

  // Admin verification
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
  },
  verifiedAt: { type: Date, default: null },

  // Additional information
  notes: { type: String, default: "" },

  // Legacy fields for backward compatibility
  email: { type: String },
  name: { type: String },
  for: { type: String },
  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },
  bookingId: { type: String },
  receiptLink: { type: String },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field before saving
TransactionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
export default Transaction;
