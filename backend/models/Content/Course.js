import mongoose from "mongoose";
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    previewImage: { type: String }, // Stores filename or URL
    price: { type: Number, required: true }, // 💰 Add course price
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
