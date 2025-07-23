"use client";
import React, { useEffect, useState } from "react";

export default function CoursePreview() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("/api/v1/courses");
      const data = await res.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Course Preview</h1>

      {courses.map((course) => (
        <div
          key={course._id}
          className="mb-10 p-4 border rounded shadow bg-white"
        >
          <img
            src={`/uploads/${course.previewImage}`}
            alt={course.title}
            className="w-full max-w-lg mx-auto mb-4 rounded"
          />
          <h2 className="text-xl font-semibold text-center">{course.title}</h2>
          <p className="text-center text-gray-600">Price: ₹{course.price}</p>

          {/* Subjects */}
          {course.subjects?.map((subject) => (
            <div key={subject._id} className="mt-6 pl-4 border-l-2">
              <h3 className="text-lg font-semibold">{subject.title}</h3>

              {/* Chapters */}
              {subject.chapters?.map((chapter) => (
                <div key={chapter._id} className="ml-4 mt-2">
                  <h4 className="font-medium text-gray-800">{chapter.title}</h4>

                  {/* Subchapters */}
                  {chapter.subchapters?.map((subchapter) => (
                    <div key={subchapter._id} className="ml-4 mt-1">
                      <h5 className="text-sm font-semibold text-gray-700">
                        {subchapter.title}
                      </h5>

                      {/* Topics */}
                      {subchapter.topics?.map((topic) => (
                        <div
                          key={topic._id}
                          className="ml-4 mt-2 border-l pl-3"
                        >
                          <h6 className="text-sm text-gray-800 font-bold mb-1">
                            {topic.title}
                          </h6>

                          {/* Content blocks */}
                          {topic.contents?.map((html, idx) => (
                            <div
                              key={idx}
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: html }}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
