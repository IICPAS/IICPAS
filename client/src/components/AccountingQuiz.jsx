"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw, Trophy, Brain } from "lucide-react";

const AccountingQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Accounting quiz questions pool
  const questionPool = [
    {
      question: "What does GAAP stand for?",
      options: [
        "Generally Accepted Accounting Principles",
        "General Accounting and Auditing Procedures",
        "Government Accounting and Auditing Principles",
        "General Accepted Auditing Procedures",
      ],
      correct: 0,
      explanation:
        "GAAP stands for Generally Accepted Accounting Principles, which are the standard framework of guidelines for financial accounting.",
    },
    {
      question:
        "Which financial statement shows a company's financial position at a specific point in time?",
      options: [
        "Income Statement",
        "Balance Sheet",
        "Cash Flow Statement",
        "Statement of Retained Earnings",
      ],
      correct: 1,
      explanation:
        "The Balance Sheet shows assets, liabilities, and equity at a specific point in time, providing a snapshot of financial position.",
    },
    {
      question: "What is the accounting equation?",
      options: [
        "Assets = Liabilities + Revenue",
        "Assets = Liabilities + Owner's Equity",
        "Revenue = Expenses + Profit",
        "Assets = Revenue - Expenses",
      ],
      correct: 1,
      explanation:
        "The fundamental accounting equation is Assets = Liabilities + Owner's Equity, which must always balance.",
    },
    {
      question:
        "Which accounting method records revenue when earned and expenses when incurred?",
      options: [
        "Cash Basis",
        "Accrual Basis",
        "Modified Cash Basis",
        "Hybrid Basis",
      ],
      correct: 1,
      explanation:
        "Accrual basis accounting records transactions when they occur, regardless of when cash is received or paid.",
    },
    {
      question: "What does GST stand for in Indian accounting?",
      options: [
        "Goods and Services Tax",
        "General Sales Tax",
        "Government Service Tax",
        "Gross Sales Tax",
      ],
      correct: 0,
      explanation:
        "GST stands for Goods and Services Tax, a comprehensive indirect tax levied on the supply of goods and services in India.",
    },
    {
      question: "Which account increases with a debit entry?",
      options: ["Revenue", "Liabilities", "Assets", "Owner's Equity"],
      correct: 2,
      explanation:
        "Assets increase with debit entries. The rule is: Assets and Expenses increase with debits, while Liabilities, Equity, and Revenue increase with credits.",
    },
    {
      question: "What is depreciation?",
      options: [
        "Increase in asset value",
        "Decrease in asset value over time",
        "Cash outflow",
        "Revenue recognition",
      ],
      correct: 1,
      explanation:
        "Depreciation is the systematic allocation of the cost of a tangible asset over its useful life, representing the decrease in value over time.",
    },
    {
      question: "Which financial statement shows cash inflows and outflows?",
      options: [
        "Income Statement",
        "Balance Sheet",
        "Cash Flow Statement",
        "Trial Balance",
      ],
      correct: 2,
      explanation:
        "The Cash Flow Statement shows the movement of cash and cash equivalents in and out of a business during a specific period.",
    },
    {
      question: "What is the purpose of a trial balance?",
      options: [
        "To calculate profit",
        "To verify that debits equal credits",
        "To prepare tax returns",
        "To analyze cash flow",
      ],
      correct: 1,
      explanation:
        "A trial balance is used to verify that the total of all debit balances equals the total of all credit balances in the accounting records.",
    },
    {
      question:
        "Which accounting principle requires expenses to be matched with related revenues?",
      options: [
        "Consistency Principle",
        "Matching Principle",
        "Materiality Principle",
        "Conservatism Principle",
      ],
      correct: 1,
      explanation:
        "The Matching Principle requires that expenses be recorded in the same period as the revenues they help generate.",
    },
  ];

  // Randomly select 5 questions
  useEffect(() => {
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
  }, []);

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setShowResult(true);
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    // Reshuffle questions
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    const getScoreMessage = () => {
      if (percentage >= 80)
        return {
          message: "Excellent!",
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-200",
        };
      if (percentage >= 60)
        return {
          message: "Good Job!",
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-200",
        };
      if (percentage >= 40)
        return {
          message: "Not Bad!",
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          border: "border-yellow-200",
        };
      return {
        message: "Keep Learning!",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
      };
    };

    const scoreInfo = getScoreMessage();

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          </motion.div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Quiz Completed!
          </h3>
          <p className="text-gray-600 mb-6">Test your accounting knowledge</p>

          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${scoreInfo.bg} ${scoreInfo.border} border mb-6`}
          >
            <span className={`text-lg font-semibold ${scoreInfo.color}`}>
              {scoreInfo.message}
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {score}/{questions.length}
            </div>
            <div className="text-sm text-gray-600">
              Correct Answers ({percentage.toFixed(0)}%)
            </div>
          </div>

          <button
            onClick={resetQuiz}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-bold text-gray-900">Accounting Quiz</h3>
        </div>
        <div className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <motion.div
          className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentQuestion + 1) / questions.length) * 100}%`,
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
            {questions[currentQuestion].question}
          </h4>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? showResult
                      ? index === questions[currentQuestion].correct
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-red-500 bg-red-50 text-red-700"
                      : "border-blue-500 bg-blue-50 text-blue-700"
                    : showResult && index === questions[currentQuestion].correct
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                disabled={showResult}
                whileHover={{ scale: showResult ? 1 : 1.02 }}
                whileTap={{ scale: showResult ? 1 : 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? showResult
                          ? index === questions[currentQuestion].correct
                            ? "border-green-500 bg-green-500"
                            : "border-red-500 bg-red-500"
                          : "border-blue-500 bg-blue-500"
                        : showResult &&
                          index === questions[currentQuestion].correct
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {(selectedAnswer === index ||
                      (showResult &&
                        index === questions[currentQuestion].correct)) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        {index === questions[currentQuestion].correct ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <XCircle className="w-4 h-4 text-white" />
                        )}
                      </motion.div>
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Explanation */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
            >
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 text-blue-600 mt-0.5">💡</div>
                <div>
                  <h5 className="font-semibold text-blue-900 mb-1">
                    Explanation:
                  </h5>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    {questions[currentQuestion].explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          <div className="flex justify-end">
            {!showResult ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedAnswer !== null
                    ? "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white hover:shadow-lg hover:-translate-y-1"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {currentQuestion < questions.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AccountingQuiz;
