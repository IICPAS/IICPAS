"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  PlayArrow,
  Visibility,
  Edit,
  Continue,
  Book,
  Assignment,
  Science,
  QuestionAnswer,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

export default function CourseTab() {
  const [studentId, setStudentId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastAccessedCourse, setLastAccessedCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("chapters");
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

  // Mock data for demonstration (copied from admin dashboard)
  const showDemoData = () => {
    const demoCourses = [
      {
        _id: "1",
        title: "Basic Accounting & Tally Foundation",
        description:
          "Comprehensive accounting course covering all aspects of modern accounting practices.",
        image: "/images/a1.jpeg",
        status: "active",
        level: "Foundation",
        overallProgress: 75,
        totalChapters: 8,
        totalAssignments: 12,
        totalExperiments: 6,
        totalTests: 5,
        chapters: [
          { id: 1, name: "Basic Accounting", completion: 100 },
          { id: 2, name: "Company Creation", completion: 100 },
          { id: 3, name: "Voucher Entries", completion: 100 },
          { id: 4, name: "Accounting Methods", completion: 60 },
          { id: 5, name: "Ledger Balances", completion: 45 },
          { id: 6, name: "Bank Reconciliation", completion: 30 },
          { id: 7, name: "Advanced Topics", completion: 20 },
          { id: 8, name: "Final Assessment", completion: 10 },
        ],
        assignments: [
          { id: 1, name: "Assignment 1: Basic Principles" },
          { id: 2, name: "Assignment 2: Company Setup" },
          { id: 3, name: "Assignment 3: Voucher Entries" },
          { id: 4, name: "Assignment 4: Ledger Management" },
          { id: 5, name: "Assignment 5: Final Project" },
        ],
        experiments: [
          { id: 1, name: "Experiment 1: Ledger Creation" },
          { id: 2, name: "Experiment 2: Balance Sheet" },
          { id: 3, name: "Experiment 3: Income Statement" },
          { id: 4, name: "Experiment 4: Cash Flow" },
        ],
        tests: [
          {
            id: 1,
            name: "Basic Accounting Test",
            status: "Coming Soon",
          },
          {
            id: 2,
            name: "Voucher Entries Test",
            status: "Coming Soon",
          },
          {
            id: 3,
            name: "Ledger Management Test",
            status: "Coming Soon",
          },
          {
            id: 4,
            name: "Final Assessment Test",
            status: "Coming Soon",
          },
          {
            id: 5,
            name: "Comprehensive Test",
            status: "Coming Soon",
          },
        ],
      },
    ];
    setCourses(demoCourses);
    setSelectedCourse(demoCourses[0]);
    setLastAccessedCourse(demoCourses[0]);
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

  const handleChapterClick = (chapterName) => {
    // Navigate to digital-hub when any chapter is clicked
    router.push("/digital-hub");
  };

  const getTabIcon = (tabName) => {
    switch (tabName) {
      case "chapters":
        return <Book />;
      case "assignments":
        return <Assignment />;
      case "experiments":
        return <Science />;
      case "tests":
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
      case "tests":
        return "Test";
      default:
        return "Chapters";
    }
  };

  const renderContentList = () => {
    if (!selectedCourse) return null;

    switch (activeTab) {
      case "chapters":
        return (
          <div className="space-y-3">
            {selectedCourse.chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="bg-gradient-to-r from-gray-100 to-gray-150 border border-gray-300 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => handleChapterClick(chapter.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-600 text-sm">
                        {chapter.id}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {chapter.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          chapter.completion === 100
                            ? "bg-green-500"
                            : chapter.completion >= 70
                            ? "bg-blue-500"
                            : chapter.completion >= 40
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                        }`}
                        style={{ width: `${chapter.completion}%` }}
                      />
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        chapter.completion === 100
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {chapter.completion}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case "assignments":
        return (
          <div className="space-y-3">
            {selectedCourse.assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Assignment className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {assignment.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Assignment {assignment.id}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case "experiments":
        return (
          <div className="space-y-3">
            {selectedCourse.experiments.map((experiment) => (
              <div
                key={experiment.id}
                className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Science className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {experiment.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Experiment {experiment.id}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case "tests":
        return (
          <div className="space-y-3">
            {selectedCourse.tests.map((test) => (
              <div
                key={test.id}
                className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <QuestionAnswer className="text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{test.name}</p>
                    <p className="text-sm text-gray-600">Test {test.id}</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    {test.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-full max-w-full mt-16">
      <div className="flex gap-4 w-full min-h-[80vh]">
        {/* Left Sidebar - Course Statistics */}
        <div className="flex-1 min-w-[250px] max-w-[25%]">
          <div className="bg-white rounded-lg shadow-lg p-6 h-full">
            {/* Course Image */}
            <div className="flex justify-center mb-6">
              <div className="w-36 h-36 rounded-lg overflow-hidden">
                <img
                  src={selectedCourse?.image}
                  alt={selectedCourse?.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Course Stats */}
            <h2 className="text-xl font-bold text-center mb-6">
              Course Statistics
            </h2>

            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">Overall Progress</p>
                  <p className="font-bold text-green-600">
                    {selectedCourse?.overallProgress}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${selectedCourse?.overallProgress || 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">Course: {selectedCourse?.title}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">Chapters</p>
                  <p className="font-bold text-blue-600">
                    {selectedCourse?.totalChapters}
                  </p>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">Assignments</p>
                  <p className="font-bold text-green-600">
                    {selectedCourse?.totalAssignments}
                  </p>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">Experiments</p>
                  <p className="font-bold text-purple-600">
                    {selectedCourse?.totalExperiments}
                  </p>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">Tests</p>
                  <p className="font-bold text-orange-600">
                    {selectedCourse?.totalTests}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-[700px] max-w-[75%]">
          <div className="bg-white rounded-lg shadow-lg p-6 h-full">
            {/* Top Navigation Tabs */}
            <div className="mb-6">
              <div className="flex gap-2 bg-gray-300 p-2 rounded-lg">
                {["chapters", "assignments", "experiments", "tests"].map(
                  (tab) => (
                    <div
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 min-w-[120px] justify-center border-2 ${
                        activeTab === tab
                          ? "bg-gray-800 shadow-md text-white font-semibold border-gray-800"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border-transparent"
                      }`}
                    >
                      {getTabIcon(tab)}
                      <span
                        className={`font-medium ${
                          activeTab === tab ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {getTabLabel(tab)}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full h-full">
              {/* Content List - Full Height */}
              <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm h-[calc(100vh-300px)] min-h-[500px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 scrollbar-thumb-rounded">
                  {renderContentList()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
