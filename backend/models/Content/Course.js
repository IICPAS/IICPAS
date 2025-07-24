import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CourseSchema = new Schema({
  category: { type: String, required: true }, // e.g., "Mathematics"
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // Store image URL or path
  level: { type: String }, // e.g., "Beginner", "Intermediate", "Advanced"
  discount: { type: Number, default: 0 }, // Discount amount or percent
  status: { type: String, default: "active" }, // e.g., "active" or "inactive"
  description: { type: String }, // Plain text
  chapters: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Course = model("Course", CourseSchema);
export default Course;
