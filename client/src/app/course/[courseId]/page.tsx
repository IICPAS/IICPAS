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
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LiveSchedule from "../../components/LiveSchedule";
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
    image: "/images/course-1.jpg",
    videoThumbnail: "/images/accounting.webp",
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

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Debug logging
  console.log("Course Page API_BASE:", API_BASE);
  console.log(
    "Course Page NEXT_PUBLIC_API_URL:",
    process.env.NEXT_PUBLIC_API_URL
  );

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

  // Fetch course data from API
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/courses/${resolvedParams.courseId}`
        );
        setCourse(response.data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Course not found");
        // Fallback to dummy data if API fails
        const fallbackCourse =
          dummyCourses[resolvedParams.courseId as keyof typeof dummyCourses];
        if (fallbackCourse) {
          setCourse(fallbackCourse);
        }
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.courseId) {
      fetchCourse();
    }
  }, [resolvedParams.courseId]);

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

  // Fetch course ratings from API
  useEffect(() => {
    const fetchCourseRatings = async () => {
      try {
        setRatingsLoading(true);
        const response = await axios.get(
          `${API_BASE}/api/v1/course-ratings/course/${resolvedParams.courseId}`
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

    if (resolvedParams.courseId) {
      fetchCourseRatings();
    }
  }, [resolvedParams.courseId, course, API_BASE]);

  // Loading state
  if (loading) {
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
                <div className="inline-block bg-[#3cd664] text-white text-sm font-bold px-4 py-2 rounded-full mb-4">
                  {course.level || "Individual Course"}
                </div>

                {/* Course Title */}
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent mb-4 leading-tight">
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
                          className={`w-8 h-8 ${
                            i < Math.floor(courseRatings?.averageRating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {courseRatings?.averageRating || 0}
                    </span>
                    <span className="text-base text-gray-600">
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
                  className="text-xl text-gray-700 leading-relaxed mb-8"
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
                        className={`py-3 px-2 border-b-4 font-semibold text-base whitespace-nowrap ${
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
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
                        Course Syllabus
                      </h3>
                      <button className="text-[#3cd664] hover:text-[#33bb58] font-semibold text-base">
                        View Full Syllabus
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
                              className="border-2 border-gray-200 rounded-xl"
                            >
                              <button
                                onClick={() => toggleSection(Number(index))}
                                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 rounded-xl"
                              >
                                <span className="font-bold text-xl text-gray-900">
                                  {chapter.title}
                                </span>
                                {expandedSections.includes(Number(index)) ? (
                                  <ChevronUp className="w-8 h-8 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-8 h-8 text-gray-500" />
                                )}
                              </button>

                              {expandedSections.includes(Number(index)) && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="px-6 pb-5"
                                >
                                  <ul className="space-y-3">
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
                                            className="flex items-center text-base text-gray-600"
                                          >
                                            <CheckCircle className="w-6 h-6 text-[#3cd664] mr-3 flex-shrink-0" />
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
                          <h3 className="text-xl font-semibold text-gray-700 mb-4">
                            Syllabus Coming Soon
                          </h3>
                          <p className="text-gray-600 mb-4">
                            The detailed syllabus for this course is being
                            prepared and will be available soon.
                          </p>
                          <p className="text-sm text-gray-500">
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Assignment
                    </h3>
                    <div
                      className="text-base text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html:
                          course.caseStudy ||
                          "Practical assignments will be available here.",
                      }}
                    />
                  </div>
                )}

                {activeTab === "exam" && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Assessment & Certificates
                    </h3>
                    <div
                      className="text-base text-gray-600"
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Simulation & Ex.
                    </h3>
                    <p className="text-base text-gray-600">
                      Interactive simulations and experiments will be available
                      here.
                    </p>
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
                    {/* Course Thumbnail */}
                    <img
                      src={course.image || "/images/accounting.webp"}
                      alt={`${course.title} - Course Preview`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log("Image failed to load:", e);
                        console.log("Image src was:", e.currentTarget.src);
                        e.currentTarget.src = "/images/accounting.webp";
                      }}
                      onLoad={() => {
                        console.log("Course thumbnail loaded successfully!");
                      }}
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all cursor-pointer">
                        <Play className="w-10 h-10 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Enrollment */}
                <div className="p-6 border-b-2">
                  <div className="text-center text-lg text-gray-600 mb-6">
                    <p>Get access to this course in DIGITAL HUB.</p>
                    <button className="text-blue-600 hover:text-blue-800 font-semibold mt-2">
                      Compare
                    </button>
                  </div>

                  {/* Recorded Lecture Option */}
                  <div className="border-2 border-[#3cd664] rounded-xl p-3 mb-3">
                    <div className="mb-3">
                      <div className="text-center mb-2">
                        <span className="text-sm font-bold text-[#3cd664] block">
                          {course?.pricing?.recordedSession?.title?.split(
                            "+"
                          )[0] || "DIGITAL HUB+"}
                        </span>
                        <span className="text-sm font-bold text-[#3cd664] block">
                          {course?.pricing?.recordedSession?.title?.split(
                            "+"
                          )[1] || "RECORDED SESSION"}
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#3cd664]">
                          ₹
                          {course.price
                            ? course.price.toLocaleString()
                            : "10,800"}
                        </div>
                        {course.discount > 0 && (
                          <div className="text-lg text-gray-500 line-through">
                            ₹
                            {course.originalPrice
                              ? course.originalPrice.toLocaleString()
                              : "12,000"}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleDigitalHubRecordedEnrollment}
                      disabled={isEnrollingRecorded}
                      className="w-full bg-[#3cd664] hover:bg-[#33bb58] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEnrollingRecorded
                        ? "Enrolling..."
                        : course?.pricing?.recordedSession?.buttonText ||
                          "Add Digital Hub+"}
                    </button>
                  </div>

                  {/* Live Lecture Option */}
                  <div className="border-2 border-blue-500 rounded-xl p-3">
                    <div className="mb-3">
                      <div className="text-center mb-2">
                        <span className="text-sm font-bold text-blue-500 block">
                          {course?.pricing?.liveSession?.title?.split("+")[0] ||
                            "DIGITAL HUB+"}
                        </span>
                        <span className="text-sm font-bold text-blue-500 block">
                          {course?.pricing?.liveSession?.title?.split("+")[1] ||
                            "LIVE SESSION"}
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">
                          ₹
                          {course.price
                            ? (
                                course.price *
                                (course?.pricing?.liveSession
                                  ?.priceMultiplier || 1.5)
                              ).toLocaleString()
                            : "18,000"}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDigitalHubPlusEnrollment}
                      disabled={isEnrolling}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEnrolling
                        ? "Enrolling..."
                        : course?.pricing?.liveSession?.buttonText ||
                          "Add Digital Hub+"}
                    </button>
                  </div>
                </div>

                {/* Course Features */}
                <div className="p-6 border-b-2">
                  <p className="text-xl text-gray-600 mb-6 font-semibold">
                    This course includes:
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-600 text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.chapters ? course.chapters.length : 0} Lesson
                    </div>
                    <div className="bg-[#3cd664] text-white px-4 py-3 rounded-lg text-lg font-bold">
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
                    <div className="bg-blue-600 text-white px-4 py-3 rounded-lg text-lg font-bold">
                      Simulator
                    </div>
                    <div className="bg-[#3cd664] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.examCert ? "Yes" : "No."} Assignment
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.video ? "Yes" : "No"} Live Sessions
                    </div>
                    <div className="bg-[#3cd664] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.level || "Levels"}
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.category || "General"} Category
                    </div>
                    <div className="bg-[#3cd664] text-white px-4 py-3 rounded-lg text-lg font-bold">
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
                        <Clock className="w-6 h-6 text-gray-500 mr-2" />
                        <span className="text-xl font-bold text-gray-900">
                          {course.level || "Levels"}
                        </span>
                      </div>
                      <p className="text-lg text-gray-600 font-semibold">
                        Level
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <Users className="w-6 h-6 text-gray-500 mr-2" />
                        <span className="text-xl font-bold text-gray-900">
                          {course.category || "General"}
                        </span>
                      </div>
                      <p className="text-lg text-gray-600 font-semibold">
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
