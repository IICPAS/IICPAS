"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  showDeleteConfirmation,
  showSuccess,
  showError,
} from "@/utils/sweetAlert";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaUsers,
  FaClock,
  FaStar,
} from "react-icons/fa";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function TeacherCoursesTab({ teacher }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [teacher]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/v1/teachers/profile`, {
        withCredentials: true,
      });
      setCourses(response.data.teacher.courses || []);
    } catch (err) {
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const confirmed = await showDeleteConfirmation("course");

    if (confirmed) {
      try {
        await axios.delete(`${API_BASE}/api/courses/${courseId}`, {
          withCredentials: true,
        });
        fetchCourses();
        showSuccess("Deleted!", "Course has been deleted.");
      } catch (error) {
        console.error("Error deleting course:", error);
        showError("Error!", "Failed to delete course.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                My Courses
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your courses and track student progress
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPlus />
              Add Course
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {courses.length}
              </div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {courses.filter((course) => course.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active Courses</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {courses.reduce(
                  (total, course) => total + (course.students?.length || 0),
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {courses.reduce(
                  (total, course) => total + (course.rating || 0),
                  0
                ) / Math.max(courses.length, 1)}
              </div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No courses yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start by creating your first course to share your knowledge with
            students.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mx-auto"
          >
            <FaPlus />
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Course Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">📚</div>
                  <h3 className="font-semibold">{course.title}</h3>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {course.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      course.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {course.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description || "No description available"}
                </p>

                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-600">
                      {course.chapters?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500">Chapters</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">
                      {course.students?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500">Students</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-yellow-600">
                      {course.rating || 0}
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>

                {/* Course Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    <FaEye />
                    View
                  </button>
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Course</h3>
            <p className="text-gray-600 mb-4">
              This feature will be implemented to allow teachers to create new
              courses.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedCourse.title}</h3>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">
                  {selectedCourse.description || "No description available"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Chapters</h4>
                  <p className="text-gray-600">
                    {selectedCourse.chapters?.length || 0} chapters
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Students</h4>
                  <p className="text-gray-600">
                    {selectedCourse.students?.length || 0} enrolled
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Rating</h4>
                  <p className="text-gray-600">
                    {selectedCourse.rating || 0}/5
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                  <p className="text-gray-600">
                    {selectedCourse.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
