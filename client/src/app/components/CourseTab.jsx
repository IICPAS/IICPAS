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
  Add,
  Save,
  Close,
  ArrowBack,
} from "@mui/icons-material";

export default function CourseTab() {
  const [studentId, setStudentId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastAccessedCourse, setLastAccessedCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("chapters");
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("");
  const [formData, setFormData] = useState({});
  const [viewMode, setViewMode] = useState("overview"); // "overview" or "detailed"
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

  // Fetch student courses from database
  const fetchStudentCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/v1/students/isstudent`, {
        withCredentials: true,
      });

      if (response.data && response.data.student) {
        const student = response.data.student;
        setStudentId(student._id);

        // Fetch enrolled courses
        if (student.course && student.course.length > 0) {
          const coursesResponse = await axios.get(
            `${API}/api/courses/student-courses/${student._id}`,
            {
              withCredentials: true,
            }
          );

          if (coursesResponse.data && coursesResponse.data.courses) {
            setCourses(coursesResponse.data.courses);
            if (coursesResponse.data.courses.length > 0) {
              setSelectedCourse(coursesResponse.data.courses[0]);
              setLastAccessedCourse(coursesResponse.data.courses[0]);
            }
          }
        } else {
          // If no enrolled courses, fetch all available courses
          const allCoursesResponse = await axios.get(`${API}/api/courses/all`);

          if (allCoursesResponse.data) {
            setCourses(allCoursesResponse.data);
            if (allCoursesResponse.data.length > 0) {
              setSelectedCourse(allCoursesResponse.data[0]);
              setLastAccessedCourse(allCoursesResponse.data[0]);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Fallback to demo data if API fails
      showDemoData();
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration (fallback)
  const showDemoData = () => {
    const demoCourses = [
      {
        _id: "1",
        title: "Basic Accounting & Tally Foundation",
        description:
          "Comprehensive accounting course covering all aspects of modern accounting practices.",
        image: "/images/a1.jpeg",
        status: "Active",
        level: "Foundation",
        price: 999,
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
    fetchStudentCourses();
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

  const handleAddNew = (type) => {
    setFormType(type);
    setFormData({});
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would submit the form data to your backend
      console.log("Submitting form data:", { type: formType, data: formData });

      // For now, just close the form
      setShowForm(false);
      setFormData({});

      // You could add a success message here
      alert(`${formType} added successfully!`);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
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
        return "Chapter";
      case "assignments":
        return "Assign";
      case "experiments":
        return "Exp";
      case "tests":
        return "Conf";
      default:
        return "Chapter";
    }
  };

  const renderForm = () => {
    if (!showForm) return null;

    const formFields = {
      test: [
        { name: "title", label: "Test Title", type: "text", required: true },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: true,
        },
        {
          name: "duration",
          label: "Duration (minutes)",
          type: "number",
          required: true,
        },
        {
          name: "totalQuestions",
          label: "Total Questions",
          type: "number",
          required: true,
        },
      ],
      database: [
        {
          name: "title",
          label: "Database Title",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: true,
        },
        {
          name: "type",
          label: "Database Type",
          type: "select",
          options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
          required: true,
        },
        {
          name: "difficulty",
          label: "Difficulty Level",
          type: "select",
          options: ["Beginner", "Intermediate", "Advanced"],
          required: true,
        },
      ],
      assignment: [
        {
          name: "title",
          label: "Assignment Title",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: true,
        },
        { name: "dueDate", label: "Due Date", type: "date", required: true },
        {
          name: "maxScore",
          label: "Maximum Score",
          type: "number",
          required: true,
        },
      ],
    };

    const fields = formFields[formType] || [];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Add New {formType.charAt(0).toUpperCase() + formType.slice(1)}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Close />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.name]: e.target.value })
                    }
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.name]: e.target.value })
                    }
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.name]: e.target.value })
                    }
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Save className="inline mr-2" />
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderContentList = () => {
    if (!selectedCourse) return null;

    switch (activeTab) {
      case "chapters":
        return (
          <div className="space-y-3">
            {selectedCourse.chapters && selectedCourse.chapters.length > 0 ? (
              selectedCourse.chapters.map((chapter, index) => (
                <div
                  key={chapter._id || index}
                  className="bg-gradient-to-r from-gray-100 to-gray-150 border border-gray-300 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() =>
                    handleChapterClick(chapter.title || chapter.name)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600 text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {chapter.title || chapter.name}
                        </p>
                        {chapter.description && (
                          <p className="text-sm text-gray-600">
                            {chapter.description}
                          </p>
                        )}
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
                          style={{ width: `${chapter.completion || 0}%` }}
                        />
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          (chapter.completion || 0) === 100
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {chapter.completion || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Book className="mx-auto mb-4 text-4xl text-gray-300" />
                <p>No chapters available for this course.</p>
              </div>
            )}
          </div>
        );
      case "assignments":
        return (
          <div className="space-y-3">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Course Assignments</h3>
            </div>

            {selectedCourse.assignments &&
            selectedCourse.assignments.length > 0 ? (
              selectedCourse.assignments.map((assignment, index) => (
                <div
                  key={assignment._id || index}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Assignment className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {assignment.title || assignment.name}
                      </p>
                      {assignment.description && (
                        <p className="text-sm text-gray-600">
                          {assignment.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Assignment {index + 1}
                      </p>
                    </div>
                    <button className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors">
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Assignment className="mx-auto mb-4 text-4xl text-gray-300" />
                <p>No assignments available for this course.</p>
              </div>
            )}
          </div>
        );
      case "experiments":
        return (
          <div className="space-y-3">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Course Experiments</h3>
            </div>

            {selectedCourse.experiments &&
            selectedCourse.experiments.length > 0 ? (
              selectedCourse.experiments.map((experiment, index) => (
                <div
                  key={experiment._id || index}
                  className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Science className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {experiment.title || experiment.name}
                      </p>
                      {experiment.description && (
                        <p className="text-sm text-gray-600">
                          {experiment.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Experiment {index + 1}
                      </p>
                    </div>
                    <button className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 transition-colors">
                      Start
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Science className="mx-auto mb-4 text-4xl text-gray-300" />
                <p>No experiments available for this course.</p>
              </div>
            )}
          </div>
        );
      case "tests":
        return (
          <div className="space-y-3">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Course Tests</h3>
            </div>

            {selectedCourse.tests && selectedCourse.tests.length > 0 ? (
              selectedCourse.tests.map((test, index) => (
                <div
                  key={test._id || index}
                  className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <QuestionAnswer className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {test.title || test.name}
                      </p>
                      {test.description && (
                        <p className="text-sm text-gray-600">
                          {test.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">Test {index + 1}</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      {test.status || "Coming Soon"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <QuestionAnswer className="mx-auto mb-4 text-4xl text-gray-300" />
                <p>No tests available for this course.</p>
              </div>
            )}
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
      {/* Course Display with State Switching */}
      <div className="space-y-8">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {viewMode === "overview" ? (
              // State 1: Course Overview
              <div className="p-6">
                {/* Course Name at Top of White Card */}
                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center w-full">
                  {course.title}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Side - Course Image Only */}
                  <div className="space-y-6">
                    {/* Course Image */}
                    <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                      <div className="w-96 h-64 rounded-lg overflow-hidden bg-gray-200">
                        <img
                          src={
                            course.image
                              ? `${API}${course.image}`
                              : "/images/a1.jpeg"
                          }
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Course Stats */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Overall Progress:</span>
                        <span className="font-semibold text-green-600">
                          {course.overallProgress || 0}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Level:</span>
                        <span className="font-semibold text-blue-600">
                          {course.level}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-semibold text-green-600">
                          {course.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold text-purple-600">
                          ₹{course.price}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Button */}
                    <button
                      onClick={() => setViewMode("detailed")}
                      className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Detailed
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // State 2: Course Detailed View
              <div className="p-6">
                {/* Course Name at Top of White Card */}
                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center w-full">
                  {course.title}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Side - Course Image Only */}
                  <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                    <div className="w-96 h-64 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={
                          course.image
                            ? `${API}${course.image}`
                            : "/images/a1.jpeg"
                        }
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Right Side - Tabs + Content */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    {/* Tab Navigation */}
                    <div className="flex gap-2 bg-gray-200 p-2 rounded-lg mb-6">
                      {["chapters", "assignments", "experiments", "tests"].map(
                        (tab) => (
                          <div
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 min-w-[100px] justify-center border-2 ${
                              activeTab === tab
                                ? "bg-blue-600 shadow-md text-white font-semibold border-blue-600"
                                : "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-transparent"
                            }`}
                          >
                            {getTabIcon(tab)}
                            <span
                              className={`font-medium ${
                                activeTab === tab
                                  ? "text-white"
                                  : "text-gray-700"
                              }`}
                            >
                              {getTabLabel(tab)}
                            </span>
                          </div>
                        )
                      )}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-lg p-6 h-[300px] overflow-y-auto">
                      {renderContentList()}
                    </div>

                    {/* Back Button */}
                    <button
                      onClick={() => setViewMode("overview")}
                      className="w-full mt-6 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <ArrowBack />
                      Back to Course Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {renderForm()}
    </div>
  );
}
