"use client";

const liveClasses = [
  {
    title: "GST Return Filing - Batch 3",
    date: "July 17, 2025",
    time: "5:00 PM",
    status: "live",
    joinLink: "#",
    recordingLink: "",
  },
  {
    title: "Tally Ledger & Vouchers",
    date: "July 18, 2025",
    time: "3:00 PM",
    status: "upcoming",
    joinLink: "#",
    recordingLink: "",
  },
  {
    title: "Excel for Accountants",
    date: "July 14, 2025",
    time: "2:00 PM",
    status: "completed",
    joinLink: "",
    recordingLink: "#",
  },
];

export default function LiveClassTab() {
  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-8 bg-white text-black overflow-y-auto">
      <h1 className="text-2xl font-semibold mb-8">Live Classes</h1>

      {liveClasses.length === 0 ? (
        <p className="text-center text-gray-500">
          No live sessions available right now.
        </p>
      ) : (
        <div className="space-y-6">
          {liveClasses.map((cls, idx) => (
            <div
              key={idx}
              className="bg-[#f8f9fa] p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <h3 className="text-lg font-bold text-blue-800">{cls.title}</h3>
                <p className="text-sm mt-1 text-gray-700">
                  {cls.date} at {cls.time}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Status Tag */}
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    cls.status === "live"
                      ? "bg-red-100 text-red-600"
                      : cls.status === "upcoming"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                </span>

                {/* Actions */}
                {cls.status === "live" && (
                  <a
                    href={cls.joinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium"
                  >
                    Join Now
                  </a>
                )}

                {cls.status === "upcoming" && (
                  <button
                    disabled
                    className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium cursor-not-allowed"
                  >
                    Not Started
                  </button>
                )}

                {cls.status === "completed" && cls.recordingLink && (
                  <a
                    href={cls.recordingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium"
                  >
                    Watch Recording
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
