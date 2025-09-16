"use client";

import React, { useState, use, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Play, Star, Clock, Users, Award, CheckCircle } from "lucide-react";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
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
    description: "Tally Foundation Course covers in-depth knowledge to meet all the accounting requirements of the industry with learning exposure on Voucher Entries, Grouping, BRS, etc. We not only teach the concepts but also help you learn how you can practically implement those concepts in your day to day Accounting Process with practical examples and entries in Tally.",
    image: "/images/course-1.jpg",
    videoThumbnail: "/images/accounting.webp",
    syllabus: [
      {
        title: "Basic Accounting",
        topics: [
          "Introduction to Accounting",
          "Accounting Principles",
          "Double Entry System",
          "Journal Entries"
        ]
      },
      {
        title: "Company creation and data management",
        topics: [
          "Creating Company in Tally",
          "Company Configuration",
          "Data Backup & Restore",
          "Multi-Company Setup"
        ]
      },
      {
        title: "Voucher Entries in Tally",
        topics: [
          "Sales Voucher",
          "Purchase Voucher",
          "Payment Voucher",
          "Receipt Voucher",
          "Journal Voucher"
        ]
      },
      {
        title: "Concept of Dual Entry",
        topics: [
          "Debit and Credit Rules",
          "Trial Balance",
          "Profit & Loss Account",
          "Balance Sheet"
        ]
      },
      {
        title: "Finalisation of ledger balances",
        topics: [
          "Ledger Creation",
          "Balance Confirmation",
          "Reconciliation Process",
          "Year-end Procedures"
        ]
      },
      {
        title: "Bank Reconciliation Statement",
        topics: [
          "BRS Concepts",
          "Bank Statement Analysis",
          "Reconciliation Process",
          "Common Discrepancies"
        ]
      }
    ],
    features: {
      chapters: 7,
      microVideos: 28,
      caseStudies: 16,
      assessments: 89,
      simulations: 0,
      experiments: 30,
      recordings: 10,
      languages: 15
    },
    duration: "40 hours",
    level: "Foundation",
    students: 1250
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
    description: "Comprehensive HR certification course covering recruitment, employee relations, performance management, and HR analytics. Learn practical HR skills with real-world case studies and industry best practices.",
    image: "/images/course-2.jpg",
    videoThumbnail: "/images/young-woman.jpg",
    syllabus: [
      {
        title: "HR Fundamentals",
        topics: [
          "Introduction to Human Resources",
          "HR Roles and Responsibilities",
          "HR Strategy and Planning",
          "Legal Framework"
        ]
      },
      {
        title: "Recruitment and Selection",
        topics: [
          "Job Analysis and Design",
          "Recruitment Methods",
          "Selection Process",
          "Interview Techniques"
        ]
      },
      {
        title: "Employee Relations",
        topics: [
          "Employee Engagement",
          "Conflict Resolution",
          "Disciplinary Procedures",
          "Grievance Handling"
        ]
      },
      {
        title: "Performance Management",
        topics: [
          "Performance Appraisal",
          "Goal Setting",
          "Feedback Mechanisms",
          "Performance Improvement"
        ]
      }
    ],
    features: {
      chapters: 5,
      microVideos: 20,
      caseStudies: 12,
      assessments: 45,
      simulations: 5,
      experiments: 15,
      recordings: 8,
      languages: 12
    },
    duration: "30 hours",
    level: "Core",
    students: 890
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
    description: "Master Excel from basics to advanced level. Learn formulas, functions, data analysis, pivot tables, and automation. Perfect for accounting professionals and data analysts.",
    image: "/images/course-3.jpg",
    videoThumbnail: "/images/course.png",
    syllabus: [
      {
        title: "Excel Basics",
        topics: [
          "Interface and Navigation",
          "Data Entry and Formatting",
          "Basic Formulas",
          "Cell References"
        ]
      },
      {
        title: "Advanced Formulas",
        topics: [
          "VLOOKUP and HLOOKUP",
          "INDEX and MATCH",
          "IF Functions",
          "Array Formulas"
        ]
      },
      {
        title: "Data Analysis",
        topics: [
          "Pivot Tables",
          "Charts and Graphs",
          "Data Validation",
          "Conditional Formatting"
        ]
      },
      {
        title: "Automation",
        topics: [
          "Macros Basics",
          "VBA Introduction",
          "Automated Reports",
          "Dashboard Creation"
        ]
      }
    ],
    features: {
      chapters: 6,
      microVideos: 35,
      caseStudies: 20,
      assessments: 60,
      simulations: 8,
      experiments: 25,
      recordings: 12,
      languages: 18
    },
    duration: "35 hours",
    level: "Expert",
    students: 2100
  }
};

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const [activeTab, setActiveTab] = useState("syllabus");
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);
  
  // Fetch course data from API
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/${resolvedParams.courseId}`);
        setCourse(response.data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Course not found");
        // Fallback to dummy data if API fails
        const fallbackCourse = dummyCourses[resolvedParams.courseId as keyof typeof dummyCourses];
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-gray-600">The course you're looking for doesn't exist.</p>
            <p className="text-sm text-gray-500 mt-2">Course ID: {resolvedParams.courseId}</p>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-gray-600">The course you're looking for doesn't exist.</p>
            <p className="text-sm text-gray-500 mt-2">Course ID: {resolvedParams.courseId}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Dynamic tabs based on course data
  const tabs = [
    { id: "syllabus", label: "Syllabus" },
    { id: "case-studies", label: "Assignment" },
    { id: "exam", label: "Assessment & Certificate" },
    { id: "schedule", label: "Live Schedule +" },
    { id: "simulation", label: "Simulation & Ex." }
  ].filter(tab => {
    // Show tabs based on course content availability
    if (tab.id === "case-studies") return course.caseStudy;
    if (tab.id === "exam") return course.examCert;
    if (tab.id === "schedule") return course.video;
    return true; // Always show syllabus and simulation
  });

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
                <div className="inline-block bg-[#3cd664] text-white text-lg font-bold px-6 py-3 rounded-full mb-6">
                  {course.level || "Individual Course"}
                </div>

                {/* Course Title */}
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  {course.title}
                </h1>

                {/* Rating - Show if available */}
                {(course.rating || course.reviewCount) && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-8 h-8 ${
                            i < Math.floor(course.rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                      {course.rating || 0}
                    </span>
                    <span className="text-xl text-gray-600">[{course.reviewCount || 0}]</span>
                  </div>
                )}

                {/* Description */}
                <div 
                  className="text-xl text-gray-700 leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{ __html: course.description || "No description available." }}
                />

                {/* Tabs */}
                <div className="border-b-2 border-gray-200 mb-8">
                  <nav className="-mb-px flex space-x-4 overflow-x-auto">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-3 border-b-4 font-bold text-sm whitespace-nowrap ${
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
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-3xl font-bold text-gray-900">Course Syllabus</h3>
                      <button className="text-[#3cd664] hover:text-[#33bb58] font-bold text-lg">
                        View Full Syllabus
                      </button>
                    </div>
                    
                    {/* Dynamic syllabus from chapters */}
                    {course.chapters && course.chapters.length > 0 ? (
                      <div className="space-y-4">
                        {course.chapters.map((chapter, index) => (
                          <div key={index} className="border-2 border-gray-200 rounded-xl">
                            <button
                              onClick={() => toggleSection(index)}
                              className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 rounded-xl"
                            >
                              <span className="font-bold text-xl text-gray-900">{chapter.title}</span>
                              {expandedSections.includes(index) ? (
                                <ChevronUp className="w-8 h-8 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-8 h-8 text-gray-500" />
                              )}
                            </button>
                            
                            {expandedSections.includes(index) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-6 pb-5"
                              >
                                <ul className="space-y-3">
                                  {chapter.topics && chapter.topics.map((topic, topicIndex) => (
                                    <li key={topicIndex} className="flex items-center text-lg text-gray-600">
                                      <CheckCircle className="w-6 h-6 text-[#3cd664] mr-3 flex-shrink-0" />
                                      {topic.title}
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600">Syllabus will be available soon.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "case-studies" && (
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">Assignment</h3>
                    <div 
                      className="text-xl text-gray-600"
                      dangerouslySetInnerHTML={{ __html: course.caseStudy || "Practical assignments will be available here." }}
                    />
                  </div>
                )}

                {activeTab === "exam" && (
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">Assessment & Certificate</h3>
                    <div 
                      className="text-xl text-gray-600"
                      dangerouslySetInnerHTML={{ __html: course.examCert || "Assessment details and certificate information will be available here." }}
                    />
                  </div>
                )}

                {activeTab === "schedule" && (
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">Live Schedule</h3>
                    {course.video ? (
                      <div className="text-xl text-gray-600">
                        <p>Live session schedule will be available here.</p>
                        {course.video && (
                          <div className="mt-4">
                            <a 
                              href={course.video} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#3cd664] hover:text-[#33bb58] font-semibold"
                            >
                              Watch Live Session →
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xl text-gray-600">Live session schedule will be available here.</p>
                    )}
                  </div>
                )}

                {activeTab === "simulation" && (
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">Simulation & Ex.</h3>
                    <p className="text-xl text-gray-600">Interactive simulations and experiments will be available here.</p>
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
                    <p>Get access to this course in Lab & Lab+.</p>
                    <button className="text-blue-600 hover:text-blue-800 font-semibold mt-2">Compare</button>
                  </div>

                  {/* Recorded Lecture Option */}
                  <div className="border-2 border-[#3cd664] rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-3xl font-bold text-[#3cd664]">Recorded Lecture</span>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-[#3cd664]">
                          ₹{course.price ? course.price.toLocaleString() : "10,800"}
                        </div>
                        {course.discount > 0 && (
                          <div className="text-lg text-gray-500 line-through">
                            ₹{course.originalPrice ? course.originalPrice.toLocaleString() : "12,000"}
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="w-full bg-[#3cd664] hover:bg-[#33bb58] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-lg">
                      Add Lab
                    </button>
                  </div>

                  {/* Live Lecture Option */}
                  <div className="border-2 border-orange-500 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-3xl font-bold text-orange-500">Live Lecture</span>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-orange-500">
                          ₹{course.price ? (course.price * 1.5).toLocaleString() : "18,000"}
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-lg">
                      Add Lab+
                    </button>
                  </div>
                </div>

                {/* Course Features */}
                <div className="p-6 border-b-2">
                  <p className="text-xl text-gray-600 mb-6 font-semibold">This course includes:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0b1224] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.chapters ? course.chapters.length : 0} Chapters
                    </div>
                    <div className="bg-[#3cd664] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.chapters ? course.chapters.reduce((total, chapter) => total + (chapter.topics ? chapter.topics.length : 0), 0) : 0} Topics
                    </div>
                    <div className="bg-[#0b1224] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.caseStudy ? "Yes" : "No"} Case Studies
                    </div>
                    <div className="bg-[#3cd664] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.examCert ? "Yes" : "No"} Assessments
                    </div>
                    <div className="bg-[#0b1224] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.video ? "Yes" : "No"} Live Sessions
                    </div>
                    <div className="bg-[#3cd664] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.level || "Foundation"} Level
                    </div>
                    <div className="bg-[#0b1224] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.category || "General"} Category
                    </div>
                    <div className="bg-[#3cd664] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.discount > 0 ? `${course.discount}% OFF` : "No Discount"}
                    </div>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="p-6 bg-gray-50 border-t-2">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-6 h-6 text-gray-500 mr-2" />
                        <span className="text-xl font-bold text-gray-900">{course.level || "Foundation"}</span>
                      </div>
                      <p className="text-lg text-gray-600 font-semibold">Level</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <Users className="w-6 h-6 text-gray-500 mr-2" />
                        <span className="text-xl font-bold text-gray-900">{course.category || "General"}</span>
                      </div>
                      <p className="text-lg text-gray-600 font-semibold">Category</p>
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
