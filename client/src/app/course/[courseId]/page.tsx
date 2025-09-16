"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Play, Star, Clock, Users, Award, CheckCircle } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

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
    videoThumbnail: "/images/course-video-1.jpg",
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
    videoThumbnail: "/images/course-video-2.jpg",
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
    videoThumbnail: "/images/course-video-3.jpg",
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

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const [activeTab, setActiveTab] = useState("syllabus");
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  console.log("CourseDetailPage rendered with params:", params);
  const course = dummyCourses[params.courseId as keyof typeof dummyCourses];
  console.log("Found course:", course);

  // Add loading state
  if (!params.courseId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-gray-600">The course you're looking for doesn't exist.</p>
            <p className="text-sm text-gray-500 mt-2">Course ID: {params.courseId}</p>
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

  const tabs = [
    { id: "syllabus", label: "Syllabus" },
    { id: "case-studies", label: "Case Studies" },
    { id: "exam", label: "Exam & Certification" },
    { id: "schedule", label: "Live Schedule +" },
    { id: "simulation", label: "Simulation & Experiments" }
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
                <div className="inline-block bg-[#3cd664] text-white text-lg font-bold px-6 py-3 rounded-full mb-6">
                  {course.type}
                </div>

                {/* Course Title */}
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  {course.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-8 h-8 ${
                          i < Math.floor(course.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {course.rating}
                  </span>
                  <span className="text-xl text-gray-600">[{course.reviewCount}]</span>
                </div>

                {/* Description */}
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  {course.description}
                </p>

                {/* Tabs */}
                <div className="border-b-2 border-gray-200 mb-8">
                  <nav className="-mb-px flex space-x-12">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-2 border-b-4 font-bold text-lg ${
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
                    
                    <div className="space-y-4">
                      {course.syllabus.map((section, index) => (
                        <div key={index} className="border-2 border-gray-200 rounded-xl">
                          <button
                            onClick={() => toggleSection(index)}
                            className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 rounded-xl"
                          >
                            <span className="font-bold text-xl text-gray-900">{section.title}</span>
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
                                {section.topics.map((topic, topicIndex) => (
                                  <li key={topicIndex} className="flex items-center text-lg text-gray-600">
                                    <CheckCircle className="w-6 h-6 text-[#3cd664] mr-3 flex-shrink-0" />
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "case-studies" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Case Studies</h3>
                    <p className="text-gray-600">Real-world case studies will be available here.</p>
                  </div>
                )}

                {activeTab === "exam" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Exam & Certification</h3>
                    <p className="text-gray-600">Exam details and certification information will be available here.</p>
                  </div>
                )}

                {activeTab === "schedule" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Live Schedule</h3>
                    <p className="text-gray-600">Live session schedule will be available here.</p>
                  </div>
                )}

                {activeTab === "simulation" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Simulation & Experiments</h3>
                    <p className="text-gray-600">Interactive simulations and experiments will be available here.</p>
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
                  <div className="aspect-video bg-gray-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Play className="w-8 h-8 ml-1" />
                      </div>
                      <p className="text-sm">Course Preview Video</p>
                    </div>
                  </div>
                  
                  {/* Video Overlay Text */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <h3 className="text-2xl font-bold mb-4">Learn the Essentials of {course.title}!</h3>
                      <ul className="text-lg space-y-2">
                        <li>• Master {course.category.toLowerCase()} principles</li>
                        <li>• Learn practical implementation</li>
                        <li>• Get hands-on experience</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Course Features */}
                <div className="p-6 border-b-2">
                  <p className="text-xl text-gray-600 mb-6 font-semibold">This course includes:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0b1224] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.features.chapters} Chapters
                    </div>
                    <div className="bg-[#3cd664] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.features.microVideos} MicroVideos
                    </div>
                    <div className="bg-[#0b1224] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.features.caseStudies} Case Studies
                    </div>
                    <div className="bg-[#3cd664] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.features.assessments} Assessments
                    </div>
                    <div className="bg-[#0b1224] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.features.simulations} Simulations
                    </div>
                    <div className="bg-[#3cd664] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.features.experiments} Experiments
                    </div>
                    <div className="bg-[#0b1224] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.features.recordings}+ Recordings
                    </div>
                    <div className="bg-[#3cd664] text-white px-4 py-3 rounded-lg text-lg font-bold">
                      {course.features.languages} Languages
                    </div>
                  </div>
                </div>

                {/* Pricing & Enrollment */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-3xl font-bold text-[#0b1224]">Lab+ Live</span>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-[#0b1224]">₹{course.price.toLocaleString()}</div>
                      {course.originalPrice > course.price && (
                        <div className="text-lg text-gray-500 line-through">₹{course.originalPrice.toLocaleString()}</div>
                      )}
                    </div>
                  </div>

                  <button className="w-full bg-[#3cd664] hover:bg-[#33bb58] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-xl">
                    Sign Up to get Access
                  </button>

                  <div className="mt-6 text-center text-lg text-gray-600">
                    <p>Get access to this course in Lab & Lab+. Compare</p>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="p-6 bg-gray-50 border-t-2">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-6 h-6 text-gray-500 mr-2" />
                        <span className="text-xl font-bold text-gray-900">{course.duration}</span>
                      </div>
                      <p className="text-lg text-gray-600 font-semibold">Duration</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <Users className="w-6 h-6 text-gray-500 mr-2" />
                        <span className="text-xl font-bold text-gray-900">{course.students.toLocaleString()}</span>
                      </div>
                      <p className="text-lg text-gray-600 font-semibold">Students</p>
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
