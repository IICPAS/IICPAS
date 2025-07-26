import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobsCompany",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    date: { type: Date, default: Date.now },
    shortlisted: { type: Boolean, default: false },
    hired: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", JobApplicationSchema);
