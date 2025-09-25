"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Book,
  Assignment,
  Science,
  QuestionAnswer,
  Close,
  Save,
  ArrowBack,
} from "@mui/icons-material";
import { FaStar } from "react-icons/fa";
import StarRating from "./StarRating";
import { toast } from "react-hot-toast";

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
  const [viewModes, setViewModes] = useState({});
  const [courseChapters, setCourseChapters] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [courseToRate, setCourseToRate] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [courseRatings, setCourseRatings] = useState({});
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

  // Fetch student courses
  const fetchStudentCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/v1/students/isstudent`, {
        withCredentials: true,
      });

      if (response.data && response.data.student) {
        const student = response.data.student;
        setStudentId(student._id);

        if (student.course && student.course.length > 0) {
          const coursesResponse = await axios.get(
            `${API}/api/courses/student-courses/${student._id}`,
            { withCredentials: true }
          );

          if (coursesResponse.data && coursesResponse.data.courses) {
            setCourses(coursesResponse.data.courses);
            if (coursesResponse.data.courses.length > 0) {
              setSelectedCourse(coursesResponse.data.courses[0]);
              setLastAccessedCourse(coursesResponse.data.courses[0]);
            }
          }
        } else {
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
      showDemoData();
    } finally {
      setLoading(false);
    }
  };

  // Demo data fallback
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
        chapters: [
          { id: 1, name: "Basic Accounting", completion: 100 },
          { id: 2, name: "Company Creation", completion: 100 },
          { id: 3, name: "Voucher Entries", completion: 100 },
        ],
        assignments: [{ id: 1, name: "Assignment 1: Basic Principles" }],
        experiments: [{ id: 1, name: "Experiment 1: Ledger Creation" }],
        tests: [{ id: 1, name: "Basic Accounting Test", status: "Coming Soon" }],
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

  // Helpers
  const isCourseCompleted = (course) => course.overallProgress >= 80;

  const hasStudentRated = async (courseId) => {
    try {
      const response = await axios.get(
        `${API}/api/v1/course-ratings/student/${studentId}`
      );
      if (response.data.success) {
        return response.data.data.find(
          (rating) => rating.courseId._id === courseId
        );
      }
    } catch (error) {
      console.error("Error checking rating:", error);
    }
    return null;
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmittingRating(true);
    try {
      const response = await axios.post(`${API}/api/v1/course-ratings/submit`, {
        studentId,
        courseId: courseToRate._id,
        rating,
        review,
      });

      if (response.data.success) {
        toast.success("Rating submitted successfully!");
        setShowRatingModal(false);
        setRating(0);
        setReview("");
        setCourseToRate(null);
        setCourseRatings((prev) => ({
          ...prev,
          [courseToRate._id]: { rating, review, status: "pending" },
        }));
      }
    } catch (error) {
      toast.error("Failed to submit rating.");
    } finally {
      setSubmittingRating(false);
    }
  };

  const fetchChaptersForCourse = async (courseId) => {
    try {
      const response = await axios.get(`${API}/api/chapters/course/${courseId}`);
      if (response.data.success) {
        setCourseChapters((prev) => ({
          ...prev,
          [courseId]: response.data.chapters,
        }));
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  const handleDetailedToggle = (courseId) => {
    setViewModes((prev) => ({ ...prev, [courseId]: "detailed" }));
    if (!courseChapters[courseId]) {
      fetchChaptersForCourse(courseId);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading your courses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-6 pb-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600 text-lg">Continue your learning journey</p>
      </div>

      <div className="px-6 pb-6 space-y-8">
        {courses.map((course) => (
          <div key={course._id}>
            {viewModes[course._id] !== "detailed" ? (
              // Overview Card
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:scale-[1.02] transition-all">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
                  <h2 className="text-2xl font-bold">{course.title}</h2>
                </div>
                <div className="p-6">
                  <div className="flex gap-6">
                    <div className="w-64 h-40 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={
                          course.image
                            ? course.image.startsWith("http")
                              ? course.image
                              : `${API}${course.image}`
                            : "/images/a1.jpeg"
                        }
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = "/images/a1.jpeg")}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-gray-50 border p-2 text-center rounded-lg">
                          <p className="text-xs text-gray-600">Status</p>
                          <p className="text-sm font-bold text-green-600">
                            {course.status}
                          </p>
                        </div>
                        <div className="bg-gray-50 border p-2 text-center rounded-lg">
                          <p className="text-xs text-gray-600">Price</p>
                          <p className="text-sm font-bold text-purple-600">
                            ₹{course.price}
                          </p>
                        </div>
                        <div className="bg-gray-50 border p-2 text-center rounded-lg">
                          <p className="text-xs text-gray-600">Duration</p>
                          <p className="text-sm font-bold text-orange-600">
                            8 Weeks
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDetailedToggle(course._id)}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        View Course Details
                      </button>
                      {isCourseCompleted(course) &&
                        !courseRatings[course._id] && (
                          <button
                            onClick={() => {
                              setCourseToRate(course);
                              setShowRatingModal(true);
                            }}
                            className="ml-4 bg-yellow-500 text-white px-4 py-2 rounded-lg"
                          >
                            <FaStar className="inline mr-2" />
                            Rate Course
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Detailed View
              <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-pink-600 p-6 text-white flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{course.title}</h2>
                  <button
                    onClick={() =>
                      setViewModes((prev) => ({
                        ...prev,
                        [course._id]: "overview",
                      }))
                    }
                    className="p-2 bg-white/20 rounded-full"
                  >
                    <ArrowBack />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex gap-3 justify-center mb-6">
                    {["chapters", "assignments", "experiments", "tests"].map(
                      (tab) => (
                        <div
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-4 py-2 rounded-lg cursor-pointer ${
                            activeTab === tab
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {getTabIcon(tab)} {getTabLabel(tab)}
                        </div>
                      )
                    )}
                  </div>
                  <div className="h-[400px] overflow-y-auto bg-gray-50 rounded-lg p-4">
                    {activeTab === "chapters" &&
                    courseChapters[course._id] &&
                    courseChapters[course._id].length > 0 ? (
                      courseChapters[course._id].map((chapter, idx) => (
                        <div
                          key={chapter._id || idx}
                          onClick={() =>
                            router.push(
                              `/digital-hub?courseId=${course._id}&chapterId=${chapter._id}`
                            )
                          }
                          className="p-4 bg-white mb-3 rounded-lg shadow hover:shadow-md cursor-pointer"
                        >
                          <p className="font-semibold">{chapter.title}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">
                        No {activeTab} available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rating Modal */}
      {showRatingModal && courseToRate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Rate Course</h3>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              interactive
            />
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write a review..."
              className="w-full border rounded-lg p-2 mt-4"
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={submittingRating || rating === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {submittingRating ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
