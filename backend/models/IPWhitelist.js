import mongoose from "mongoose";

const IPWhitelistSchema = new mongoose.Schema(
  {
    ipAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    addedBy: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries
IPWhitelistSchema.index({ ipAddress: 1 });
IPWhitelistSchema.index({ status: 1 });

const IPWhitelist = mongoose.model("IPWhitelist", IPWhitelistSchema);
export default IPWhitelist;
