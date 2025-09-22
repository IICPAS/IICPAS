import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    mode: { type: String }, // online or offline
    location: { type: String },
    center: { type: String },

    receipts: [
      {
        id: String,
        file: String, // path to PDF receipt
      },
    ],

    course: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    enrolledLiveSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "LiveSession" }],
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", StudentSchema);
export default Student;
