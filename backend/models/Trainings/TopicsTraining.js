import mongoose from "mongoose";

const TopicsTrainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, // Keep for backward compatibility
  pricePerHour: { type: Number, required: true }, // New hourly pricing field
  status: {
    type: String,
    enum: ["active", "inactive"],
    required: true,
    default: "active",
  },
});

// Prevent OverwriteModelError
const Topics_Trainings =
  mongoose.models.TopicsTraining ||
  mongoose.model("TopicsTrainings", TopicsTrainingSchema);

export default Topics_Trainings;
