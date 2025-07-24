import mongoose from "mongoose";
const CategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const Catgeory = mongoose.model("Category", CategorySchema);

export default Catgeory;
