import mongoose from "mongoose";

const certificationRequestSchema = new mongoose.Schema(
  {
    college: { type: String, required: true },
    course: { type: String, required: true },
    syllabus: { type: String, required: true },
    brochure: { type: String },
    examCenter: { type: String, required: true },
    fees: { type: Number, required: true },
    sampleCertificate: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const CertificationRequest = mongoose.model(
  "CertificationRequest",
  certificationRequestSchema
);

export default CertificationRequest;
