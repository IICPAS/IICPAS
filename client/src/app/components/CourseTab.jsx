"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CourseTab() {
  const [studentId, setStudentId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchStudentAndCourses = async () => {
      try {
        const res = await axios.get(`${API}/api/v1/students/isstudent`, {
          withCredentials: true,
        });
        const student = res.data.student;
        setStudentId(student._id);

        const courseRes = await axios.get(
          `${API}/api/v1/students/list-courses/${student._id}`,
          { withCredentials: true }
        );
        setCourses(courseRes.data.courses || []);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentAndCourses();
  }, []);

  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen">
      {courses.length === 0 ? (
        <div className="text-center text-gray-500 text-lg font-medium mt-10">
          You are not enrolled in any courses yet.
        </div>
      ) : (
        courses.map((course) => (
          <div
            key={course._id}
            className="mb-10 p-6 bg-white shadow-md rounded-md border border-gray-200"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-700">
                {course.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 rounded-full border-4 border-blue-600 flex items-center justify-center text-sm font-bold text-blue-600">
                  100%
                </span>
              </div>
            </div>

            <p className="text-sm text-red-600 font-semibold mb-4">
              Not Certified. Finish test within lid Date
            </p>

            {course.chapters?.length > 0 ? (
              <div className="space-y-3">
                {course.chapters.map((chapter, idx) => (
                  <div
                    key={chapter._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-100 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-700 font-bold w-6 h-6 rounded-full flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <span className="font-medium">{chapter.title}</span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <div className="w-24 bg-white rounded-full h-2.5 border border-blue-300">
                        <div className="bg-blue-600 h-2.5 w-full rounded-full" />
                      </div>
                      <span className="text-green-600 text-sm font-semibold">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No chapters added to this course yet.
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
