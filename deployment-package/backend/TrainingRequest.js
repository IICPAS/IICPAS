import mongoose from "mongoose";

const trainingRequestSchema = new mongoose.Schema(
  {
    individualId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Individual",
      required: true,
    },
    individualName: {
      type: String,
      required: true,
    },
    individualEmail: {
      type: String,
      required: true,
    },
    individualPhone: {
      type: String,
      required: true,
    },
    training: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    resume: {
      type: String, // File path to uploaded resume
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "in_progress", "completed"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    approvedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
trainingRequestSchema.index({ individualId: 1, status: 1 });
trainingRequestSchema.index({ status: 1, createdAt: -1 });

const TrainingRequest = mongoose.model(
  "TrainingRequest",
  trainingRequestSchema
);

export default TrainingRequest;
