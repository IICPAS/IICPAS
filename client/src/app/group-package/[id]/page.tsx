/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, use, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  Users,
  CheckCircle,
  Download,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LoginModal from "../../components/LoginModal";
import jsPDF from "jspdf";
import axios from "axios";

export default function GroupPackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [activeTab, setActiveTab] = useState("syllabus");
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [groupPackage, setGroupPackage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

  // Fetch group package data from API
  useEffect(() => {
    const fetchGroupPackage = async () => {
      if (!resolvedParams.id) {
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE}/api/group-pricing/${resolvedParams.id}`
        );
        setGroupPackage(response.data);
      } catch (error) {
        console.error("Error fetching group package:", error);
        setError("Group package not found");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupPackage();
  }, [resolvedParams.id, API_BASE]);

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
      } catch {
        setStudent(null);
      }
    };
    checkStudentAuth();
  }, [API_BASE]);

  // Handle adding group package to cart
  const handleAddToCart = async (
    packageId: string,
    sessionType: "recorded" | "live"
  ) => {
    if (!student) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE}/api/group-pricing/${packageId}/enroll`,
        { studentId: student._id, sessionType },
        { withCredentials: true }
      );

      if (response.data.success) {
        alert(
          `Group package enrolled successfully! You are now enrolled in ${response.data.data.enrolledCourses} courses.`
        );
        // Trigger a custom event to update cart in header
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        alert(
          error.response.data.message ||
            "Failed to enroll in group package. Please try again."
        );
      } else {
        alert("Failed to enroll in group package. Please try again.");
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading group package...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !groupPackage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Group Package Not Found
            </h1>
            <p className="text-gray-600">
              The group package you&apos;re looking for doesn&apos;t exist.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Package ID: {resolvedParams.id}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Group package not found
  if (!groupPackage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Group Package Not Found
            </h1>
            <p className="text-gray-600">
              The group package you&apos;re looking for doesn&apos;t exist.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Package ID: {resolvedParams.id}
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
    doc.text("Group Package Syllabus", 20, yPosition);
    yPosition += 15;

    // Add package title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`${groupPackage.level} Course Package`, 20, yPosition);
    yPosition += 20;

    // Add package description
    if (groupPackage.description) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const descriptionLines = doc.splitTextToSize(
        groupPackage.description,
        170
      );
      doc.text(descriptionLines, 20, yPosition);
      yPosition += descriptionLines.length * 6 + 10;
    }

    // Add package details
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Package Information:", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Level: ${groupPackage.level}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Courses: ${groupPackage.courseIds?.length || 0}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Price: ₹${groupPackage.groupPrice || "N/A"}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Rating: ${groupPackage.averageRating || "N/A"}/5`, 20, yPosition);
    yPosition += 15;

    // Add courses content
    if (groupPackage.courseIds && groupPackage.courseIds.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Included Courses:", 20, yPosition);
      yPosition += 10;

      groupPackage.courseIds.forEach((course: any, index: number) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        // Course title
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${course.title}`, 20, yPosition);
        yPosition += 8;

        // Course details
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Category: ${course.category}`, 30, yPosition);
        yPosition += 5;
        doc.text(`Level: ${course.level}`, 30, yPosition);
        yPosition += 5;
        doc.text(`Price: ₹${course.price}`, 30, yPosition);
        yPosition += 10;
      });
    }

    // Save the PDF
    const fileName = `${groupPackage.level}_Package_Syllabus.pdf`;
    doc.save(fileName);
  };

  // Dynamic tabs based on package data
  const tabs = [
    { id: "syllabus", label: "Syllabus" },
    { id: "pricing", label: "Pricing" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <div className="pt-48 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Package Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow-lg p-6 mb-6"
              >
                {/* Package Type Badge */}
                <div className="inline-block bg-[#3cd664] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  {groupPackage.level || "Group Package"}
                </div>

                {/* Package Title */}
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent mb-4 leading-tight">
                  {groupPackage.level} Course Package
                </h1>

                {/* Rating - Show stars with proper rating */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(groupPackage.averageRating || 4.7)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {groupPackage.averageRating || 4.7}
                  </span>
                  <span className="text-xs text-gray-600">
                    ({groupPackage.totalRatings || 0} reviews)
                  </span>
                </div>

                {/* Description */}
                <div
                  className="text-sm text-gray-700 leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{
                    __html:
                      groupPackage.description || "No description available.",
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
                        Package Syllabus
                      </h3>
                      <button
                        onClick={generateSyllabusPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Download Syllabus
                      </button>
                    </div>

                    {/* Course List with Chapters */}
                    {groupPackage.courseIds &&
                    groupPackage.courseIds.length > 0 ? (
                      <div className="space-y-4">
                        {groupPackage.courseIds.map(
                          (course: any, index: number) => (
                            <div
                              key={index}
                              className="border border-gray-100 rounded-lg shadow-md hover:scale-[1.02] transition-all duration-200"
                            >
                              <button
                                onClick={() => toggleSection(index)}
                                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg"
                              >
                                <div className="flex-1">
                                  <span className="font-semibold text-base text-gray-900 block">
                                    {course.title}
                                  </span>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-xs text-gray-500">
                                      Category: {course.category}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Level: {course.level}
                                    </span>
                                    <span className="text-xs text-green-600 font-medium">
                                      Price: ₹{course.price}
                                    </span>
                                  </div>
                                </div>
                                {expandedSections.includes(index) ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </button>

                              {expandedSections.includes(index) && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="px-4 pb-4"
                                >
                                  {/* Course Chapters */}
                                  {course.chapters &&
                                  course.chapters.length > 0 ? (
                                    <div className="mt-3">
                                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                        Course Chapters:
                                      </h4>
                                      <div className="space-y-2">
                                        {course.chapters.map(
                                          (
                                            chapter: any,
                                            chapterIndex: number
                                          ) => (
                                            <div
                                              key={chapterIndex}
                                              className="bg-gray-50 rounded-lg p-3"
                                            >
                                              <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle className="w-4 h-4 text-[#3cd664] flex-shrink-0" />
                                                <span className="font-medium text-sm text-gray-800">
                                                  {chapter.title ||
                                                    chapter.name ||
                                                    `Chapter ${
                                                      chapterIndex + 1
                                                    }`}
                                                </span>
                                              </div>
                                              {chapter.topics &&
                                                chapter.topics.length > 0 && (
                                                  <div className="ml-6 space-y-1">
                                                    {chapter.topics.map(
                                                      (
                                                        topic: any,
                                                        topicIndex: number
                                                      ) => (
                                                        <div
                                                          key={topicIndex}
                                                          className="flex items-center gap-2"
                                                        >
                                                          <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></div>
                                                          <span className="text-xs text-gray-600">
                                                            {topic.title ||
                                                              topic.name ||
                                                              topic ||
                                                              `Topic ${
                                                                topicIndex + 1
                                                              }`}
                                                          </span>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                )}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                                      <p className="text-xs text-yellow-700">
                                        No chapters available for this course
                                        yet.
                                      </p>
                                    </div>
                                  )}
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
                            No Courses Available
                          </h3>
                          <p className="text-sm text-gray-600">
                            This package doesn&apos;t contain any courses yet.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "pricing" && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Package Pricing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Recorded Session Pricing */}
                      <div className="border-2 border-[#3cd664] rounded-lg p-4">
                        <h4 className="font-bold text-[#3cd664] mb-2">
                          Recorded Sessions
                        </h4>
                        <div className="text-2xl font-bold text-[#3cd664] mb-1">
                          ₹
                          {groupPackage.pricing?.recordedSession?.finalPrice?.toLocaleString() ||
                            "N/A"}
                        </div>
                        {groupPackage.pricing?.recordedSession?.discount >
                          0 && (
                          <div className="text-sm text-gray-500 line-through">
                            ₹
                            {groupPackage.pricing?.recordedSession?.price?.toLocaleString()}
                          </div>
                        )}
                        <p className="text-xs text-gray-600 mt-2">
                          Access to all recorded sessions for{" "}
                          {groupPackage.courseIds?.length || 0} courses
                        </p>
                      </div>

                      {/* Live Session Pricing */}
                      <div className="border-2 border-blue-500 rounded-lg p-4">
                        <h4 className="font-bold text-blue-500 mb-2">
                          Live Sessions
                        </h4>
                        <div className="text-2xl font-bold text-blue-500 mb-1">
                          ₹
                          {groupPackage.pricing?.liveSession?.finalPrice?.toLocaleString() ||
                            "N/A"}
                        </div>
                        {groupPackage.pricing?.liveSession?.discount > 0 && (
                          <div className="text-sm text-gray-500 line-through">
                            ₹
                            {groupPackage.pricing?.liveSession?.price?.toLocaleString()}
                          </div>
                        )}
                        <p className="text-xs text-gray-600 mt-2">
                          Access to all live sessions for{" "}
                          {groupPackage.courseIds?.length || 0} courses
                        </p>
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
                {/* Image Section */}
                <div className="relative">
                  <div className="aspect-video bg-gray-900 relative overflow-hidden">
                    <img
                      src={
                        groupPackage?.image
                          ? groupPackage.image.startsWith("/uploads")
                            ? `${API_BASE}${groupPackage.image}`
                            : groupPackage.image
                          : "/images/a1.jpeg"
                      }
                      alt={`${
                        groupPackage?.level || "Group Package"
                      } - Package Preview`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log("Image failed, using fallback");
                        e.currentTarget.src = "/images/a1.jpeg";
                      }}
                    />
                  </div>
                </div>

                {/* Pricing & Enrollment */}
                <div className="p-6 border-b-2">
                  <div className="text-center text-sm text-gray-600 mb-6">
                    <p>Get access to this package in DIGITAL HUB.</p>
                    <button className="text-blue-600 hover:text-blue-800 font-semibold mt-2 text-sm">
                      Select Plan
                    </button>
                  </div>

                  {/* Pricing Cards - Side by Side */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {/* Recorded Session Option */}
                    <div className="border-2 border-[#3cd664] rounded-lg p-2">
                      <div className="mb-2">
                        <div className="text-center mb-1">
                          <span className="text-xs font-bold text-[#3cd664] block">
                            {groupPackage?.pricing?.recordedSession?.title ||
                              "DIGITAL HUB RECORDED SESSION"}
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-[#3cd664]">
                            ₹
                            {groupPackage?.pricing?.recordedSession?.finalPrice?.toLocaleString() ||
                              "N/A"}
                          </div>
                          {groupPackage?.pricing?.recordedSession?.discount >
                            0 && (
                            <div className="text-xs text-gray-500 line-through">
                              ₹
                              {groupPackage.pricing.recordedSession.price?.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleAddToCart(groupPackage._id, "recorded")
                        }
                        className="w-full bg-[#3cd664] hover:bg-[#33bb58] text-white font-bold py-1 px-2 rounded text-xs"
                      >
                        {groupPackage?.pricing?.recordedSession?.buttonText ||
                          "Add Digital Hub"}
                      </button>
                    </div>

                    {/* Live Session Option */}
                    <div className="border-2 border-blue-500 rounded-lg p-2">
                      <div className="mb-2">
                        <div className="text-center mb-1">
                          <span className="text-xs font-bold text-blue-500 block">
                            {groupPackage?.pricing?.liveSession?.title ||
                              "DIGITAL HUB LIVE SESSION"}
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-blue-500">
                            ₹
                            {groupPackage?.pricing?.liveSession?.finalPrice?.toLocaleString() ||
                              "N/A"}
                          </div>
                          {groupPackage?.pricing?.liveSession?.discount > 0 && (
                            <div className="text-xs text-gray-500 line-through">
                              ₹
                              {groupPackage.pricing.liveSession.price?.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleAddToCart(groupPackage._id, "live")
                        }
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
                      >
                        {groupPackage?.pricing?.liveSession?.buttonText ||
                          "Add Digital Hub+"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Package Features */}
                <div className="p-6 border-b-2">
                  <p className="text-sm text-gray-600 mb-6 font-semibold">
                    This package includes:
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold">
                      {groupPackage.courseIds?.length || 0} Courses
                    </div>
                    <div className="bg-[#3cd664] text-white px-3 py-2 rounded-lg text-sm font-bold">
                      {groupPackage.level}
                    </div>
                    <div className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold">
                      Simulator
                    </div>
                    <div className="bg-[#3cd664] text-white px-3 py-2 rounded-lg text-sm font-bold">
                      Yes Assignment
                    </div>
                    <div className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold">
                      Yes Live Sessions
                    </div>
                    <div className="bg-[#3cd664] text-white px-3 py-2 rounded-lg text-sm font-bold">
                      Group Package
                    </div>
                  </div>
                </div>

                {/* Package Stats */}
                <div className="p-6 bg-gray-50 border-t-2">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm font-bold text-gray-900">
                          {groupPackage.courseIds?.length || 0}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-semibold">
                        Courses
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-2">
                        <Users className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm font-bold text-gray-900">
                          {groupPackage.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-semibold">
                        Level
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

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          // Refresh student data after login
          window.location.reload();
        }}
      />
    </div>
  );
}
