import mongoose from "mongoose";

const centerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  document: { type: String }, // Verification document path
  image: { type: String }, // Profile image field
  status: {
    type: String,
    enum: ["not approved", "approved"],
    default: "not approved",
  },
  otp: String,
  otpExpiry: Date,
  location: { type: String },
  address: { type: String },
  type: { type: String }, // Type of center/institute
}, {
  timestamps: true,
});

export const Center = mongoose.model("Center", centerSchema);
