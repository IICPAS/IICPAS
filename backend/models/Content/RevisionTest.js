import mongoose from "mongoose";
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], // [A, B, C, D]
  correctAnswer: { type: String, required: true },
  explanation: { type: String, default: "" },
});

const RevisionTestSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  level: { type: String, required: true }, // "Level 1", "Level 2", "Pro"
  title: { type: String, required: true },
  timeLimit: { type: Number, required: true }, // in minutes
  questions: [QuestionSchema],
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  totalQuestions: { type: Number, default: 0 },
  passingScore: { type: Number, default: 70 }, // percentage
  difficulty: { 
    type: String, 
    enum: ["Normal", "Hard", "Hardest"], 
    default: "Normal" 
  }, // Difficulty level for the assessment
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("RevisionTest", RevisionTestSchema);
