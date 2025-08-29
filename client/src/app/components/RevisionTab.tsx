"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
  CircularProgress,
} from "@mui/material";
import { FaPlay, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface RevisionTest {
  _id: string;
  course: {
    _id: string;
    title: string;
    category: string;
    level: string;
  };
  level: string;
  title: string;
  timeLimit: number;
  questions: Question[];
  status: string;
  totalQuestions: number;
}

interface Course {
  _id: string;
  title: string;
  category: string;
  level: string;
  tests: RevisionTest[];
}

export default function RevisionTab() {
  const [revisionTests, setRevisionTests] = useState<RevisionTest[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<RevisionTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [totalMarks, setTotalMarks] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchRevisionTests();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  const fetchRevisionTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/revision-tests`);
      if (response.data.success) {
        const tests = response.data.data;
        setRevisionTests(tests);

        // Group tests by course
        const courseMap: { [key: string]: Course } = {};
        tests.forEach((test: RevisionTest) => {
          if (!courseMap[test.course._id]) {
            courseMap[test.course._id] = {
              _id: test.course._id,
              title: test.course.title || `Course ${test.course._id.slice(-4)}`, // Fallback if title is missing
              category: test.course.category || "General",
              level: test.course.level || "Foundation",
              tests: [],
            };
          }
          courseMap[test.course._id].tests.push(test);
        });
        setCourses(Object.values(courseMap));
      }
    } catch (error) {
      console.error("Error fetching revision tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (test: RevisionTest) => {
    setCurrentTest(test);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(test.timeLimit * 60); // Convert minutes to seconds
    setQuizStarted(true);
    setShowResults(false);
    setTotalMarks(0);
    setQuizModalOpen(true);
  };

  const handleAnswerSelect = (
    questionIndex: number,
    selectedOption: string
  ) => {
    const question = currentTest!.questions[questionIndex];
    const isCorrect = selectedOption === question.correctAnswer;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));

    if (isCorrect) {
      setTotalMarks((prev) => prev + 10);
    }
    // No immediate feedback - results will be shown at the end
  };

  const handleSubmitQuiz = () => {
    setQuizStarted(false);
    setShowResults(true);

    // Calculate score based on correct answers
    let calculatedScore = 0;
    currentTest!.questions.forEach((question, index) => {
      const selectedAnswer = selectedAnswers[index];
      if (selectedAnswer && selectedAnswer === question.correctAnswer) {
        calculatedScore += 10;
      }
    });

    const totalPossibleMarks = currentTest!.questions.length * 10;
    const percentage = Math.round((calculatedScore / totalPossibleMarks) * 100);

    // Close the quiz modal first to avoid z-index issues
    setQuizModalOpen(false);

    // Show result after a small delay to ensure modal is closed
    setTimeout(() => {
      Swal.fire({
        title: "Quiz Completed!",
        html: `
          <div>
            <div style="font-size: 48px; color: #10B981; margin-bottom: 16px;">✓</div>
            <h3>Your Score: ${calculatedScore}/${totalPossibleMarks}</h3>
            <p>Percentage: ${percentage}%</p>
            <p>${
              percentage >= 70
                ? "🎉 Congratulations! You passed!"
                : "Keep practicing to improve!"
            }</p>
          </div>
        `,
        icon: undefined,
        confirmButtonText: "Close",
        customClass: {
          popup: "swal2-popup-high-z-index",
        },
      });
    }, 100);
  };

  const closeQuiz = () => {
    setQuizModalOpen(false);
    setCurrentTest(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(0);
    setQuizStarted(false);
    setShowResults(false);
    setTotalMarks(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Level 1":
        return "bg-red-500";
      case "Level 2":
        return "bg-orange-500";
      case "Level 3":
        return "bg-green-500";
      case "Pro":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getLevelText = (level: string) => {
    return level; // Return the full level text like "Level 1", "Level 2", etc.
  };

  const getLevelIcon = (level: string) => {
    return level === "Pro" ? "✓" : level.split(" ")[1];
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen px-6 py-12 text-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          {/* Header CTA */}
          <div className="bg-blue-100 border border-blue-400 rounded-xl p-6 shadow-md mb-10">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              Upgrade your Soft Skills!
            </h2>
            <div className="flex items-center justify-center space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-blue-700 transition-all">
                <FaPlay className="text-sm" />
                <span>Watch our Videos on Skill Development</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6 text-lg">
            Choose a topic and take tests. <em>Measure</em> your skills and get
            detailed information on improving your skills.
          </p>

          {/* Loading Spinner */}
          <div className="flex justify-center mt-10">
            <CircularProgress size={40} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen px-6 py-12 text-gray-800">
      <style jsx>{`
        .swal2-popup-high-z-index {
          z-index: 9999 !important;
        }
      `}</style>
      <div className="max-w-6xl mx-auto">
        {/* Header CTA */}
        <div className="bg-blue-100 border border-blue-400 rounded-xl p-6 shadow-md mb-10">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            Upgrade your Soft Skills!
          </h2>
          <div className="flex items-center justify-center space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-blue-700 transition-all">
              <FaPlay className="text-sm" />
              <span>Watch our Videos on Skill Development</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-8 text-lg text-center">
          Choose a topic and take tests. <em>Measure</em> your skills and get
          detailed information on improving your skills.
        </p>

        {/* Courses Grid */}
        <div className="space-y-6">
          {courses.map((course) => (
            <Card
              key={course._id}
              className="hover:shadow-lg transition-shadow w-full"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="h5" className="font-semibold">
                    {course.title}
                  </Typography>
                  <div className="text-sm text-gray-600">
                    <span className="mr-4">Category: {course.category}</span>
                    <span className="mr-4">Level: {course.level}</span>
                    <span>Tests Available: {course.tests.length}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {course.tests.map((test) => (
                    <button
                      key={test._id}
                      onClick={() => startQuiz(test)}
                      className={`${getLevelColor(
                        test.level
                      )} text-white px-3 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition-opacity flex items-center gap-2 min-w-[100px] justify-center`}
                    >
                      <span className="text-base">
                        {getLevelIcon(test.level)}
                      </span>
                      <span>{test.level}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quiz Modal */}
        <Modal open={quizModalOpen} onClose={closeQuiz}>
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            {currentTest && (
              <>
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-6">
                  <div>
                    <Typography
                      variant="h4"
                      component="h2"
                      className="font-bold text-gray-800 mb-2"
                    >
                      {currentTest.title}
                    </Typography>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-200">
                        <FaClock className="text-red-500 text-lg" />
                        <span className="font-semibold text-red-600 text-lg">
                          {formatTime(timeLeft)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                        Question {currentQuestionIndex + 1} of{" "}
                        {currentTest.questions.length}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeQuiz}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 rounded-full transition-all duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {currentQuestionIndex < currentTest.questions.length ? (
                  <div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8 border border-blue-100 shadow-sm">
                      <Typography
                        variant="h5"
                        className="text-gray-800 font-semibold mb-4 leading-relaxed"
                      >
                        {currentTest.questions[currentQuestionIndex].question}
                      </Typography>
                    </div>

                    <FormControl component="fieldset" className="w-full">
                      <RadioGroup
                        value={selectedAnswers[currentQuestionIndex] || ""}
                        onChange={(e) =>
                          handleAnswerSelect(
                            currentQuestionIndex,
                            e.target.value
                          )
                        }
                      >
                        {currentTest.questions[
                          currentQuestionIndex
                        ].options.map((option, index) => (
                          <FormControlLabel
                            key={index}
                            value={option}
                            control={<Radio />}
                            label={option}
                            className={`p-5 rounded-xl border-2 transition-all duration-200 mb-4 cursor-pointer ${
                              selectedAnswers[currentQuestionIndex] === option
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>

                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                      <Button
                        variant="outlined"
                        onClick={() =>
                          setCurrentQuestionIndex(
                            Math.max(0, currentQuestionIndex - 1)
                          )
                        }
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-3 rounded-lg font-semibold"
                      >
                        ← Previous
                      </Button>

                      <div className="flex gap-3">
                        <Button
                          variant="contained"
                          onClick={() =>
                            setCurrentQuestionIndex(
                              Math.min(
                                currentTest.questions.length - 1,
                                currentQuestionIndex + 1
                              )
                            )
                          }
                          disabled={
                            currentQuestionIndex ===
                            currentTest.questions.length - 1
                          }
                          className="px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700"
                        >
                          Next →
                        </Button>

                        {currentQuestionIndex ===
                          currentTest.questions.length - 1 && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitQuiz}
                            className="px-8 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700"
                          >
                            Submit Quiz
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Typography variant="h6" gutterBottom>
                      Quiz Completed!
                    </Typography>
                    <Typography variant="body1">
                      Total Marks: {totalMarks}/
                      {currentTest.questions.length * 10}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={closeQuiz}
                      className="mt-4"
                    >
                      Close
                    </Button>
                  </div>
                )}
              </>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
}
