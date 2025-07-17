import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  document: { type: String },
  status: {
    type: String,
    enum: ["not approved", "approved"],
    default: "not approved",
  },
  otp: String,
  otpExpiry: Date,
});

export const College = mongoose.model("colleges", collegeSchema);
