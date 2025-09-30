import mongoose from "mongoose";
const { Schema, model } = mongoose;

const GroupPricingSchema = new Schema({
  level: {
    type: String,
    required: true,
    enum: ["Executive Level", "Professional Level"],
  },
  courseIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  ],
  groupPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  // Dual pricing for recorded and live sessions
  pricing: {
    recordedSession: {
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      finalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      title: {
        type: String,
        default: "DIGITAL HUB RECORDED SESSION",
      },
      buttonText: {
        type: String,
        default: "Add Digital Hub",
      },
    },
    liveSession: {
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      finalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      title: {
        type: String,
        default: "DIGITAL HUB LIVE SESSION",
      },
      buttonText: {
        type: String,
        default: "Add Digital Hub+",
      },
    },
  },
  // Rating will be calculated from included courses
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    default: "Active",
    enum: ["Active", "Inactive"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
GroupPricingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Update the updatedAt field before updating
GroupPricingSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Method to calculate average rating from included courses
GroupPricingSchema.methods.calculateAverageRating = async function () {
  try {
    const CourseRating = mongoose.model("CourseRating");
    const courses = await this.populate("courseIds");

    if (!courses.courseIds || courses.courseIds.length === 0) {
      this.averageRating = 0;
      this.totalRatings = 0;
      return;
    }

    let totalRating = 0;
    let totalRatings = 0;

    for (const course of courses.courseIds) {
      const courseRatings = await CourseRating.find({ courseId: course._id });
      if (courseRatings.length > 0) {
        const courseAvgRating =
          courseRatings.reduce((sum, rating) => sum + rating.rating, 0) /
          courseRatings.length;
        totalRating += courseAvgRating;
        totalRatings += courseRatings.length;
      }
    }

    if (totalRatings > 0) {
      this.averageRating =
        Math.round((totalRating / courses.courseIds.length) * 10) / 10;
      this.totalRatings = totalRatings;
    } else {
      this.averageRating = 0;
      this.totalRatings = 0;
    }
  } catch (error) {
    console.error("Error calculating average rating:", error);
    this.averageRating = 0;
    this.totalRatings = 0;
  }
};

const GroupPricing = model("GroupPricing", GroupPricingSchema);
export default GroupPricing;
