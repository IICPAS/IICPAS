"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Card,
  CardContent,
  Divider,
  Collapse,
} from "@mui/material";
import {
  PlayArrow,
  Visibility,
  Edit,
  Book,
  Assignment,
  Science,
  QuestionAnswer,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

const CourseDisplayTab = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("chapters");
  const [expandedFaqs, setExpandedFaqs] = useState({});

  // Mock data for demonstration
  const showDemoData = () => {
    const demoCourses = [
      {
        _id: "1",
        title: "Advanced Accounting Course",
        description:
          "Comprehensive accounting course covering all aspects of modern accounting practices.",
        image: "/images/a1.jpeg",
        status: "active",
        level: "Advanced",
        overallProgress: 75,
        totalChapters: 8,
        totalAssignments: 12,
        totalExperiments: 6,
        totalFaqs: 15,
        chapters: [
          { id: 1, name: "Introduction", completion: 100 },
          { id: 2, name: "Basic Concepts", completion: 85 },
          { id: 3, name: "Advanced Topics", completion: 70 },
          { id: 4, name: "Practical Applications", completion: 60 },
          { id: 5, name: "Case Studies", completion: 45 },
          { id: 6, name: "Final Project", completion: 30 },
          { id: 7, name: "Review", completion: 20 },
          { id: 8, name: "Assessment", completion: 10 },
        ],
        assignments: [
          { id: 1, name: "Assignment 1: Basic Principles" },
          { id: 2, name: "Assignment 2: Advanced Concepts" },
          { id: 3, name: "Assignment 3: Practical Exercise" },
          { id: 4, name: "Assignment 4: Case Study Analysis" },
          { id: 5, name: "Assignment 5: Final Project" },
        ],
        experiments: [
          { id: 1, name: "Experiment 1: Ledger Creation" },
          { id: 2, name: "Experiment 2: Balance Sheet" },
          { id: 3, name: "Experiment 3: Income Statement" },
          { id: 4, name: "Experiment 4: Cash Flow" },
        ],
        faqs: [
          {
            id: 1,
            question: "What is double-entry bookkeeping?",
            answer:
              "Double-entry bookkeeping is a method of recording financial transactions where every transaction affects at least two accounts. For every debit entry, there must be a corresponding credit entry of equal value. This system ensures that the accounting equation (Assets = Liabilities + Equity) always remains balanced.",
          },
          {
            id: 2,
            question: "How to prepare a balance sheet?",
            answer:
              "A balance sheet is prepared by listing all assets on the left side and all liabilities and equity on the right side. Assets are typically listed in order of liquidity, while liabilities are listed in order of maturity. The total assets must equal the sum of liabilities and equity.",
          },
          {
            id: 3,
            question: "What are the golden rules of accounting?",
            answer:
              "The three golden rules of accounting are: 1) Debit what comes in, Credit what goes out (for Personal accounts), 2) Debit the receiver, Credit the giver (for Personal accounts), 3) Debit all expenses and losses, Credit all incomes and gains (for Nominal accounts).",
          },
          {
            id: 4,
            question: "How to calculate depreciation?",
            answer:
              "Depreciation can be calculated using various methods: Straight-line method (Cost - Salvage Value) / Useful Life, Declining balance method, Units of production method, or Sum-of-years digits method. The most common is the straight-line method which spreads the cost evenly over the asset's useful life.",
          },
        ],
      },
    ];
    setCourses(demoCourses);
    setSelectedCourse(demoCourses[0]);
    setLoading(false);
  };

  useEffect(() => {
    showDemoData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFaqToggle = (faqId) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [faqId]: !prev[faqId],
    }));
  };

  const getTabIcon = (tabName) => {
    switch (tabName) {
      case "chapters":
        return <Book />;
      case "assignments":
        return <Assignment />;
      case "experiments":
        return <Science />;
      case "faqs":
        return <QuestionAnswer />;
      default:
        return <Book />;
    }
  };

  const getTabLabel = (tabName) => {
    switch (tabName) {
      case "chapters":
        return "Chapters";
      case "assignments":
        return "Assignment";
      case "experiments":
        return "Experiment";
      case "faqs":
        return "FAQs";
      default:
        return "Chapters";
    }
  };

  const renderContentList = () => {
    if (!selectedCourse) return null;

    switch (activeTab) {
      case "chapters":
        return (
          <Box className="space-y-3">
            {selectedCourse.chapters.map((chapter) => (
              <Box
                key={chapter.id}
                className="bg-gradient-to-r from-gray-100 to-gray-150 border border-gray-300 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <Box className="flex items-center justify-between">
                  <Box className="flex items-center gap-3">
                    <Box className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Typography
                        variant="h6"
                        className="font-bold text-blue-600"
                      >
                        {chapter.id}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        className="font-semibold text-gray-800"
                      >
                        {chapter.name}
                      </Typography>
                      <Typography variant="caption" className="text-gray-600">
                        Chapter {chapter.id}
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <Box className="w-24 bg-gray-200 rounded-full h-2">
                      <Box
                        className={`h-2 rounded-full transition-all duration-300 ${
                          chapter.completion === 100
                            ? "bg-green-500"
                            : chapter.completion >= 70
                            ? "bg-blue-500"
                            : chapter.completion >= 40
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                        }`}
                        sx={{ width: `${chapter.completion}%` }}
                      />
                    </Box>
                    <Chip
                      label={`${chapter.completion}%`}
                      color={chapter.completion === 100 ? "success" : "primary"}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        );
      case "assignments":
        return (
          <Box className="space-y-3">
            {selectedCourse.assignments.map((assignment) => (
              <Box
                key={assignment.id}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <Box className="flex items-center gap-3">
                  <Box className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Assignment className="text-green-600" />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      className="font-semibold text-gray-800"
                    >
                      {assignment.name}
                    </Typography>
                    <Typography variant="caption" className="text-gray-600">
                      Assignment {assignment.id}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        );
      case "experiments":
        return (
          <Box className="space-y-3">
            {selectedCourse.experiments.map((experiment) => (
              <Box
                key={experiment.id}
                className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <Box className="flex items-center gap-3">
                  <Box className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Science className="text-purple-600" />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      className="font-semibold text-gray-800"
                    >
                      {experiment.name}
                    </Typography>
                    <Typography variant="caption" className="text-gray-600">
                      Experiment {experiment.id}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        );
      case "faqs":
        return (
          <Box className="space-y-3">
            {selectedCourse.faqs.map((faq) => (
              <Box
                key={faq.id}
                className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg hover:shadow-md transition-all duration-200"
              >
                <Box
                  className="flex items-center gap-3 p-4 cursor-pointer"
                  onClick={() => handleFaqToggle(faq.id)}
                >
                  <Box className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <QuestionAnswer className="text-orange-600" />
                  </Box>
                  <Box className="flex-1">
                    <Typography
                      variant="body2"
                      className="font-semibold text-gray-800"
                    >
                      {faq.question}
                    </Typography>
                    <Typography variant="caption" className="text-gray-600">
                      Frequently Asked Question
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    className="text-orange-600 hover:bg-orange-100"
                  >
                    {expandedFaqs[faq.id] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                <Collapse in={expandedFaqs[faq.id]}>
                  <Box className="px-4 pb-4">
                    <Box className="bg-white rounded-lg p-4 border border-orange-200">
                      <Typography
                        variant="body2"
                        className="text-gray-700 leading-relaxed"
                      >
                        {faq.answer}
                      </Typography>
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            ))}
          </Box>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box className="p-6">
        <Typography>Loading courses...</Typography>
      </Box>
    );
  }

  return (
    <Box className="p-4" sx={{ width: "100vw", maxWidth: "100%" }}>
      <Box className="flex gap-4" sx={{ width: "100%", minHeight: "80vh" }}>
        {/* Left Sidebar */}
        <Box className="flex-1" sx={{ minWidth: "250px", maxWidth: "25%" }}>
          <Paper className="p-6 h-full">
            {/* Course Image */}
            <Box className="flex justify-center mb-6">
              <Avatar
                src={selectedCourse?.image}
                alt={selectedCourse?.title}
                sx={{ width: 140, height: 140 }}
                className="rounded-lg"
              />
            </Box>

            {/* Course Stats */}
            <Typography variant="h6" className="mb-6 font-bold text-center">
              Course Statistics
            </Typography>

            <Box className="space-y-6">
              <Box className="bg-green-50 p-4 rounded-lg mt-4">
                <Box className="flex justify-between items-center mb-2">
                  <Typography variant="body1" className="font-semibold">
                    Overall Progress
                  </Typography>
                  <Typography variant="body1" className="font-bold text--600">
                    {selectedCourse?.overallProgress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={selectedCourse?.overallProgress || 0}
                  sx={{ height: 12, borderRadius: 6 }}
                />
              </Box>

              <Box className="space-y-4">
                <Box className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <Typography variant="body2" className="font-medium">
                    Course: {selectedCourse?.title}
                  </Typography>
                </Box>
                <Box className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <Typography variant="body2" className="font-medium">
                    Chapters
                  </Typography>
                  <Typography
                    variant="body1"
                    className="font-bold text-blue-600"
                  >
                    {selectedCourse?.totalChapters}
                  </Typography>
                </Box>
                <Box className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <Typography variant="body2" className="font-medium">
                    Assignments
                  </Typography>
                  <Typography
                    variant="body1"
                    className="font-bold text-green-600"
                  >
                    {selectedCourse?.totalAssignments}
                  </Typography>
                </Box>
                <Box className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <Typography variant="body2" className="font-medium">
                    Experiments
                  </Typography>
                  <Typography
                    variant="body1"
                    className="font-bold text-purple-600"
                  >
                    {selectedCourse?.totalExperiments}
                  </Typography>
                </Box>
                <Box className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <Typography variant="body2" className="font-medium">
                    FAQs
                  </Typography>
                  <Typography
                    variant="body1"
                    className="font-bold text-orange-600"
                  >
                    {selectedCourse?.totalFaqs}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Main Content Area */}
        <Box className="flex-1" sx={{ minWidth: "700px", maxWidth: "75%" }}>
          <Paper className="p-6 h-full">
            {/* Top Navigation Tabs */}
            <Box className="mb-6">
              <Box className="flex gap-2 bg-gray-300 p-2 rounded-lg">
                {["chapters", "assignments", "experiments", "faqs"].map(
                  (tab) => (
                    <Box
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        activeTab === tab
                          ? "bg-gray-800 shadow-md text-white font-semibold"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                      }`}
                      sx={{
                        minWidth: "120px",
                        justifyContent: "center",
                        border:
                          activeTab === tab
                            ? "2px solid #1f2937"
                            : "2px solid transparent",
                      }}
                    >
                      {getTabIcon(tab)}
                      <Typography
                        variant="body1"
                        className={`font-medium ${
                          activeTab === tab ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {getTabLabel(tab)}
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            </Box>

            {/* Content Section */}
            <Box className="w-full h-full">
              {/* Content List - Full Height */}
              <Box
                className="bg-white border-2 border-gray-200 rounded-lg shadow-sm"
                sx={{
                  height: "calc(100vh - 300px)",
                  minHeight: "500px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  className="flex-1 overflow-y-auto p-6 custom-scrollbar"
                  sx={{
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#dbeafe",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      borderRadius: "4px",
                      "&:hover": {
                        background: "#94a3b8",
                      },
                    },
                  }}
                >
                  {renderContentList()}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseDisplayTab;
