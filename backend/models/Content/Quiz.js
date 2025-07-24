import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Nested question schema for quiz
const QuestionSchema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], // Array of answer options
  answer: { type: String, required: true }, // Correct answer (can be option value or index)
});

const QuizSchema = new Schema({
  topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
  questions: [QuestionSchema], // Array of questions
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Quiz = model("Quiz", QuizSchema);
export default Quiz;
