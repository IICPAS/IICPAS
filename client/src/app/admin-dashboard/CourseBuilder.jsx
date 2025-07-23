"use client";
import React, { useState } from "react";
import CoursePreviewTab from "../components/CoursePreview";
import dynamic from "next/dynamic";

// Lazy load the rich text editor
const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

export default function CourseBuilder() {
  const [course, setCourse] = useState({
    title: "",
    price: "",
    previewImage: null,
    subjects: [],
  });

  const handleChange = (path, value) => {
    const updated = { ...course };
    let obj = updated;
    for (let i = 0; i < path.length - 1; i++) {
      obj = obj[path[i]];
    }
    obj[path[path.length - 1]] = value;
    setCourse(updated);
  };

  const handleImageChange = (e) => {
    setCourse((prev) => ({
      ...prev,
      previewImage: e.target.files?.[0] || null,
    }));
  };

  const addSubject = () => {
    setCourse((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { title: "", chapters: [] }],
    }));
  };

  const addChapter = (sIdx) => {
    const updated = { ...course };
    if (!updated.subjects[sIdx].chapters) updated.subjects[sIdx].chapters = [];
    updated.subjects[sIdx].chapters.push({ title: "", subchapters: [] });
    setCourse(updated);
  };

  const addSubchapter = (sIdx, cIdx) => {
    const updated = { ...course };
    if (!updated.subjects[sIdx].chapters[cIdx].subchapters)
      updated.subjects[sIdx].chapters[cIdx].subchapters = [];
    updated.subjects[sIdx].chapters[cIdx].subchapters.push({
      title: "",
      topics: [],
    });
    setCourse(updated);
  };

  const addTopic = (sIdx, cIdx, scIdx) => {
    const updated = { ...course };
    updated.subjects[sIdx].chapters[cIdx].subchapters[scIdx].topics.push({
      title: "",
      contents: [""],
      quiz: { questions: [] },
    });
    setCourse(updated);
  };

  const addContentBlock = (sIdx, cIdx, scIdx, tIdx) => {
    const updated = { ...course };
    updated.subjects[sIdx].chapters[cIdx].subchapters[scIdx].topics[
      tIdx
    ].contents.push("");
    setCourse(updated);
  };

  const handleContentChange = (sIdx, cIdx, scIdx, tIdx, blockIdx, value) => {
    const updated = { ...course };
    updated.subjects[sIdx].chapters[cIdx].subchapters[scIdx].topics[
      tIdx
    ].contents[blockIdx] = value;
    setCourse(updated);
  };

  const handleQuizUpload = (e, sIdx, cIdx, scIdx, tIdx) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      const questions = data.map((row) => ({
        question: row.question,
        options: [row.option1, row.option2, row.option3, row.option4],
        correctAnswer: row.correctAnswer,
      }));

      const updated = { ...course };
      updated.subjects[sIdx].chapters[cIdx].subchapters[scIdx].topics[
        tIdx
      ].quiz = { questions };
      setCourse(updated);
    };
    reader.readAsBinaryString(file);
  };

  const saveCourse = async () => {
    try {
      const formData = new FormData();
      formData.append("title", course.title);
      formData.append("price", course.price);
      formData.append("subjects", JSON.stringify(course.subjects));
      if (course.previewImage) {
        formData.append("previewImage", course.previewImage);
      }

      console.log("Sending subjects:", course.subjects); // Debug
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/courses`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      alert("Course saved!");
      console.log("Saved course:", result);
    } catch (err) {
      alert("Failed to save course");
      console.error(err);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 sm:p-10 bg-gray-50 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">Create Course</h2>

        <input
          type="text"
          placeholder="Course Title"
          className="border p-3 rounded-md w-full mb-4"
          value={course.title}
          onChange={(e) => handleChange(["title"], e.target.value)}
        />

        <input
          type="number"
          placeholder="Course Price (₹)"
          className="border p-3 rounded-md w-full mb-4"
          value={course.price}
          onChange={(e) => handleChange(["price"], e.target.value)}
        />

        <div className="mb-6">
          <label className="block mb-2 font-medium">Course Banner Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="flex flex-wrap space-x-4 mb-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={addSubject}
          >
            + Add Subject
          </button>
        </div>

        {course.subjects.map((subject, sIdx) => (
          <div key={sIdx} className="mb-6 border p-4 rounded bg-white">
            <input
              type="text"
              placeholder={`Subject ${sIdx + 1} Title`}
              className="border p-2 rounded w-full mb-2"
              value={subject.title}
              onChange={(e) =>
                handleChange(["subjects", sIdx, "title"], e.target.value)
              }
            />

            <button
              className="bg-purple-600 text-white px-3 py-1 rounded mb-2"
              onClick={() => addChapter(sIdx)}
            >
              + Add Chapter
            </button>

            {subject.chapters?.map((chapter, cIdx) => (
              <div key={cIdx} className="ml-4 mt-4 border-l pl-4">
                <input
                  type="text"
                  placeholder={`Chapter ${cIdx + 1} Title`}
                  className="border p-2 rounded w-full mb-2"
                  value={chapter.title}
                  onChange={(e) =>
                    handleChange(
                      ["subjects", sIdx, "chapters", cIdx, "title"],
                      e.target.value
                    )
                  }
                />

                <button
                  className="bg-pink-500 text-white px-3 py-1 rounded mb-2"
                  onClick={() => addSubchapter(sIdx, cIdx)}
                >
                  + Add Subchapter
                </button>

                {chapter.subchapters?.map((subchapter, scIdx) => (
                  <div key={scIdx} className="ml-4 mt-4 border-l pl-4">
                    <input
                      type="text"
                      placeholder={`Subchapter ${scIdx + 1} Title`}
                      className="border p-2 rounded w-full mb-2"
                      value={subchapter.title}
                      onChange={(e) =>
                        handleChange(
                          [
                            "subjects",
                            sIdx,
                            "chapters",
                            cIdx,
                            "subchapters",
                            scIdx,
                            "title",
                          ],
                          e.target.value
                        )
                      }
                    />

                    <button
                      className="bg-yellow-600 text-white px-3 py-1 rounded mb-2"
                      onClick={() => addTopic(sIdx, cIdx, scIdx)}
                    >
                      + Add Topic
                    </button>

                    {subchapter.topics?.map((topic, tIdx) => (
                      <div key={tIdx} className="ml-4 mt-4 border-l pl-4">
                        <input
                          type="text"
                          placeholder={`Topic ${tIdx + 1} Title`}
                          className="border p-2 rounded w-full mb-2"
                          value={topic.title}
                          onChange={(e) =>
                            handleChange(
                              [
                                "subjects",
                                sIdx,
                                "chapters",
                                cIdx,
                                "subchapters",
                                scIdx,
                                "topics",
                                tIdx,
                                "title",
                              ],
                              e.target.value
                            )
                          }
                        />

                        <label className="block mb-2 text-sm font-medium">
                          Topic Content:
                        </label>
                        {topic.contents.map((content, blockIdx) => (
                          <div key={blockIdx} className="mb-4">
                            <Editor
                              value={content}
                              onChange={(val) =>
                                handleContentChange(
                                  sIdx,
                                  cIdx,
                                  scIdx,
                                  tIdx,
                                  blockIdx,
                                  val
                                )
                              }
                            />
                          </div>
                        ))}

                        <button
                          className="bg-gray-600 text-white px-3 py-1 rounded mb-3"
                          onClick={() =>
                            addContentBlock(sIdx, cIdx, scIdx, tIdx)
                          }
                        >
                          + Add Content Block
                        </button>

                        <div className="mt-4">
                          <label className="block mb-2">
                            Upload Quiz Excel
                          </label>
                          <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={(e) =>
                              handleQuizUpload(e, sIdx, cIdx, scIdx, tIdx)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        <div className="mt-10 text-right">
          <button
            className="bg-green-700 text-white px-6 py-3 text-lg rounded"
            onClick={saveCourse}
          >
            ✅ Save Course
          </button>
        </div>
      </div>
      <CoursePreviewTab />
    </>
  );
}
