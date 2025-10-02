import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  sessionType: {
    type: String,
    enum: ["recorded", "live"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  utrNumber: {
    type: String,
    required: true,
  },
  paymentScreenshot: {
    type: String, // File path to uploaded screenshot
    required: true,
  },
  additionalNotes: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  adminNotes: {
    type: String,
    default: "",
  },
  approvedBy: {
    type: String,
    default: null,
  },
  receiptSent: {
    type: Boolean,
    default: false,
  },
  receiptSentAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
TransactionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
