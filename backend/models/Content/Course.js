import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CourseSchema = new Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String },
  price: { type: Number, required: true },
  image: { type: String }, // Image URL or path
  level: { 
    type: String, 
    enum: ["Executive Level", "Professional Level"] 
  },
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

  // Meta tags for additional SEO
  metaTitle: { type: String },
  metaKeywords: { type: String },
  metaDescription: { type: String },

  chapters: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],
  
  // Dynamic pricing and UI configuration
  pricing: {
    recordedSession: {
      title: { type: String, default: "DIGITAL HUB+RECORDED SESSION" },
      buttonText: { type: String, default: "Add Digital Hub" }
    },
    liveSession: {
      title: { type: String, default: "DIGITAL HUB+LIVE SESSION" },
      buttonText: { type: String, default: "Add Digital Hub+" },
      priceMultiplier: { type: Number, default: 1.5 }
    }
  },
  
  // Dynamic tab configuration
  tabs: {
    syllabus: { label: { type: String, default: "Syllabus" } },
    assignment: { label: { type: String, default: "Assignment" } },
    assessment: { label: { type: String, default: "Assessment & Certificates" } },
    schedule: { label: { type: String, default: "Live Schedule +" } },
    simulator: { label: { type: String, default: "Simulator" } }
  },
  
  // Rating fields
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Course = model("Course", CourseSchema);
export default Course;
