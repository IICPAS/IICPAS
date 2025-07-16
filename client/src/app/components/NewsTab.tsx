"use client";

import { FaThumbsUp, FaCommentAlt, FaShareAlt, FaYoutube } from "react-icons/fa";

const newsItems = [
  {
    title: "No Income Tax Up to 24 Laks!",
    date: "Jun 04 2025",
    videoUrl: "https://youtube.com/shorts/gjnoLoE_BZ4",
    content: `📑 Zero Tax upto ₹24 Lakhs Income for Professionals! 📘
Section 44ADA of Income Tax Explained (English) 🎥
Watch Now 👉 https://youtube.com/shorts/gjnoLoE_BZ4
📣 Do share this with professionals who are eligible! 
🔔 Subscribe for more such updates! ✅`,
    likes: 3,
    comments: 0,
  },
  {
    title: "🚀 Struggling to Land a Job? We've Got You Covered! 🎯",
    date: "Mar 25 2025",
    image: "/images/job-readiness.png", // replace with actual static path or public image
    content: `Join our 2-Day Job Readiness Program on 27th & 28th March and equip yourself with the essential skills to stand out.`,
    likes: 10,
    comments: 5,
  },
];

export default function NewsTab() {
  return (
    <div className="bg-white min-h-screen px-6 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">News</h2>

      <div className="space-y-8">
        {newsItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-100 rounded-xl p-5 shadow-md flex flex-col md:flex-row gap-6"
          >
            {/* Media Preview */}
            <div className="md:w-1/3 flex items-center justify-center">
              {item.videoUrl ? (
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full aspect-video bg-black flex items-center justify-center rounded-lg"
                >
                  <FaYoutube className="text-red-500 text-5xl" />
                </a>
              ) : item.image ? (
                <img
                  src={item.image}
                  alt="news"
                  className="rounded-lg object-cover w-full max-h-48"
                />
              ) : null}
            </div>

            {/* Text Content */}
            <div className="md:w-2/3 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                <span className="text-sm text-gray-500">{item.date}</span>
              </div>
              <p className="whitespace-pre-line text-gray-700 text-sm">{item.content}</p>

              {/* Reactions */}
              <div className="flex gap-4 items-center pt-2">
                <button className="flex items-center gap-1 px-3 py-1 bg-yellow-200 text-yellow-700 rounded-full">
                  <FaShareAlt />
                </button>
                <button className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  <FaThumbsUp />
                  <span>{item.likes}</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  <FaCommentAlt />
                  <span>{item.comments}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
