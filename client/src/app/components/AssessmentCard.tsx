"use client";
import React, { useState } from "react";
import { CheckCircle, XCircle, Clock, Award } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  type: string;
}

interface AssessmentCardProps {
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore?: number; // percentage
  onComplete?: (score: number, isPassed: boolean) => void;
}

export default function AssessmentCard({
  title,
  description,
  questions,
  timeLimit = 30,
  passingScore = 60,
  onComplete,
}: AssessmentCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // Convert to seconds
  const [isStarted, setIsStarted] = useState(false);

  // Timer effect
  React.useEffect(() => {
    if (!isStarted || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowResults(true);

    // Calculate score
    const correctAnswers = questions.filter(
      (q) => selectedAnswers[q.id] === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const isPassed = score >= passingScore;

    onComplete?.(score, isPassed);
  };

  const startAssessment = () => {
    setIsStarted(true);
  };

  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setShowResults(false);
    setTimeRemaining(timeLimit * 60);
    setIsStarted(false);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!isStarted) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
        <div className="text-center">
          <Award className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center">
                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                <span>Time Limit: {timeLimit} minutes</span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-gray-500 mr-2" />
                <span>Questions: {questions.length}</span>
              </div>
              <div className="flex items-center justify-center">
                <Award className="w-4 h-4 text-gray-500 mr-2" />
                <span>Passing Score: {passingScore}%</span>
              </div>
            </div>
          </div>

          <button
            onClick={startAssessment}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold text-lg"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = questions.filter(
      (q) => selectedAnswers[q.id] === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const isPassed = score >= passingScore;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
        <div className="text-center">
          {isPassed ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )}

          <h3 className="text-2xl font-bold mb-2">
            {isPassed ? "Congratulations!" : "Assessment Complete"}
          </h3>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold mb-2">{score}%</div>
            <p className="text-gray-600">
              You scored {correctAnswers} out of {questions.length} questions
              correctly
            </p>
            <p
              className={`font-semibold ${
                isPassed ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPassed ? "You passed!" : `You need ${passingScore}% to pass`}
            </p>
          </div>

          {/* Question Review */}
          <div className="text-left">
            <h4 className="text-lg font-semibold mb-4">Question Review:</h4>
            {questions.map((question, index) => {
              const isCorrect =
                selectedAnswers[question.id] === question.correctAnswer;
              return (
                <div key={question.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex items-start mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">
                        Question {index + 1}: {question.question}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Your answer:{" "}
                        <span
                          className={
                            isCorrect ? "text-green-600" : "text-red-600"
                          }
                        >
                          {selectedAnswers[question.id] || "Not answered"}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 mt-1">
                          Correct answer: {question.correctAnswer}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-2 italic">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={resetAssessment}
            className="mt-6 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-xs text-gray-500">Time Remaining</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-800 mb-4">
          {currentQuestion.question}
        </h4>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedAnswers[currentQuestion.id] === option
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={selectedAnswers[currentQuestion.id] === option}
                onChange={(e) =>
                  handleAnswerSelect(currentQuestion.id, e.target.value)
                }
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium ${
                index === currentQuestionIndex
                  ? "bg-blue-500 text-white"
                  : selectedAnswers[questions[index].id]
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
