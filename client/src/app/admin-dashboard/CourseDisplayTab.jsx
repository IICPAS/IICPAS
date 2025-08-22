"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Avatar,
  Button,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
  TextField,
  Divider,
  Paper,
} from "@mui/material";
import {
  PlayArrow,
  CheckCircle,
  Circle,
  Visibility,
  Edit,
  Delete,
  School,
  Book,
  Assignment,
  Star,
} from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function CourseDisplayTab() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handler functions for buttons
  const handleContinueLearning = () => {
    if (selectedCourse) {
      // Find the first incomplete chapter or the first chapter if all are complete
      const nextChapter =
        selectedCourse.chapters.find(
          (chapter) => chapter.completionPercentage < 100
        ) || selectedCourse.chapters[0];

      if (nextChapter) {
        Swal.fire({
          title: "Continue Learning",
          text: `Starting ${nextChapter.title} chapter`,
          icon: "info",
          confirmButtonText: "Start Learning",
          showCancelButton: true,
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            // Here you can add navigation logic to the specific chapter
            console.log(`Starting chapter: ${nextChapter.title}`);
            // You can redirect to a learning page or open a modal
          }
        });
      } else {
        Swal.fire({
          title: "Course Complete!",
          text: "Congratulations! You have completed all chapters.",
          icon: "success",
          confirmButtonText: "Great!",
        });
      }
    }
  };

  const handleViewCourse = () => {
    if (selectedCourse) {
      Swal.fire({
        title: "Course Overview",
        html: `
          <div style="text-align: left;">
            <h3>${selectedCourse.title}</h3>
            <p><strong>Status:</strong> ${selectedCourse.status}</p>
            <p><strong>Level:</strong> ${selectedCourse.level}</p>
            <p><strong>Progress:</strong> ${selectedCourse.completionPercentage}%</p>
            <p><strong>Chapters:</strong> ${selectedCourse.chapters.length}</p>
            <p><strong>Topics:</strong> ${selectedCourse.totalTopics}</p>
            <p><strong>Completed:</strong> ${selectedCourse.completedTopics}</p>
          </div>
        `,
        icon: "info",
        confirmButtonText: "Close",
        width: "500px",
      });
    }
  };

  // Chapter action handlers
  const handleViewChapter = (chapter) => {
    Swal.fire({
      title: `Chapter: ${chapter.title}`,
      html: `
        <div style="text-align: left;">
          <p><strong>Description:</strong> ${chapter.description}</p>
          <p><strong>Progress:</strong> ${chapter.completionPercentage}%</p>
          <p><strong>Topics:</strong> ${chapter.completedTopics} of ${chapter.totalTopics} completed</p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Close",
      width: "500px",
    });
  };

  const handleEditChapter = (chapter) => {
    Swal.fire({
      title: "Edit Chapter",
      text: `Edit functionality for ${chapter.title} would be implemented here.`,
      icon: "info",
      confirmButtonText: "OK",
    });
  };

  const handleContinueChapter = (chapter) => {
    Swal.fire({
      title: "Continue Chapter",
      text: `Starting ${chapter.title} chapter`,
      icon: "info",
      confirmButtonText: "Start Learning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`Starting chapter: ${chapter.title}`);
        // Here you can add navigation logic to the specific chapter
      }
    });
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/courses`);

      if (response.data && response.data.length > 0) {
        const coursesWithProgress = await Promise.all(
          response.data.map(async (course) => {
            try {
              // Fetch chapters for this course
              const chaptersResponse = await axios.get(
                `${API_BASE}/chapters/by-course/${course._id}`
              );
              const chapters = chaptersResponse.data;

              // Calculate completion percentage for each chapter
              const chaptersWithProgress = await Promise.all(
                chapters.map(async (chapter) => {
                  try {
                    const topicsResponse = await axios.get(
                      `${API_BASE}/topics/by-chapter/${chapter._id}`
                    );
                    const topics = topicsResponse.data;
                    // Mock completion percentage for each chapter
                    const completionPercentage =
                      Math.floor(Math.random() * 100) + 1;
                    return {
                      ...chapter,
                      topics,
                      completionPercentage,
                      totalTopics: topics.length,
                      completedTopics: Math.floor(
                        (completionPercentage / 100) * topics.length
                      ),
                    };
                  } catch (error) {
                    return {
                      ...chapter,
                      topics: [],
                      completionPercentage: 0,
                      totalTopics: 0,
                      completedTopics: 0,
                    };
                  }
                })
              );

              // Calculate overall completion
              const totalTopics = chaptersWithProgress.reduce(
                (sum, ch) => sum + ch.totalTopics,
                0
              );
              const completedTopics = chaptersWithProgress.reduce(
                (sum, ch) => sum + ch.completedTopics,
                0
              );
              const overallCompletion =
                totalTopics > 0
                  ? Math.round((completedTopics / totalTopics) * 100)
                  : 0;

              // Add more chapters if the course has only one chapter (for demo purposes)
              let finalChapters = chaptersWithProgress;
              if (chaptersWithProgress.length <= 1) {
                const additionalChapters = [
                  {
                    _id: "demo_ch2",
                    title: "Company",
                    description:
                      "Setting up companies and managing data in Tally",
                    topics: [],
                    completionPercentage: 85,
                    totalTopics: 3,
                    completedTopics: 2,
                  },
                  {
                    _id: "demo_ch3",
                    title: "Vouchers",
                    description:
                      "Creating and managing various types of vouchers",
                    topics: [],
                    completionPercentage: 70,
                    totalTopics: 5,
                    completedTopics: 3,
                  },
                  {
                    _id: "demo_ch4",
                    title: "Accounting",
                    description: "Understanding different accounting methods",
                    topics: [],
                    completionPercentage: 60,
                    totalTopics: 4,
                    completedTopics: 2,
                  },
                  {
                    _id: "demo_ch5",
                    title: "Finalize",
                    description: "Finalising ledger balances and accounts",
                    topics: [],
                    completionPercentage: 45,
                    totalTopics: 4,
                    completedTopics: 2,
                  },
                  {
                    _id: "demo_ch6",
                    title: "Reconciliation",
                    description: "Bank reconciliation statements and processes",
                    topics: [],
                    completionPercentage: 30,
                    totalTopics: 4,
                    completedTopics: 1,
                  },
                  {
                    _id: "demo_ch7",
                    title: "Statements",
                    description:
                      "Preparing balance sheet, profit & loss statements",
                    topics: [],
                    completionPercentage: 20,
                    totalTopics: 6,
                    completedTopics: 1,
                  },
                  {
                    _id: "demo_ch8",
                    title: "Tax",
                    description: "Income tax and GST calculations in Tally",
                    topics: [],
                    completionPercentage: 15,
                    totalTopics: 5,
                    completedTopics: 1,
                  },
                ];
                finalChapters = [
                  ...chaptersWithProgress,
                  ...additionalChapters,
                ];
              }

              // Recalculate overall completion with additional chapters
              const finalTotalTopics = finalChapters.reduce(
                (sum, ch) => sum + ch.totalTopics,
                0
              );
              const finalCompletedTopics = finalChapters.reduce(
                (sum, ch) => sum + ch.completedTopics,
                0
              );
              const finalOverallCompletion =
                finalTotalTopics > 0
                  ? Math.round((finalCompletedTopics / finalTotalTopics) * 100)
                  : 0;

              return {
                ...course,
                chapters: finalChapters,
                completionPercentage: finalOverallCompletion,
                totalTopics: finalTotalTopics,
                completedTopics: finalCompletedTopics,
              };
            } catch (error) {
              console.error(`Error processing course ${course._id}:`, error);
              return {
                ...course,
                chapters: [],
                completionPercentage: 0,
                totalTopics: 0,
                completedTopics: 0,
              };
            }
          })
        );
        setCourses(coursesWithProgress);
        setFilteredCourses(coursesWithProgress);
        // Set first course as selected by default
        if (coursesWithProgress.length > 0) {
          setSelectedCourse(coursesWithProgress[0]);
        }
      } else {
        // Show demo data if no courses exist
        showDemoData();
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      // For demo purposes, show mock data if API fails
      showDemoData();
    } finally {
      setLoading(false);
    }
  };

  const showDemoData = () => {
    const mockCourses = [
      {
        _id: "1",
        title: "Basic Accounting & Tally Foundation",
        category: "Accounting",
        level: "Foundation",
        status: "Active",
        description:
          "Comprehensive course covering basic accounting principles and Tally software usage. Learn fundamental accounting concepts, company creation, voucher entries, and financial statements.",
        image: null,
        chapters: [
          {
            _id: "ch1",
            title: "Basic Accounting",
            description: "Introduction to accounting principles and concepts",
            completionPercentage: 100,
            totalTopics: 4,
            completedTopics: 4,
          },
          {
            _id: "ch2",
            title: "Company Creation and Data Management",
            description: "Setting up companies and managing data in Tally",
            completionPercentage: 100,
            totalTopics: 3,
            completedTopics: 3,
          },
          {
            _id: "ch3",
            title: "Voucher Entries",
            description: "Creating and managing various types of vouchers",
            completionPercentage: 100,
            totalTopics: 5,
            completedTopics: 5,
          },
          {
            _id: "ch4",
            title: "Method of Accounting",
            description: "Understanding different accounting methods",
            completionPercentage: 100,
            totalTopics: 4,
            completedTopics: 4,
          },
          {
            _id: "ch5",
            title: "Finalisation",
            description: "Finalising ledger balances and accounts",
            completionPercentage: 100,
            totalTopics: 4,
            completedTopics: 4,
          },
          {
            _id: "ch6",
            title: "Bank Reconciliation",
            description: "Bank reconciliation statements and processes",
            completionPercentage: 100,
            totalTopics: 4,
            completedTopics: 4,
          },
          {
            _id: "ch7",
            title: "Financial Statements",
            description: "Preparing balance sheet, profit & loss statements",
            completionPercentage: 85,
            totalTopics: 6,
            completedTopics: 5,
          },
          {
            _id: "ch8",
            title: "Tax Calculations",
            description: "Income tax and GST calculations in Tally",
            completionPercentage: 70,
            totalTopics: 5,
            completedTopics: 4,
          },
          {
            _id: "ch9",
            title: "Audit Trail",
            description: "Understanding audit trail and security features",
            completionPercentage: 60,
            totalTopics: 3,
            completedTopics: 2,
          },
          {
            _id: "ch10",
            title: "Advanced Reports",
            description: "Generating advanced reports and analytics",
            completionPercentage: 45,
            totalTopics: 4,
            completedTopics: 2,
          },
        ],
        completionPercentage: 100,
        totalTopics: 24,
        completedTopics: 24,
      },
      {
        _id: "2",
        title: "Advanced Financial Management",
        category: "Finance",
        level: "Advanced",
        status: "Active",
        description:
          "Advanced course covering financial analysis, investment management, and risk assessment. Perfect for professionals looking to enhance their financial expertise.",
        image: null,
        chapters: [
          {
            _id: "ch7",
            title: "Financial Analysis",
            description: "Advanced financial analysis techniques and tools",
            completionPercentage: 75,
            totalTopics: 6,
            completedTopics: 4,
          },
          {
            _id: "ch8",
            title: "Investment Management",
            description: "Portfolio management and investment strategies",
            completionPercentage: 60,
            totalTopics: 5,
            completedTopics: 3,
          },
          {
            _id: "ch9",
            title: "Risk Assessment",
            description: "Risk management and assessment methodologies",
            completionPercentage: 40,
            totalTopics: 7,
            completedTopics: 3,
          },
          {
            _id: "ch10",
            title: "Portfolio Optimization",
            description: "Modern portfolio theory and optimization techniques",
            completionPercentage: 25,
            totalTopics: 4,
            completedTopics: 1,
          },
          {
            _id: "ch11",
            title: "Derivatives Trading",
            description: "Understanding and trading financial derivatives",
            completionPercentage: 15,
            totalTopics: 8,
            completedTopics: 1,
          },
          {
            _id: "ch12",
            title: "Market Analysis",
            description: "Technical and fundamental market analysis",
            completionPercentage: 30,
            totalTopics: 6,
            completedTopics: 2,
          },
          {
            _id: "ch13",
            title: "Financial Modeling",
            description: "Building financial models and projections",
            completionPercentage: 20,
            totalTopics: 7,
            completedTopics: 1,
          },
          {
            _id: "ch14",
            title: "Corporate Finance",
            description: "Corporate financial management and decisions",
            completionPercentage: 10,
            totalTopics: 5,
            completedTopics: 1,
          },
        ],
        completionPercentage: 58,
        totalTopics: 18,
        completedTopics: 10,
      },
      {
        _id: "3",
        title: "Taxation & Compliance",
        category: "Taxation",
        level: "Intermediate",
        status: "Active",
        description:
          "Comprehensive guide to taxation laws, GST, and compliance requirements. Learn about income tax, GST filing, and regulatory compliance.",
        image: null,
        chapters: [
          {
            _id: "ch10",
            title: "Income Tax Fundamentals",
            description: "Basic concepts and calculation of income tax",
            completionPercentage: 80,
            totalTopics: 5,
            completedTopics: 4,
          },
          {
            _id: "ch11",
            title: "GST Basics and Filing",
            description:
              "Goods and Services Tax fundamentals and filing procedures",
            completionPercentage: 60,
            totalTopics: 6,
            completedTopics: 4,
          },
          {
            _id: "ch12",
            title: "Compliance and Regulations",
            description: "Tax compliance and regulatory requirements",
            completionPercentage: 30,
            totalTopics: 4,
            completedTopics: 1,
          },
          {
            _id: "ch13",
            title: "TDS and TCS",
            description: "Tax Deducted at Source and Tax Collected at Source",
            completionPercentage: 25,
            totalTopics: 5,
            completedTopics: 1,
          },
          {
            _id: "ch14",
            title: "Audit Procedures",
            description: "Tax audit procedures and documentation",
            completionPercentage: 15,
            totalTopics: 6,
            completedTopics: 1,
          },
          {
            _id: "ch15",
            title: "International Taxation",
            description: "Cross-border taxation and treaties",
            completionPercentage: 5,
            totalTopics: 4,
            completedTopics: 1,
          },
        ],
        completionPercentage: 60,
        totalTopics: 15,
        completedTopics: 9,
      },
    ];
    setCourses(mockCourses);
    setFilteredCourses(mockCourses);
    setSelectedCourse(mockCourses[0]);
  };

  // Filter courses based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.level?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "error";
      default:
        return "default";
    }
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return "success";
    if (percentage >= 50) return "warning";
    return "error";
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Foundation":
        return "primary";
      case "Intermediate":
        return "warning";
      case "Advanced":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Course Display
        </Typography>

        {/* Search and Actions Bar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search for a course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ flexGrow: 1, maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, color: "text.secondary" }}>🔍</Box>
              ),
            }}
          />
          <Button variant="outlined" size="small">
            Download App
          </Button>
          <Button variant="outlined" size="small">
            Learn to Use Lab
          </Button>
          <Chip
            label="50"
            icon={<Box sx={{ fontSize: "1rem" }}>🪙</Box>}
            color="warning"
            variant="outlined"
          />
        </Box>

        {/* Course Count */}
        <Typography variant="body2" color="text.secondary">
          Showing {filteredCourses.length} of {courses.length} courses
        </Typography>
      </Box>

      {/* Course Selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Select Course to View Details
        </Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 1 }}>
          {filteredCourses.map((course) => (
            <Chip
              key={course._id}
              label={course.title}
              onClick={() => setSelectedCourse(course)}
              color={selectedCourse?._id === course._id ? "primary" : "default"}
              variant={
                selectedCourse?._id === course._id ? "filled" : "outlined"
              }
              sx={{
                cursor: "pointer",
                maxWidth: 300,
                "&:hover": {
                  backgroundColor:
                    selectedCourse?._id === course._id
                      ? "primary.main"
                      : "action.hover",
                },
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Main Content - Course Details and Chapters */}
      {selectedCourse && (
        <Box
          sx={{ width: "100%", display: "flex", flexDirection: "row", gap: 3 }}
        >
          {/* Left Side - Course Details */}
          <Box
            sx={{
              flexShrink: 0,
              minWidth: 300,
              maxWidth: 350,
              position: "sticky",
              top: 20,
              height: "fit-content",
            }}
          >
            <Card
              sx={{
                height: "fit-content",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                }}
              >
                {/* Course Image */}
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mx: "auto",
                      mb: 2,
                      background: selectedCourse.image
                        ? `url(${selectedCourse.image}) center/cover`
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      fontSize: "2.5rem",
                      fontWeight: 600,
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    }}
                  >
                    {!selectedCourse.image &&
                      selectedCourse.title.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>

                {/* Course Title and Status */}
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
                >
                  {selectedCourse.title}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mb: 2, justifyContent: "center" }}
                >
                  <Chip
                    label={selectedCourse.status}
                    size="small"
                    color={getStatusColor(selectedCourse.status)}
                    icon={<CheckCircle />}
                  />
                  <Chip
                    label={selectedCourse.level}
                    size="small"
                    color={getLevelColor(selectedCourse.level)}
                    variant="outlined"
                  />
                </Stack>

                {/* Course Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, textAlign: "center" }}
                >
                  {selectedCourse.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Overall Progress */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Overall Progress
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={selectedCourse.completionPercentage}
                        color={getCompletionColor(
                          selectedCourse.completionPercentage
                        )}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      color={getCompletionColor(
                        selectedCourse.completionPercentage
                      )}
                      sx={{ fontWeight: 700 }}
                    >
                      {selectedCourse.completionPercentage}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {selectedCourse.completedTopics} of{" "}
                    {selectedCourse.totalTopics} topics completed
                  </Typography>
                </Box>

                {/* Course Stats */}
                <Box sx={{ mb: 3 }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        <Book
                          sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                        />
                        Chapters
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedCourse.chapters.length}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        <Assignment
                          sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                        />
                        Topics
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedCourse.totalTopics}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        <CheckCircle
                          sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                        />
                        Completed
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedCourse.completedTopics}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Action Buttons */}
                <Stack spacing={2} sx={{ mt: "auto" }}>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow sx={{ fontSize: 20 }} />}
                    fullWidth
                    size="large"
                    sx={{
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      py: 1.5,
                    }}
                    onClick={() => handleContinueLearning()}
                    disabled={!selectedCourse}
                  >
                    Continue Learning
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Visibility sx={{ fontSize: 20 }} />}
                    fullWidth
                    size="large"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      py: 1.5,
                    }}
                    onClick={() => handleViewCourse()}
                    disabled={!selectedCourse}
                  >
                    View Course
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Right Side - Chapters with Completion (Full Width) */}
          <Box sx={{ flexGrow: 1, width: "100%" }}>
            <Card sx={{ height: "100%", width: "100%" }}>
              <CardContent sx={{ p: 3, height: "100%", width: "100%" }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  Chapters & Progress ({selectedCourse.chapters?.length || 0}{" "}
                  chapters)
                </Typography>

                <Grid
                  container
                  spacing={3}
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                  }}
                >
                  {selectedCourse.chapters.map((chapter, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      key={chapter._id}
                      sx={{
                        minWidth: 0,
                        flex: "0 0 calc(50% - 12px)",
                        maxWidth: "calc(50% - 12px)",
                      }}
                    >
                      <Paper
                        sx={{
                          p: 3,
                          minHeight: 280,
                          height: "100%",
                          width: "100%",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          display: "flex",
                          flexDirection: "column",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              mr: 2,
                              background:
                                getCompletionColor(
                                  chapter.completionPercentage
                                ) === "success"
                                  ? "success.main"
                                  : getCompletionColor(
                                      chapter.completionPercentage
                                    ) === "warning"
                                  ? "warning.main"
                                  : "error.main",
                              color: "white",
                              fontWeight: 600,
                            }}
                          >
                            {index + 1}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              {chapter.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {chapter.description}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${chapter.completionPercentage}%`}
                            color={getCompletionColor(
                              chapter.completionPercentage
                            )}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        {/* Chapter Progress Bar */}
                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Progress
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {chapter.completedTopics} of {chapter.totalTopics}{" "}
                              topics
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={chapter.completionPercentage}
                            color={getCompletionColor(
                              chapter.completionPercentage
                            )}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>

                        {/* Chapter Actions */}
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ mt: "auto", pt: 2 }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility sx={{ fontSize: 16 }} />}
                            onClick={() => handleViewChapter(chapter)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            View Chapter
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Edit sx={{ fontSize: 16 }} />}
                            onClick={() => handleEditChapter(chapter)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<PlayArrow sx={{ fontSize: 16 }} />}
                            color="success"
                            onClick={() => handleContinueChapter(chapter)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            Continue
                          </Button>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {filteredCourses.length === 0 && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="300px"
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm
              ? "No courses found matching your search"
              : "No courses found"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first course to get started"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
