"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Modal,
  IconButton,
  Chip,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TimerIcon from "@mui/icons-material/Timer";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

export default function RevisionTab() {
  const [revisionTests, setRevisionTests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [totalMarks, setTotalMarks] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchRevisionTests();
  }, []);

  useEffect(() => {
    let timer;
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
        const courseMap = {};
        tests.forEach((test) => {
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

  const startQuiz = (test) => {
    setCurrentTest(test);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(test.timeLimit * 60); // Convert minutes to seconds
    setQuizStarted(true);
    setShowResults(false);
    setTotalMarks(0);
    setQuizModalOpen(true);
  };

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    if (selectedAnswers[questionIndex] !== undefined) return; // Already answered

    const question = currentTest.questions[questionIndex];
    const isCorrect = selectedOption === question.correctAnswer;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));

    if (isCorrect) {
      setTotalMarks((prev) => prev + 10);
      Swal.fire({
        title: "+10 Marks!",
        text: "Correct answer!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } else {
      // Show correct answer in green
      setTimeout(() => {
        Swal.fire({
          title: "Incorrect!",
          text: `Correct answer: ${question.correctAnswer}`,
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      }, 500);
    }
  };

  const handleSubmitQuiz = () => {
    setQuizStarted(false);
    setShowResults(true);

    const totalQuestions = currentTest.questions.length;
    const answeredQuestions = Object.keys(selectedAnswers).length;
    const correctAnswers = Object.values(selectedAnswers).filter(
      (answer, index) => answer === currentTest.questions[index].correctAnswer
    ).length;

    const finalMarks = correctAnswers * 10;
    const percentage = (correctAnswers / totalQuestions) * 100;

    Swal.fire({
      title: "Quiz Completed!",
      html: `
        <div style="text-align: center;">
          <h3>Your Score: ${finalMarks} marks</h3>
          <p>Correct Answers: ${correctAnswers}/${totalQuestions}</p>
          <p>Percentage: ${percentage.toFixed(1)}%</p>
          <p>Time Taken: ${Math.floor(
            (currentTest.timeLimit * 60 - timeLeft) / 60
          )}:${String((currentTest.timeLimit * 60 - timeLeft) % 60).padStart(
        2,
        "0"
      )}</p>
        </div>
      `,
      icon: percentage >= 70 ? "success" : "info",
      confirmButtonText: "Close",
    });
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getLevelColor = (level, difficulty) => {
    // Base colors for levels
    const baseColors = {
      "Level 1": "#ef4444", // red
      "Level 2": "#f97316", // orange
      "Pro": "#8b5cf6", // purple (most advanced)
    };
    
    const baseColor = baseColors[level] || "#6b7280";
    
    // Adjust color based on difficulty
    if (difficulty === "Hard") {
      // Make color darker for hard difficulty
      return darkenColor(baseColor, 0.2);
    } else if (difficulty === "Hardest") {
      // Make color even darker for hardest difficulty
      return darkenColor(baseColor, 0.4);
    }
    
    return baseColor;
  };

  const darkenColor = (color, amount) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * amount * 100);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const getDifficultyLabel = (level, difficulty) => {
    const difficultyLabels = {
      "Level 1": { "Normal": "Normal", "Hard": "Hard", "Hardest": "Hardest" },
      "Level 2": { "Normal": "Normal", "Hard": "Hard", "Hardest": "Hardest" },
      "Pro": { "Normal": "Normal", "Hard": "Hard", "Hardest": "Hardest" }
    };
    
    return difficultyLabels[level]?.[difficulty] || difficulty || "Normal";
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case "Level 1":
        return "1";
      case "Level 2":
        return "2";
      case "Pro":
        return "P";
      default:
        return "?";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <Typography variant="h4" component="h1" gutterBottom>
          Prepare
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose a topic and take tests. Measure your skills and get detailed
          information on improving your skills.
        </Typography>
      </div>

      {/* Soft Skills Banner */}
      <Card sx={{ mb: 6, bgcolor: "#3b82f6", color: "white" }}>
        <CardContent className="flex justify-between items-center">
          <div>
            <Typography variant="h6" gutterBottom>
              Upgrade your Soft Skills!
            </Typography>
            <Typography variant="body2">
              Watch our Videos on Skill Development!
            </Typography>
          </div>
          <IconButton sx={{ color: "white" }}>
            <PlayArrowIcon />
          </IconButton>
        </CardContent>
      </Card>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course._id} sx={{ border: "1px solid #e5e7eb" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {course.title}
              </Typography>

              {/* Level Badges */}
              <div className="flex flex-wrap gap-3 mt-4">
                {["Level 1", "Level 2", "Pro"].map((level) => {
                  const test = course.tests.find((t) => t.level === level);
                  const isCompleted = false; // TODO: Add completion tracking
                  const difficulty = test?.difficulty || "Normal";

                  return (
                    <div
                      key={level}
                      className="flex flex-col items-center cursor-pointer relative"
                      onClick={() => test && startQuiz(test)}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{
                          backgroundColor: getLevelColor(level, difficulty),
                          opacity: test ? 1 : 0.5,
                        }}
                      >
                        {getLevelIcon(level)}
                      </div>
                      <Typography variant="caption" className="mt-1 text-center">
                        {level}
                      </Typography>
                      <Typography variant="caption" className="text-xs text-gray-600 text-center">
                        {getDifficultyLabel(level, difficulty)}
                      </Typography>
                      {isCompleted && (
                        <CheckCircleIcon
                          sx={{
                            fontSize: 16,
                            color: "green",
                            position: "absolute",
                            top: -5,
                            right: -5,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quiz Modal */}
      <Modal open={quizModalOpen} onClose={closeQuiz}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 800,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          {currentTest && (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <Typography variant="h5">{currentTest.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Level: {currentTest.level} • Difficulty: {currentTest.difficulty || "Normal"}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  {quizStarted && !showResults && (
                    <Chip
                      icon={<TimerIcon />}
                      label={`Time: ${formatTime(timeLeft)}`}
                      color="primary"
                    />
                  )}
                  <IconButton onClick={closeQuiz}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>

              {!showResults ? (
                /* Quiz Questions */
                <div>
                  {currentTest.questions[currentQuestionIndex] && (
                    <div className="mb-6">
                      <Typography variant="h6" gutterBottom>
                        Question {currentQuestionIndex + 1} of{" "}
                        {currentTest.questions.length}
                      </Typography>

                      <Typography variant="body1" className="mb-4">
                        {currentTest.questions[currentQuestionIndex].question}
                      </Typography>

                      <div className="space-y-3">
                        {currentTest.questions[
                          currentQuestionIndex
                        ].options.map((option, optionIndex) => {
                          const optionLetter = String.fromCharCode(
                            65 + optionIndex
                          );
                          const isSelected =
                            selectedAnswers[currentQuestionIndex] === option;
                          const isCorrect =
                            option ===
                            currentTest.questions[currentQuestionIndex]
                              .correctAnswer;
                          const isWrong = isSelected && !isCorrect;

                          return (
                            <div
                              key={optionIndex}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                isSelected
                                  ? isCorrect
                                    ? "border-green-500 bg-green-50"
                                    : "border-red-500 bg-red-50"
                                  : isCorrect &&
                                    selectedAnswers[currentQuestionIndex] !==
                                      undefined
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-300 hover:border-blue-400"
                              }`}
                              onClick={() =>
                                handleAnswerSelect(currentQuestionIndex, option)
                              }
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="font-bold">
                                    {optionLetter}.
                                  </span>
                                  <span>{option}</span>
                                </div>
                                {isSelected && (
                                  <div>
                                    {isCorrect ? (
                                      <CheckCircleIcon
                                        sx={{ color: "green" }}
                                      />
                                    ) : (
                                      <CancelIcon sx={{ color: "red" }} />
                                    )}
                                  </div>
                                )}
                                {!isSelected &&
                                  isCorrect &&
                                  selectedAnswers[currentQuestionIndex] !==
                                    undefined && (
                                    <CheckCircleIcon sx={{ color: "green" }} />
                                  )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outlined"
                      disabled={currentQuestionIndex === 0}
                      onClick={() =>
                        setCurrentQuestionIndex((prev) => prev - 1)
                      }
                    >
                      Previous
                    </Button>

                    <Typography variant="body2">Marks: {totalMarks}</Typography>

                    {currentQuestionIndex ===
                    currentTest.questions.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={handleSubmitQuiz}
                        sx={{ bgcolor: "#0f265c" }}
                      >
                        Submit Quiz
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() =>
                          setCurrentQuestionIndex((prev) => prev + 1)
                        }
                        sx={{ bgcolor: "#0f265c" }}
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                /* Results */
                <div className="text-center">
                  <Typography variant="h4" gutterBottom>
                    Quiz Completed!
                  </Typography>
                  <Typography variant="h5" color="primary" gutterBottom>
                    Total Marks: {totalMarks}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Correct Answers:{" "}
                    {
                      Object.values(selectedAnswers).filter(
                        (answer, index) =>
                          answer === currentTest.questions[index].correctAnswer
                      ).length
                    }
                    /{currentTest.questions.length}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={closeQuiz}
                    sx={{ bgcolor: "#0f265c", mt: 2 }}
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
  );
}
