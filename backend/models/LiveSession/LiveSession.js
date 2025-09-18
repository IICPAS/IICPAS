import mongoose from "mongoose";

const liveSessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    instructor: { type: String, default: "" },
    description: { type: String, default: "" },
    time: { type: String, required: true },
    date: { type: Date, required: true },
    link: { type: String, required: true },
    price: { type: Number, default: 0 },
    category: { type: String, default: "" },
    maxParticipants: { type: Number, default: 50 },
    thumbnail: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

const LiveSession = mongoose.model("LiveSession", liveSessionSchema);
export default LiveSession;
