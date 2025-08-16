"use client";

import { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCalendar,
  FaUsers,
} from "react-icons/fa";

export default function TeacherAssignmentsTab({ teacher }) {
  const [assignments] = useState([
    {
      id: 1,
      title: "JavaScript Fundamentals Quiz",
      course: "Web Development",
      dueDate: "2024-02-15",
      submissions: 12,
      totalStudents: 15,
      status: "active",
    },
    {
      id: 2,
      title: "Python Data Analysis Project",
      course: "Data Science",
      dueDate: "2024-02-20",
      submissions: 8,
      totalStudents: 10,
      status: "active",
    },
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Assignments
              </h2>
              <p className="text-gray-600 mt-1">
                Manage course assignments and track submissions
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <FaPlus />
              Create Assignment
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">
                    {assignment.title}
                  </h3>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {assignment.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {assignment.course}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <FaCalendar />
                  <span>
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <FaUsers />
                  <span>
                    {assignment.submissions}/{assignment.totalStudents}{" "}
                    submitted
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                    <FaEye className="inline mr-1" />
                    View
                  </button>
                  <button className="flex-1 px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                    <FaEdit className="inline mr-1" />
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
