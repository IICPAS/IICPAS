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

const GroupPricing = model("GroupPricing", GroupPricingSchema);
export default GroupPricing;
