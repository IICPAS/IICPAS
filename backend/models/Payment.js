import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    transactionId: {
      type: String,
      default: "",
    },
    paymentScreenshot: {
      type: String, // path to uploaded screenshot
      default: "",
    },
    paymentMethod: {
      type: String,
      default: "UPI",
    },
    upiDetails: {
      name: {
        type: String,
        default: "Lokesh Gupta",
      },
      upiHandle: {
        type: String,
        default: "8810380146@ptaxis",
      },
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    invoiceSent: {
      type: Boolean,
      default: false,
    },
    invoiceSentAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
