import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  message: { type: String, required: true },
  image: { type: String, default: "" }, // Store image path/URL
  rating: { type: Number, min: 1, max: 5, default: 5 }, // Star rating from 1 to 5
  status: { type: Boolean, default: false }, // false = pending, true = approved
  featured: { type: Boolean, default: false }, // For featured testimonials
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }, // Reference to student
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Testimonials = mongoose.model("Testimonial", testimonialSchema);
export default Testimonials;
