import mongoose from "mongoose";

const JobsCompanySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
  },
  { timestamps: true }
);

const jobsCompany = mongoose.model("JobsCompany", JobsCompanySchema);
export default JobsCompanySchema;
