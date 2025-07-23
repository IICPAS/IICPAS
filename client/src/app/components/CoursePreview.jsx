"use client";
import React, { useEffect, useState } from "react";

export default function CoursePreview() {
  const [courses, setCourses] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("http://localhost:8080/api/courses");
      const data = await res.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const toggle = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Course Preview</h1>

      {courses.map((course) => (
        <div
          key={course._id}
          className="border rounded-xl p-6 shadow bg-white mb-6"
        >
          <div className="text-center mb-4">
            <img
              src={`/uploads/${course.previewImage}`}
              alt={course.title}
              className="w-64 h-auto mx-auto rounded mb-2"
            />
            <h2 className="text-2xl font-bold">{course.title}</h2>
            <p className="text-gray-600 mb-2">Price: ₹{course.price}</p>
            <button
              onClick={() => toggle(course._id)}
              className="text-blue-600 text-sm"
            >
              {expanded[course._id] ? "▲ Hide Details" : "▼ View Details"}
            </button>
          </div>

          {expanded[course._id] &&
            course.subjects?.map((subject) => (
              <div
                key={subject._id}
                className="border border-gray-300 rounded-md p-4 my-3 bg-gray-50 max-w-3xl mx-auto"
              >
                <h3
                  className="font-semibold text-lg cursor-pointer"
                  onClick={() => toggle(subject._id)}
                >
                  {subject.title} {expanded[subject._id] ? "▲" : "▼"}
                </h3>

                {expanded[subject._id] &&
                  subject.chapters?.map((chapter) => (
                    <div
                      key={chapter._id}
                      className="ml-4 border border-gray-200 rounded-md p-3 my-2 bg-white max-w-2xl mx-auto"
                    >
                      <h4
                        className="font-medium cursor-pointer"
                        onClick={() => toggle(chapter._id)}
                      >
                        {chapter.title} {expanded[chapter._id] ? "▲" : "▼"}
                      </h4>

                      {expanded[chapter._id] &&
                        chapter.subchapters?.map((subchapter) => (
                          <div
                            key={subchapter._id}
                            className="ml-4 border border-gray-100 rounded-md p-3 my-2 bg-gray-50 max-w-2xl mx-auto"
                          >
                            <h5
                              className="font-semibold text-sm cursor-pointer"
                              onClick={() => toggle(subchapter._id)}
                            >
                              {subchapter.title}{" "}
                              {expanded[subchapter._id] ? "▲" : "▼"}
                            </h5>

                            {expanded[subchapter._id] &&
                              subchapter.topics?.map((topic) => (
                                <div
                                  key={topic._id}
                                  className="ml-4 border border-gray-100 rounded-md p-3 my-2 bg-white max-w-2xl mx-auto"
                                >
                                  <h6
                                    className="text-sm font-bold cursor-pointer text-blue-800"
                                    onClick={() => toggle(topic._id)}
                                  >
                                    {topic.title}{" "}
                                    {expanded[topic._id] ? "▲" : "▼"}
                                  </h6>

                                  {expanded[topic._id] &&
                                    topic.contents?.map((html, idx) => (
                                      <div
                                        key={idx}
                                        className="mt-3 prose prose-sm max-w-none bg-yellow-400 pl-2"
                                        dangerouslySetInnerHTML={{
                                          __html: html,
                                        }}
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

      {/* Global style override */}
      <style jsx global>{`
        .prose img,
        .prose video,
        .prose iframe {
          display: block;
          margin: 1rem auto;

          max-width: 100%;
        }
      `}</style>
    </div>
  );
}
