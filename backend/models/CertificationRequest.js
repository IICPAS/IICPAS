import mongoose from "mongoose";

const certificationRequestSchema = new mongoose.Schema(
  {
    college: { type: String, required: true },
    specialization: { type: String, required: true },
    topics: [{ type: String, required: true }],
    document: { type: String },
    status: {
      type: String,
      enum: ["pending", "active"],
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
