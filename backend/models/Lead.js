// models/Lead.js
import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true }, // string field for category
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model("Lead", LeadSchema);
export default Lead;
