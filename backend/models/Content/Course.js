import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CourseSchema = new Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String },
  price: { type: Number, required: true },
  image: { type: String }, // Image URL or path
  level: { type: String }, // Foundation, Core, Expert
  discount: { type: Number, default: 0 },
  status: { type: String, default: "Active", enum: ["Active", "Inactive"] },

  // --- Added fields to match your form ---
  video: { type: String }, // Video URL or ID
  description: { type: String }, // HTML from ReactQuill
  examCert: { type: String }, // HTML from ReactQuill
  caseStudy: { type: String }, // HTML from ReactQuill

  seoTitle: { type: String },
  seoKeywords: { type: String }, // Store as comma-separated or array (if needed)
  seoDescription: { type: String }, // HTML from ReactQuill

  chapters: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Course = model("Course", CourseSchema);
export default Course;
