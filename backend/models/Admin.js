// models/Admin.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["superadmin", "hr", "sales"], default: "sales" },
});

export default mongoose.model("Admin", adminSchema);
