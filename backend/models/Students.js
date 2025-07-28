import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    location: { type: String },
    center: { type: String },
    mode: { type: String }, // e.g., online/offline/hybrid
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    receipts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Receipt" }],
    liveSessions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "LiveSession" },
    ],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);
export default Student;
