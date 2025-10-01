/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, use, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Play,
  Star,
  Clock,
  Users,
  CheckCircle,
  Download,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import jsPDF from "jspdf";

import LiveSchedule from "../../components/LiveSchedule";
import SimulatorDemo from "../../components/SimulatorDemo";

import axios from "axios";

// Dummy course data - in real app this would come from API
const dummyCourses = {
  "basic-accounting-tally": {
    id: "basic-accounting-tally",
    title: "Basic Accounting & Tally Foundation",
    rating: 4.7,
    reviewCount: 449,
    price: 4750,
    originalPrice: 5000,
    discount: 5,
    category: "Accounting",
    type: "Individual Course",
    description:
      "Tally Foundation Course covers in-depth knowledge to meet all the accounting requirements of the industry with learning exposure on Voucher Entries, Grouping, BRS, etc. We not only teach the concepts but also help you learn how you can practically implement those concepts in your day to day Accounting Process with practical examples and entries in Tally.",
    image: "/images/a1.jpeg",
    videoThumbnail: "/images/a1.jpeg",
    syllabus: [
      {
        title: "Basic Accounting",
        topics: [
          "Introduction to Accounting",
          "Accounting Principles",
          "Double Entry System",
          "Journal Entries",
        ],
      },
      {
        title: "Company creation and data management",
        topics: [
          "Creating Company in Tally",
          "Company Configuration",
          "Data Backup & Restore",
          "Multi-Company Setup",
        ],
      },
      {
        title: "Voucher Entries in Tally",
        topics: [
          "Sales Voucher",
          "Purchase Voucher",
          "Payment Voucher",
          "Receipt Voucher",
          "Journal Voucher",
        ],
      },
      {
        title: "Concept of Dual Entry",
        topics: [
          "Debit and Credit Rules",
          "Trial Balance",
          "Profit & Loss Account",
          "Balance Sheet",
        ],
      },
      {
        title: "Finalisation of ledger balances",
        topics: [
          "Ledger Creation",
          "Balance Confirmation",
          "Reconciliation Process",
          "Year-end Procedures",
        ],
      },
      {
        title: "Bank Reconciliation Statement",
        topics: [
          "BRS Concepts",
          "Bank Statement Analysis",
          "Reconciliation Process",
          "Common Discrepancies",
        ],
      },
    ],
    features: {
      chapters: 7,
      microVideos: 28,
      caseStudies: 16,
      assessments: 89,
      simulations: 0,
      experiments: 30,
      recordings: 10,
      languages: 15,
    },
    duration: "40 hours",
    level: "Levels",
    students: 1250,
  },
  "hr-certification": {
    id: "hr-certification",
    title: "HR Certification Course",
    rating: 4.5,
    reviewCount: 320,
    price: 900,
    originalPrice: 1000,
    discount: 10,
    category: "HR",
    type: "Individual Course",
    description:
      "Comprehensive HR certification course covering recruitment, employee relations, performance management, and HR analytics. Learn practical HR skills with real-world case studies and industry best practices.",
    image: "/images/course-2.jpg",
    videoThumbnail: "/images/young-woman.jpg",
    syllabus: [
      {
        title: "HR Fundamentals",
        topics: [
          "Introduction to Human Resources",
          "HR Roles and Responsibilities",
          "HR Strategy and Planning",
          "Legal Framework",
        ],
      },
      {
        title: "Recruitment and Selection",
        topics: [
          "Job Analysis and Design",
          "Recruitment Methods",
          "Selection Process",
          "Interview Techniques",
        ],
      },
      {
        title: "Employee Relations",
        topics: [
          "Employee Engagement",
          "Conflict Resolution",
          "Disciplinary Procedures",
          "Grievance Handling",
        ],
      },
      {
        title: "Performance Management",
        topics: [
          "Performance Appraisal",
          "Goal Setting",
          "Feedback Mechanisms",
          "Performance Improvement",
        ],
      },
    ],
    features: {
      chapters: 5,
      microVideos: 20,
      caseStudies: 12,
      assessments: 45,
      simulations: 5,
      experiments: 15,
      recordings: 8,
      languages: 12,
    },
    duration: "30 hours",
    level: "Levels",
    students: 890,
  },
  "excel-certification": {
    id: "excel-certification",
    title: "Excel Certification Course",
    rating: 4.8,
    reviewCount: 680,
    price: 2000,
    originalPrice: 2000,
    discount: 0,
    category: "Accounting",
    type: "Individual Course",
    description:
      "Master Excel from basics to advanced level. Learn formulas, functions, data analysis, pivot tables, and automation. Perfect for accounting professionals and data analysts.",
    image: "/images/course-3.jpg",
    videoThumbnail: "/images/course.png",
    syllabus: [
      {
        title: "Excel Basics",
        topics: [
          "Interface and Navigation",
          "Data Entry and Formatting",
          "Basic Formulas",
          "Cell References",
        ],
      },
      {
        title: "Advanced Formulas",
        topics: [
          "VLOOKUP and HLOOKUP",
          "INDEX and MATCH",
          "IF Functions",
          "Array Formulas",
        ],
      },
      {
        title: "Data Analysis",
        topics: [
          "Pivot Tables",
          "Charts and Graphs",
          "Data Validation",
          "Conditional Formatting",
        ],
      },
      {
        title: "Automation",
        topics: [
          "Macros Basics",
          "VBA Introduction",
          "Automated Reports",
          "Dashboard Creation",
        ],
      },
    ],
    features: {
      chapters: 6,
      microVideos: 35,
      caseStudies: 20,
      assessments: 60,
      simulations: 8,
      experiments: 25,
      recordings: 12,
      languages: 18,
    },
    duration: "35 hours",
    level: "Levels",
    students: 2100,
  },
};

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const [activeTab, setActiveTab] = useState("syllabus");
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseRatings, setCourseRatings] = useState<any>(null);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrollingRecorded, setIsEnrollingRecorded] = useState(false);
  const [isEnrollingRecordedCenter, setIsEnrollingRecordedCenter] = useState(false);
  const [isEnrollingLiveCenter, setIsEnrollingLiveCenter] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Debug logging
  console.log("Course Page API_BASE:", API_BASE);
  console.log(
    "Course Page NEXT_PUBLIC_API_URL:",
    process.env.NEXT_PUBLIC_API_URL
  );
  console.log(
    "Course Page NEXT_PUBLIC_API_BASE:",
    process.env.NEXT_PUBLIC_API_BASE
  );
  console.log("Course data:", course);
  console.log("Course image:", course?.image);

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

  console.log("Resolved params:", resolvedParams);
  console.log("Course ID:", resolvedParams.courseId);

  // Temporary hardcoded test data to check if image display works
  const testCourse = {
    title: "Basic Accounting & Tally Foundation",
    image: "/uploads/1758703607767-656204190.webp",
    pricing: {
      recordedSession: { finalPrice: 4750, price: 5000, discount: 5 },
      liveSession: { finalPrice: 6650, price: 7000, discount: 5 },
    },
  };

  console.log("Test course:", testCourse);

  // Force course data for testing - bypass loading state
  const displayCourse = course || testCourse;
  console.log("Display course:", displayCourse);

  // Fetch course data from API
  useEffect(() => {
    console.log(
      "useEffect triggered with courseId:",
      resolvedParams.courseId,
      "API_BASE:",
      API_BASE
    );

    // Set initial course data immediately to prevent blinking
    const fallbackCourse = dummyCourses[resolvedParams.courseId as keyof typeof dummyCourses];
    if (fallbackCourse) {
      setCourse(fallbackCourse);
      setLoading(false);
    } else if (resolvedParams.courseId === "basic-accounting-tally-foundation") {
      setCourse(testCourse);
      setLoading(false);
    }

    // Fetch from API in background
    const fetchCourse = async () => {
      if (!resolvedParams.courseId) {
        console.log("No courseId found, skipping API call");
        return;
      }

      try {
        console.log(
          "Making API call to:",
          `${API_BASE}/api/courses/${resolvedParams.courseId}`
        );
        const response = await axios.get(
          `${API_BASE}/api/courses/${resolvedParams.courseId}`
        );
        console.log("Course data received:", response.data);
        console.log("Course image:", response.data.image);
        setCourse(response.data);
      } catch (err: any) {
        console.error("Error fetching course:", err);
        console.error("Error details:", err.response?.data);
        console.error("Error status:", err.response?.status);
        setError("Course not found");
        // Keep existing fallback course if API fails
        console.log("API failed, keeping fallback course");
      }
    };

    // Run API call in background
    fetchCourse();
  }, [resolvedParams.courseId, API_BASE]);

  // Check student authentication
  useEffect(() => {
    const checkStudentAuth = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/v1/students/isstudent`,
          {
            withCredentials: true,
          }
        );
        setStudent(response.data.student);
      } catch (err) {
        console.error("Error checking student auth:", err);
        setStudent(null);
      }
    };
    checkStudentAuth();
  }, [API_BASE]);

  // Handle Digital Hub+ enrollment
  const handleDigitalHubPlusEnrollment = async () => {
    if (!student) {
      alert("Please login to enroll in Digital Hub+ Live Sessions");
      return;
    }

    setIsEnrolling(true);
    try {
      // First, get all live sessions for this course category
      const liveSessionsResponse = await axios.get(
        `${API_BASE}/api/live-sessions`
      );
      const courseLiveSessions = liveSessionsResponse.data.filter(
        (session: any) =>
          session.category === course?.category || "CA Foundation"
      );

      // Enroll student in all live sessions for this course
      for (const session of courseLiveSessions) {
        try {
          await axios.post(
            `${API_BASE}/api/v1/students/enroll-live-session/${student._id}`,
            { sessionId: session._id },
            { withCredentials: true }
          );
        } catch (enrollError) {
          console.error(
            `Failed to enroll in session ${session._id}:`,
            enrollError
          );
        }
      }

      alert(
        "Successfully enrolled in Digital Hub+ Live Sessions! You can now access live classes from your dashboard."
      );
    } catch (error) {
      console.error("Error enrolling in live sessions:", error);
      alert("Failed to enroll in live sessions. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  // Handle Digital Hub Recorded Session enrollment
  const handleDigitalHubRecordedEnrollment = async () => {
    if (!student) {
      alert("Please login to enroll in Digital Hub Recorded Sessions");
      return;
    }

    setIsEnrollingRecorded(true);
    try {
      const enrollUrl = `${API_BASE}/api/v1/students/enroll-recorded-session/${student._id}`;
      console.log("Enrolling in recorded session with URL:", enrollUrl);
      console.log("Course ID:", course._id);
      console.log("Student ID:", student._id);

      // Enroll student in recorded session (course content)
      const response = await axios.post(
        enrollUrl,
        { courseId: course._id },
        { withCredentials: true }
      );

      console.log("Enrollment response:", response.data);
      alert(
        "Successfully enrolled in Digital Hub Recorded Sessions! You can now access recorded content from your dashboard."
      );
    } catch (error: any) {
      console.error("Error enrolling in recorded sessions:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);

      // Provide more specific error messages
      let errorMessage =
        "Failed to enroll in recorded sessions. Please try again.";

      if (error.response?.status === 400) {
        if (error.response?.data?.message?.includes("already enrolled")) {
          errorMessage = "You are already enrolled in this recorded session.";
        } else if (error.response?.data?.message?.includes("Invalid")) {
          errorMessage =
            "Invalid course or student information. Please refresh the page and try again.";
        } else {
          errorMessage = error.response?.data?.message || errorMessage;
        }
      } else if (error.response?.status === 404) {
        errorMessage =
          "Course or student not found. Please refresh the page and try again.";
      } else if (error.response?.status === 401) {
        errorMessage = "Please login again to enroll in recorded sessions.";
      }

      alert(errorMessage);
    } finally {
      setIsEnrollingRecorded(false);
    }
  };

  // Handle Digital Hub Recorded Session + Center enrollment
  const handleDigitalHubRecordedCenterEnrollment = async () => {
    if (!student) {
      alert("Please login to enroll in Digital Hub Recorded Sessions + Center");
      return;
    }

    setIsEnrollingRecordedCenter(true);
    try {
      const enrollUrl = `${API_BASE}/api/v1/students/enroll-recorded-session-center/${student._id}`;
      console.log("Enrolling in recorded session + center with URL:", enrollUrl);
      console.log("Course ID:", course._id);
      console.log("Student ID:", student._id);

      // Enroll student in recorded session + center
      const response = await axios.post(
        enrollUrl,
        { courseId: course._id },
        { withCredentials: true }
      );

      console.log("Enrollment response:", response.data);
      alert(
        "Successfully enrolled in Digital Hub Recorded Sessions + Center! You can now access recorded content and center facilities from your dashboard."
      );
    } catch (error: any) {
      console.error("Error enrolling in recorded sessions + center:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);

      // Provide more specific error messages
      let errorMessage =
        "Failed to enroll in recorded sessions + center. Please try again.";

      if (error.response?.status === 400) {
        if (error.response?.data?.message?.includes("already enrolled")) {
          errorMessage = "You are already enrolled in this recorded session + center.";
        } else if (error.response?.data?.message?.includes("Invalid")) {
          errorMessage =
            "Invalid course or student information. Please refresh the page and try again.";
        } else {
          errorMessage = error.response?.data?.message || errorMessage;
        }
      } else if (error.response?.status === 404) {
        errorMessage =
          "Course or student not found. Please refresh the page and try again.";
      } else if (error.response?.status === 401) {
        errorMessage = "Please login again to enroll in recorded sessions + center.";
      }

      alert(errorMessage);
    } finally {
      setIsEnrollingRecordedCenter(false);
    }
  };

  // Handle Digital Hub Live Session + Center enrollment
  const handleDigitalHubLiveCenterEnrollment = async () => {
    if (!student) {
      alert("Please login to enroll in Digital Hub Live Sessions + Center");
      return;
    }

    setIsEnrollingLiveCenter(true);
    try {
      const enrollUrl = `${API_BASE}/api/v1/students/enroll-live-session-center/${student._id}`;
      console.log("Enrolling in live session + center with URL:", enrollUrl);
      console.log("Course ID:", course._id);
      console.log("Student ID:", student._id);

      // Enroll student in live session + center
      const response = await axios.post(
        enrollUrl,
        { courseId: course._id },
        { withCredentials: true }
      );

      console.log("Enrollment response:", response.data);
      alert(
        "Successfully enrolled in Digital Hub Live Sessions + Center! You can now access live sessions and center facilities from your dashboard."
      );
    } catch (error: any) {
      console.error("Error enrolling in live sessions + center:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);

      // Provide more specific error messages
      let errorMessage =
        "Failed to enroll in live sessions + center. Please try again.";

      if (error.response?.status === 400) {
        if (error.response?.data?.message?.includes("already enrolled")) {
          errorMessage = "You are already enrolled in this live session + center.";
        } else if (error.response?.data?.message?.includes("Invalid")) {
          errorMessage =
            "Invalid course or student information. Please refresh the page and try again.";
        } else {
          errorMessage = error.response?.data?.message || errorMessage;
        }
      } else if (error.response?.status === 404) {
        errorMessage =
          "Course or student not found. Please refresh the page and try again.";
      } else if (error.response?.status === 401) {
        errorMessage = "Please login again to enroll in live sessions + center.";
      }

      alert(errorMessage);
    } finally {
      setIsEnrollingLiveCenter(false);
    }
  };

  // Fetch course ratings from API
  useEffect(() => {
    const fetchCourseRatings = async () => {
      try {
        setRatingsLoading(true);
        // Use the course ID from the fetched course data, not the slug
        const courseId = course?._id || resolvedParams.courseId;
        const response = await axios.get(
          `${API_BASE}/api/v1/course-ratings/course/${courseId}`
        );
        if (response.data.success) {
          setCourseRatings(response.data);
        } else {
          // Set fallback ratings
          setCourseRatings({
            averageRating: course?.rating || 4.7,
            totalRatings: course?.reviewCount || 449,
            data: [],
          });
        }
      } catch (err) {
        console.error("Error fetching course ratings:", err);
        // Set default ratings if API fails
        setCourseRatings({
          averageRating: course?.rating || 4.7,
          totalRatings: course?.reviewCount || 449,
          data: [],
        });
      } finally {
        setRatingsLoading(false);
      }
    };

    // Only fetch ratings after course data is loaded
    if (course && course._id) {
      fetchCourseRatings();
    }
  }, [course, API_BASE]);

  // Loading state
  if (loading && !displayCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Course Not Found
            </h1>
            <p className="text-gray-600">
              The course you&apos;re looking for doesn&apos;t exist.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Course ID: {resolvedParams.courseId}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Course Not Found
            </h1>
            <p className="text-gray-600">
              The course you&apos;re looking for doesn&apos;t exist.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Course ID: {resolvedParams.courseId}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const generateSyllabusPDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Add title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Course Syllabus", 20, yPosition);
    yPosition += 15;

    // Add course title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(course.title || "Course Details", 20, yPosition);
    yPosition += 20;

    // Add course description
    if (course.description) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const descriptionLines = doc.splitTextToSize(course.description, 170);
      doc.text(descriptionLines, 20, yPosition);
      yPosition += descriptionLines.length * 6 + 10;
    }

    // Add course details
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Course Information:", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Duration: ${course.duration || "N/A"}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Level: ${course.level || "N/A"}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Price: ₹${course.price || "N/A"}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Rating: ${course.rating || "N/A"}/5`, 20, yPosition);
    yPosition += 15;

    // Add syllabus content
    if (course.chapters && course.chapters.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Detailed Syllabus:", 20, yPosition);
      yPosition += 10;

      course.chapters.forEach((chapter: any, index: number) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        // Chapter title
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${chapter.title}`, 20, yPosition);
        yPosition += 8;

        // Chapter topics
        if (chapter.topics && chapter.topics.length > 0) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          chapter.topics.forEach((topic: any) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(`• ${topic.title || topic}`, 30, yPosition);
            yPosition += 5;
          });
        }
        yPosition += 5;
      });
    } else if (course.syllabus && course.syllabus.length > 0) {
      // Fallback to dummy syllabus data
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Detailed Syllabus:", 20, yPosition);
      yPosition += 10;

      course.syllabus.forEach((chapter: any, index: number) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        // Chapter title
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${chapter.title}`, 20, yPosition);
        yPosition += 8;

        // Chapter topics
        if (chapter.topics && chapter.topics.length > 0) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          chapter.topics.forEach((topic: string) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(`• ${topic}`, 30, yPosition);
            yPosition += 5;
          });
        }
        yPosition += 5;
      });
    }

    // Save the PDF
    const fileName = `${course.title || "Course"}_Syllabus.pdf`;
    doc.save(fileName);
  };

  // Dynamic tabs based on course data
  const tabs = [
    { id: "syllabus", label: course?.tabs?.syllabus?.label || "Syllabus" },
    {
      id: "case-studies",
      label: course?.tabs?.assignment?.label || "Assignment",
    },
    {
      id: "exam",
      label: course?.tabs?.assessment?.label || "Assessment & Certificates",
    },
    {
      id: "schedule",
      label: course?.tabs?.schedule?.label || "Live Schedule +",
    },
    { id: "simulation", label: course?.tabs?.simulator?.label || "Simulator" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <div className="pt-48 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Course Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow-lg p-6 mb-6"
              >
                {/* Course Type Badge */}
                <div className="inline-block bg-[#3cd664] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  {course.level || "Individual Course"}
                </div>

                {/* Course Title */}
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent mb-4 leading-tight">
                  {course.title}
                </h1>

                {/* Rating - Show if available */}
                {(courseRatings?.averageRating ||
                  courseRatings?.totalRatings) && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(courseRatings?.averageRating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {courseRatings?.averageRating || 0}
                    </span>
                    <span className="text-xs text-gray-600">
                      [{courseRatings?.totalRatings || 0}]
                    </span>
                    {ratingsLoading && (
                      <span className="text-sm text-gray-500">
                        Loading ratings...
                      </span>
                    )}
                  </div>
                )}

                {/* Description */}
                <div
                  className="text-sm text-gray-700 leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{
                    __html: course.description || "No description available.",
                  }}
                />

                {/* Tabs */}
                <div className="border-b-2 border-gray-200 mb-8">
                  <nav className="-mb-px flex space-x-4">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-2 px-2 border-b-4 font-semibold text-sm whitespace-nowrap ${
                          activeTab === tab.id
                            ? "border-[#3cd664] text-[#3cd664]"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                {activeTab === "syllabus" && (
                  <div>
                    <div className="mb-4 flex justify-between items-center">
                      <h3 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
                        Course Syllabus
                      </h3>
                      <button
                        onClick={generateSyllabusPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        View full Syllabus
                      </button>
                    </div>

                    {/* Dynamic syllabus from chapters */}
                    {course.chapters && course.chapters.length > 0 ? (
                      <div className="space-y-4">
                        {course.chapters.map(
                          (
                            chapter: {
                              title:
                                | string
                                | number
                                | bigint
                                | boolean
                                | React.ReactElement<
                                    unknown,
                                    string | React.JSXElementConstructor<any>
                                  >
                                | Iterable<React.ReactNode>
                                | React.ReactPortal
                                | Promise<
                                    | string
                                    | number
                                    | bigint
                                    | boolean
                                    | React.ReactPortal
                                    | React.ReactElement<
                                        unknown,
                                        | string
                                        | React.JSXElementConstructor<any>
                                      >
                                    | Iterable<React.ReactNode>
                                    | null
                                    | undefined
                                  >
                                | null
                                | undefined;
                              topics: any[];
                            },
                            index: React.Key | null | undefined
                          ) => (
                            <div
                              key={index}
                              className="border border-gray-100 rounded-lg shadow-md hover:scale-[1.02] transition-all duration-200"
                            >
                              <button
                                onClick={() => toggleSection(Number(index))}
                                className="w-full px-2 py-1 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg"
                              >
                                <span className="font-semibold text-sm text-gray-900">
                                  {chapter.title}
                                </span>
                                {expandedSections.includes(Number(index)) ? (
                                  <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                              </button>

                              {expandedSections.includes(Number(index)) && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="px-2 pb-1"
                                >
                                  <ul className="space-y-1">
                                    {chapter.topics &&
                                      chapter.topics.map(
                                        (
                                          topic: { title: any },
                                          topicIndex:
                                            | React.Key
                                            | null
                                            | undefined
                                        ) => (
                                          <li
                                            key={topicIndex}
                                            className="flex items-center text-xs text-gray-600"
                                          >
                                            <CheckCircle className="w-3 h-3 text-[#3cd664] mr-1 flex-shrink-0" />
                                            {topic.title || topic}
                                          </li>
                                        )
                                      )}
                                  </ul>
                                </motion.div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="bg-gray-100 rounded-lg p-8">
                          <h3 className="text-base font-semibold text-gray-700 mb-4">
                            Syllabus Coming Soon
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            The detailed syllabus for this course is being
                            prepared and will be available soon.
                          </p>
                          <p className="text-xs text-gray-500">
                            Please check back later or contact us for more
                            information about the course content.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "case-studies" && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Assignment
                    </h3>
                    <div
                      className="text-sm text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html:
                          course.assignment ||
                          "Practical assignments will be available here.",
                      }}
                    />
                  </div>
                )}

                {activeTab === "exam" && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Assessment & Certificates
                    </h3>
                    <div
                      className="text-sm text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html:
                          course.examCert ||
                          "Assessment details and certificate information will be available here.",
                      }}
                    />
                  </div>
                )}

                {activeTab === "schedule" && (
                  <div>
                    <LiveSchedule
                      courseCategory={course.category || "CA Foundation"}
                      student={student}
                    />
                  </div>
                )}

                {activeTab === "simulation" && (
                  <div>
                    <div className="text-center py-12">
                      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                        <div className="mb-6">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                              className="w-8 h-8 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Access Simulator
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Experience our interactive simulator through the
                            Demo Digital Hub
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            (window.location.href = "/demo-digital-hub")
                          }
                          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Go to Demo Digital Hub
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Video & Enrollment */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {/* Video Section */}
                <div className="relative">
                  <div className="aspect-video bg-gray-900 relative overflow-hidden">
                    {/* Course Thumbnail - Direct Image Test */}
                    <img
                      src={
                        course?.image
                          ? course.image.startsWith("/uploads")
                            ? `${API_BASE}${course.image}` // uploaded images
                            : course.image // already local/public images like /images/a1.jpeg
                          : "/images/a1.jpeg" // fallback
                      }
                      alt={`${course?.title || "Course"} - Course Preview`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log("Image failed, using fallback");
                        e.currentTarget.src = "/images/a1.jpeg";
                      }}
                    />

                    {/* Play Button Overlay */}
                  </div>
                </div>

                {/* Pricing & Enrollment */}
                <div className="p-6 border-b-2">
                  <div className="text-center text-sm text-gray-600 mb-6">
                    <p>Get access to this course in DIGITAL HUB.</p>
                    <button className="text-blue-600 hover:text-blue-800 font-semibold mt-2 text-sm">
                      Select Plan
                    </button>
                  </div>

                  {/* Pricing Cards - Side by Side */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {/* Recorded Lecture Option */}
                    <div className="border-2 border-[#3cd664] rounded-lg p-2">
                      <div className="mb-2">
                        <div className="text-center mb-1">
                          <span className="text-xs font-bold text-[#3cd664] block">
                            {course?.pricing?.recordedSession?.title?.split(
                              "+"
                            )[0] || "DIGITAL HUB+"}
                          </span>
                          <span className="text-xs font-bold text-[#3cd664] block">
                            {course?.pricing?.recordedSession?.title?.split(
                              "+"
                            )[1] || "RECORDED SESSION"}
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-[#3cd664]">
                            ₹
                            {course?.pricing?.recordedSession?.finalPrice
                              ? course.pricing.recordedSession.finalPrice.toLocaleString()
                              : course?.pricing?.recordedSession?.price
                              ? course.pricing.recordedSession.price.toLocaleString()
                              : course.price
                              ? course.price.toLocaleString()
                              : "2,000"}
                          </div>
                          {course?.pricing?.recordedSession?.discount &&
                            course.pricing.recordedSession.discount > 0 && (
                              <div className="text-xs text-gray-500 line-through">
                                ₹
                                {course.pricing.recordedSession.price.toLocaleString()}
                              </div>
                            )}
                        </div>
                      </div>

                      <button
                        onClick={handleDigitalHubRecordedEnrollment}
                        disabled={isEnrollingRecorded}
                        className="w-full bg-[#3cd664] hover:bg-[#33bb58] text-white font-bold py-1 px-2 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isEnrollingRecorded
                          ? "Enrolling..."
                          : course?.pricing?.recordedSession?.buttonText ||
                            "Add Digital Hub+"}
                      </button>
                    </div>

                    {/* Live Lecture Option */}
                    <div className="border-2 border-blue-500 rounded-lg p-2">
                      <div className="mb-2">
                        <div className="text-center mb-1">
                          <span className="text-xs font-bold text-blue-500 block">
                            {course?.pricing?.liveSession?.title?.split(
                              "+"
                            )[0] || "DIGITAL HUB+"}
                          </span>
                          <span className="text-xs font-bold text-blue-500 block">
                            {course?.pricing?.liveSession?.title?.split(
                              "+"
                            )[1] || "LIVE SESSION"}
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-blue-500">
                            ₹
                            {course?.pricing?.liveSession?.finalPrice
                              ? course.pricing.liveSession.finalPrice.toLocaleString()
                              : course?.pricing?.liveSession?.price
                              ? course.pricing.liveSession.price.toLocaleString()
                              : course.price
                              ? (
                                  course.price *
                                  (course?.pricing?.liveSession
                                    ?.priceMultiplier || 1.5)
                                ).toLocaleString()
                              : "3,000"}
                          </div>
                          {course?.pricing?.liveSession?.discount &&
                            course.pricing.liveSession.discount > 0 && (
                              <div className="text-xs text-gray-500 line-through">
                                ₹
                                {course.pricing.liveSession.price.toLocaleString()}
                              </div>
                            )}
                        </div>
                      </div>

                      <button
                        onClick={handleDigitalHubPlusEnrollment}
                        disabled={isEnrolling}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-1 px-2 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isEnrolling
                          ? "Enrolling..."
                          : course?.pricing?.liveSession?.buttonText ||
                            "Add Digital Hub+"}
                      </button>
                    </div>
                  </div>

                  {/* Center Options Cards - Side by Side */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {/* Recorded Session + Center Option */}
                    <div className="border-2 border-[#3cd664] rounded-lg p-2">
                      <div className="mb-2">
                        <div className="text-center mb-1">
                          <span className="text-xs font-bold text-[#3cd664] block">
                            {course?.pricing?.recordedSessionCenter?.title?.split(
                              "+"
                            )[0] || "DIGITAL HUB+"}
                          </span>
                          <span className="text-xs font-bold text-[#3cd664] block">
                            {course?.pricing?.recordedSessionCenter?.title?.split(
                              "+"
                            )[1] || "RECORDED SESSION+"}
                          </span>
                          <span className="text-xs font-bold text-[#3cd664] block">
                            {course?.pricing?.recordedSessionCenter?.title?.split(
                              "+"
                            )[2] || "CENTER"}
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-[#3cd664]">
                            ₹
                            {course?.pricing?.recordedSessionCenter?.finalPrice
                              ? course.pricing.recordedSessionCenter.finalPrice.toLocaleString()
                              : course?.pricing?.recordedSessionCenter?.price
                              ? course.pricing.recordedSessionCenter.price.toLocaleString()
                              : course.price
                              ? (course.price * 1.8).toLocaleString()
                              : "3,600"}
                          </div>
                          {course?.pricing?.recordedSessionCenter?.discount &&
                            course.pricing.recordedSessionCenter.discount > 0 && (
                              <div className="text-xs text-gray-500 line-through">
                                ₹
                                {course.pricing.recordedSessionCenter.price.toLocaleString()}
                              </div>
                            )}
                        </div>
                      </div>

                      <button
                        onClick={handleDigitalHubRecordedCenterEnrollment}
                        disabled={isEnrollingRecordedCenter}
                        className="w-full bg-[#3cd664] hover:bg-[#33bb58] text-white font-bold py-1 px-2 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isEnrollingRecordedCenter
                          ? "Enrolling..."
                          : course?.pricing?.recordedSessionCenter?.buttonText ||
                            "Add Digital Hub+ Center"}
                      </button>
                    </div>

                    {/* Live Session + Center Option */}
                    <div className="border-2 border-blue-500 rounded-lg p-2">
                      <div className="mb-2">
                        <div className="text-center mb-1">
                          <span className="text-xs font-bold text-blue-500 block">
                            {course?.pricing?.liveSessionCenter?.title?.split(
                              "+"
                            )[0] || "DIGITAL HUB+"}
                          </span>
                          <span className="text-xs font-bold text-blue-500 block">
                            {course?.pricing?.liveSessionCenter?.title?.split(
                              "+"
                            )[1] || "LIVE SESSION+"}
                          </span>
                          <span className="text-xs font-bold text-blue-500 block">
                            {course?.pricing?.liveSessionCenter?.title?.split(
                              "+"
                            )[2] || "CENTER"}
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-blue-500">
                            ₹
                            {course?.pricing?.liveSessionCenter?.finalPrice
                              ? course.pricing.liveSessionCenter.finalPrice.toLocaleString()
                              : course?.pricing?.liveSessionCenter?.price
                              ? course.pricing.liveSessionCenter.price.toLocaleString()
                              : course.price
                              ? (course.price * 2.2).toLocaleString()
                              : "4,400"}
                          </div>
                          {course?.pricing?.liveSessionCenter?.discount &&
                            course.pricing.liveSessionCenter.discount > 0 && (
                              <div className="text-xs text-gray-500 line-through">
                                ₹
                                {course.pricing.liveSessionCenter.price.toLocaleString()}
                              </div>
                            )}
                        </div>
                      </div>

                      <button
                        onClick={handleDigitalHubLiveCenterEnrollment}
                        disabled={isEnrollingLiveCenter}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-1 px-2 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isEnrollingLiveCenter
                          ? "Enrolling..."
                          : course?.pricing?.liveSessionCenter?.buttonText ||
                            "Add Digital Hub+ Center"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Course Features */}
                <div className="p-6 border-b-2">
                  <p className="text-sm text-gray-600 mb-6 font-semibold">
                    This course includes:
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold">
                      {course.chapters ? course.chapters.length : 0} Lesson
                    </div>
                    <div className="bg-[#3cd664] text-white px-3 py-2 rounded-lg text-sm font-bold">
                      {course.chapters
                        ? course.chapters.reduce(
                            (total: any, chapter: { topics: string | any[] }) =>
                              total +
                              (chapter.topics ? chapter.topics.length : 0),
                            0
                          )
                        : 0}{" "}
                      Topics
                    </div>
                    <div className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold">
                      Simulator
                    </div>
                    <div className="bg-[#3cd664] text-white px-3 py-2 rounded-lg text-sm font-bold">
                      {course.examCert ? "Yes" : "No."} Assignment
                    </div>
                    <div className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold">
                      {course.video ? "Yes" : "No"} Live Sessions
                    </div>
                    <div className="bg-[#3cd664] text-white px-3 py-2 rounded-lg text-sm font-bold">
                      {course.level || "Levels"}
                    </div>
                    <div className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold">
                      {course.category || "General"} Category
                    </div>
                    <div className="bg-[#3cd664] text-white px-3 py-2 rounded-lg text-sm font-bold">
                      {course.discount > 0
                        ? `${course.discount}% OFF`
                        : "No Discount"}
                    </div>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="p-6 bg-gray-50 border-t-2">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm font-bold text-gray-900">
                          {course.level || "Levels"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-semibold">
                        Level
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <Users className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm font-bold text-gray-900">
                          {course.category || "General"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-semibold">
                        Category
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
