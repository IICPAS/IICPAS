import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
  questions: [
    {
      question: String,
      options: [String],
      correctIndex: Number,
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
