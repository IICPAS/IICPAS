import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CourseSchema = new Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String }, // OPTIONAL: add if you want a URL slug
  price: { type: Number, required: true },
  image: { type: String }, // Store image URL or path
  level: { type: String }, // Foundation, Core, Expert
  discount: { type: Number, default: 0 },
  status: { type: String, default: "Active", enum: ["Active", "Inactive"] },
  description: { type: String },
  chapters: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Course = model("Course", CourseSchema);
export default Course;
