// models/JobApplication.js
import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  resumeUrl: { type: String, required: true }, // store file path or cloud URL
  coverLetter: { type: String },
  status: {
    type: String,
    enum: ["Applied", "Shortlisted", "Rejected"],
    default: "Applied",
  },
  appliedAt: { type: Date, default: Date.now },
});

const JobApplier =
  mongoose.models.JobApplication ||
  mongoose.model("JobApplier", JobApplicationSchema);
export default JobApplier;
