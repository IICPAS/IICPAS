import mongoose from "mongoose";

const liveSessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    time: { type: String, required: true },
    date: { type: Date, required: true },
    link: { type: String, required: true },
    price: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

const LiveSession = mongoose.model("LiveSession", liveSessionSchema);
export default LiveSession;
