import { useState } from "react";

export default function QuizUpload({ isOpen, onClose, onUpload, courses }) {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [quizType, setQuizType] = useState("Quiz");
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (!selectedCourse || !quizType || !file) {
      alert("Please fill all fields and select a file.");
      return;
    }
    // Pass data back to parent
    onUpload({ selectedCourse, quizType, file });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Upload Quiz / Revision
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">-- Select Course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Type
            </label>
            <select
              value={quizType}
              onChange={(e) => setQuizType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Quiz">Quiz</option>
              <option value="Revision Test">Revision Test</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Excel File
            </label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 shadow"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
