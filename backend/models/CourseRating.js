import mongoose from "mongoose";

const courseRatingSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Student", 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  review: { 
    type: String, 
    default: "" 
  },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Employee" 
  },
  approvedAt: { 
    type: Date 
  },
  rejectedReason: { 
    type: String, 
    default: "" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for efficient queries
courseRatingSchema.index({ courseId: 1, status: 1 });
courseRatingSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

// Update the updatedAt field before saving
courseRatingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const CourseRating = mongoose.model("CourseRating", courseRatingSchema);
export default CourseRating;
