import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
  documentPath: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  otp: String,
  otpExpiry: Date,
  createdAt: { type: Date, default: Date.now },
});

export const Company = mongoose.model("Company", companySchema);
