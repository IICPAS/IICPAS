import mongoose from "mongoose";

const JobsCompanySchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    title: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String, required: true },
    salary: {
      type: String,
      required: true,
      set: function (value) {
        // Remove any non-numeric characters and return only numbers
        return value.toString().replace(/[^\d]/g, "");
      },
    },
    jd: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["active", "inactive"], 
      default: "active",
      required: true
    },
  },
  { timestamps: true }
);

const jobsCompany = mongoose.model("JobsCompany", JobsCompanySchema);
export default jobsCompany;
