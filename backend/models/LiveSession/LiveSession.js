import mongoose from "mongoose";

const liveSessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    instructor: { type: String, default: "" },
    instructorBio: { type: String, default: "" },
    description: { type: String, default: "" },
    time: { type: String, required: true },
    date: { type: Date, required: true },
    link: { type: String, required: true },
    price: { type: Number, default: 0 },
    category: { type: String, default: "" },
    maxParticipants: { type: Number, default: 50 },
    enrolledCount: { type: Number, default: 0 },
    thumbnail: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    status: { 
      type: String, 
      enum: ["upcoming", "live", "completed", "active", "inactive"], 
      default: "upcoming" 
    },
    duration: { type: Number, default: 120 }, // in minutes
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

const LiveSession = mongoose.model("LiveSession", liveSessionSchema);
export default LiveSession;
