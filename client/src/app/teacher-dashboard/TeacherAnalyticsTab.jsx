"use client";

import { FaChartBar, FaUsers, FaBook, FaStar, FaClock } from "react-icons/fa";

export default function TeacherAnalyticsTab({ teacher }) {
  const analytics = {
    totalStudents: 45,
    totalCourses: 6,
    avgRating: 4.8,
    totalHours: 120,
    monthlyEnrollments: [12, 15, 8, 20, 18, 25],
    coursePerformance: [
      { name: "Web Development", students: 25, rating: 4.9 },
      { name: "Data Science", students: 18, rating: 4.7 },
      { name: "Python Programming", students: 22, rating: 4.8 },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            Track your teaching performance and student engagement
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center">
                <FaUsers className="text-blue-600 text-2xl mr-4" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {analytics.totalStudents}
                  </div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center">
                <FaBook className="text-green-600 text-2xl mr-4" />
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.totalCourses}
                  </div>
                  <div className="text-sm text-gray-600">Active Courses</div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex items-center">
                <FaStar className="text-yellow-600 text-2xl mr-4" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {analytics.avgRating}
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center">
                <FaClock className="text-purple-600 text-2xl mr-4" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {analytics.totalHours}
                  </div>
                  <div className="text-sm text-gray-600">Teaching Hours</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Course Performance</h3>
              <div className="space-y-4">
                {analytics.coursePerformance.map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{course.name}</div>
                      <div className="text-sm text-gray-600">
                        {course.students} students
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{course.rating} ⭐</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Monthly Enrollments
              </h3>
              <div className="space-y-3">
                {analytics.monthlyEnrollments.map((enrollment, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-20 text-sm text-gray-600">
                      Month {index + 1}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(enrollment / 25) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm font-medium">{enrollment}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
