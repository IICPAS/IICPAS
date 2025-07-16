"use client";

const course = {
  title: "Basic Accounting & Tally Foundation",
  status: "Not Certified. Finish test within lid Date",
  progress: 100,
  subtopics: [
    "Basic Accounting",
    "Company creation and data management",
    "Voucher Entries in Tally",
    "Method of Accounting",
    "Finalisation of ledger balances",
  ],
};

export default function CoursesTab() {
  return (
    <div className="min-h-[calc(100vh-80px)] overflow-y-auto px-4 py-6 space-y-6">
      {/* Course Title and Status */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-blue-800">{course.title}</h2>
            <span className="inline-block mt-2 bg-red-100 text-red-600 px-3 py-1 text-xs font-semibold rounded-full">
              {course.status}
            </span>
          </div>
          <div className="text-blue-600 font-semibold text-xl">
            <div className="w-14 h-14 rounded-full border-4 border-blue-500 flex items-center justify-center text-sm">
              {course.progress}%
            </div>
          </div>
        </div>
      </div>

      {/* Topic List */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border space-y-4">
        {course.subtopics.map((topic, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <span className="text-blue-700 font-semibold text-sm bg-blue-100 w-6 h-6 flex items-center justify-center rounded-full">
                {idx + 1}
              </span>
              <span className="text-gray-800 font-medium text-sm sm:text-base">
                {topic}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-28 bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-full" />
              </div>
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                Completed
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
