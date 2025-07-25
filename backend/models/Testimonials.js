import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: Boolean, default: true },
});

const Testimonials = mongoose.model("Testimonial", testimonialSchema);
export default Testimonials;
