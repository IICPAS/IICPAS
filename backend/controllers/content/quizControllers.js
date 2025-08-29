import Quiz from "../../models/Content/Quiz.js";
import Topic from "../../models/Content/Topic.js";

// Create Quiz (assumes body includes topic and questions)
export const createQuiz = async (req, res) => {
  try {
    console.log(req.body);
    const quiz = new Quiz(req.body);
    await quiz.save();
    // Link quiz to topic
    await Topic.findByIdAndUpdate(req.body.topic, { quiz: quiz._id });
    res.status(201).json({ success: true, quiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ success: false, error: "Failed to create quiz" });
  }
};

// Get full quiz by ID
export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, error: "Quiz not found" });
    res.json({ success: true, quiz });
  } catch (error) {
    console.error("Error getting quiz:", error);
    res.status(500).json({ success: false, error: "Failed to get quiz" });
  }
};

// Get quiz by topic ID
export const getQuizByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const quiz = await Quiz.findOne({ topic: topicId });
    
    if (!quiz) {
      return res.status(404).json({ 
        success: false, 
        error: "Quiz not found for this topic",
        hasQuiz: false 
      });
    }
    
    res.json({ success: true, quiz, hasQuiz: true });
  } catch (error) {
    console.error("Error getting quiz by topic:", error);
    res.status(500).json({ success: false, error: "Failed to get quiz" });
  }
};

// Update quiz
export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: Date.now() }, 
      { new: true }
    );
    if (!quiz) return res.status(404).json({ success: false, error: "Quiz not found" });
    res.json({ success: true, quiz });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ success: false, error: "Failed to update quiz" });
  }
};

// Create or update quiz for a topic
export const createOrUpdateQuizForTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { questions } = req.body;

    // Check if quiz already exists for this topic
    let quiz = await Quiz.findOne({ topic: topicId });

    if (quiz) {
      // Update existing quiz
      quiz.questions = questions;
      quiz.updatedAt = Date.now();
      await quiz.save();
      res.json({ success: true, quiz, message: "Quiz updated successfully" });
    } else {
      // Create new quiz
      quiz = new Quiz({
        topic: topicId,
        questions: questions
      });
      await quiz.save();
      
      // Link quiz to topic
      await Topic.findByIdAndUpdate(topicId, { quiz: quiz._id });
      res.status(201).json({ success: true, quiz, message: "Quiz created successfully" });
    }
  } catch (error) {
    console.error("Error creating/updating quiz:", error);
    res.status(500).json({ success: false, error: "Failed to create/update quiz" });
  }
};

// Delete quiz
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, error: "Quiz not found" });
    // Optionally remove quiz reference from topic
    await Topic.updateMany({ quiz: quiz._id }, { $unset: { quiz: "" } });
    res.json({ success: true, message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ success: false, error: "Failed to delete quiz" });
  }
};

// Get 5 random questions by topic
export const getRandomQuizQuestions = async (req, res) => {
  try {
    const { topicId } = req.query;
    if (!topicId) return res.status(400).json({ success: false, error: "topicId is required" });

    const quiz = await Quiz.findOne({ topic: topicId });
    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found for this topic" });
    }

    const allQuestions = quiz.questions;
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, Math.min(5, allQuestions.length));
    res.json({ success: true, questions: picked });
  } catch (error) {
    console.error("Error getting random questions:", error);
    res.status(500).json({ success: false, error: "Failed to get random questions" });
  }
};

// Get quiz preview (for admin)
export const getQuizPreview = async (req, res) => {
  try {
    const { topicId } = req.params;
    const quiz = await Quiz.findOne({ topic: topicId });
    
    if (!quiz) {
      return res.status(404).json({ 
        success: false, 
        error: "Quiz not found for this topic",
        hasQuiz: false 
      });
    }
    
    // Return quiz data formatted for preview
    const previewData = {
      topicId: quiz.topic,
      totalQuestions: quiz.questions.length,
      questions: quiz.questions.map((q, index) => ({
        questionNumber: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.answer
      }))
    };
    
    res.json({ success: true, preview: previewData, hasQuiz: true });
  } catch (error) {
    console.error("Error getting quiz preview:", error);
    res.status(500).json({ success: false, error: "Failed to get quiz preview" });
  }
};
