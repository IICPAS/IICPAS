import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    name: String,
    email: String,
    phone: String,
    resumeLink: String,
    shortlisted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
