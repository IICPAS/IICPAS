// models/Alert.js
import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  { timestamps: true }
);

export const Alert = mongoose.model("Alert", AlertSchema);
