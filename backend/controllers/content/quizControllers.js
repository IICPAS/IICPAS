import Quiz from "../../models/Content/Quiz.js";
import Topic from "../../models/Content/Topic.js";

// Create Quiz (assumes body includes topic and questions)
export const createQuiz = async (req, res) => {
  const quiz = new Quiz(req.body);
  await quiz.save();
  // Link quiz to topic
  await Topic.findByIdAndUpdate(req.body.topic, { quiz: quiz._id });
  res.status(201).json(quiz);
};

// Get full quiz by ID
export const getQuiz = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  res.json(quiz);
};

// Update quiz
export const updateQuiz = async (req, res) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  res.json(quiz);
};

// Delete quiz
export const deleteQuiz = async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  // Optionally remove quiz reference from topic
  await Topic.updateMany({ quiz: quiz._id }, { $unset: { quiz: "" } });
  res.json({ message: "Quiz deleted" });
};

// Get 5 random questions by topic
export const getRandomQuizQuestions = async (req, res) => {
  const { topicId } = req.query;
  if (!topicId) return res.status(400).json({ error: "topicId is required" });

  const quiz = await Quiz.findOne({ topic: topicId });
  if (!quiz)
    return res.status(404).json({ error: "Quiz not found for this topic" });

  const allQuestions = quiz.questions;
  const shuffled = allQuestions.sort(() => 0.5 - Math.random());
  const picked = shuffled.slice(0, Math.min(5, allQuestions.length));
  res.json({ questions: picked });
};
