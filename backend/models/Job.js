import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    salary: {
      type: String,
      required: false, // Make it optional for backward compatibility
      set: function (value) {
        // Remove any non-numeric characters and return only numbers
        if (!value || value === "" || value === "0") {
          return "0";
        }
        const numericValue = value.toString().replace(/[^\d]/g, "");
        return numericValue || "0";
      },
    },
    status: { 
      type: String, 
      enum: ["active", "inactive"], 
      default: "active",
      required: true
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
