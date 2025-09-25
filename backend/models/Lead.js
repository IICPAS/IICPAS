// models/Lead.js
import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true }, // string field for category
    assignedTo: { type: String, default: null }, // assigned staff member
    scheduledDate: { type: Date, default: null }, // scheduled follow-up date
    scheduledTime: { type: String, default: null }, // scheduled follow-up time
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model("Lead", LeadSchema);
export default Lead;
