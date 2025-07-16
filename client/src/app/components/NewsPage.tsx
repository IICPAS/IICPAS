"use client";

import { useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaShareAlt } from "react-icons/fa";

const newsData = [
  {
    id: 1,
    title: "No Income Tax Up to 24 Laks!",
    date: "Jun 04 2025",
    videoUrl: "https://www.youtube.com/embed/gjnoLoE_BZ4",
    description: `📑 Zero Tax upto ₹24 Lakhs Income for Professionals! 📘 Section 44ADA of Income Tax Explained (English) 🎥\nWatch Now 👉 https://youtube.com/shorts/gjnoLoE_BZ4\n📣 Do share this with professionals who are eligible!\n🔔 Subscribe for more such updates! ✅`,
    likes: 3,
    dislikes: 0,
  },
  {
    id: 2,
    title: "🚀 Struggling to Land a Job? We've Got You Covered!",
    date: "Mar 25 2025",
    imageUrl: "/images/job-program.jpg", // use a valid path
    description: `Join our 2-Day Job Readiness Program on 27th & 28th March and equip yourself with the essential skills to stand out in the competitive job market.`,
    likes: 12,
    dislikes: 1,
  },
];

export default function NewsPage() {
  const [reactions, setReactions] = useState(
    newsData.map(({ likes, dislikes }) => ({ likes, dislikes }))
  );

  const handleLike = (index: number) => {
    setReactions((prev) =>
      prev.map((r, i) => (i === index ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const handleDislike = (index: number) => {
    setReactions((prev) =>
      prev.map((r, i) => (i === index ? { ...r, dislikes: r.dislikes + 1 } : r))
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-24 px-4 md:px-12 pb-16">
      <h1 className="text-3xl font-bold mb-8">News</h1>
      <div className="space-y-10">
        {newsData.map((news, index) => (
          <div
            key={news.id}
            className="bg-[#1e293b] rounded-xl p-6 shadow-xl flex flex-col md:flex-row md:items-center gap-6"
          >
            {news.videoUrl ? (
              <iframe
                className="w-full md:w-80 aspect-video rounded-md"
                src={news.videoUrl}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={news.imageUrl}
                alt="news"
                className="w-full md:w-80 rounded-md object-cover"
              />
            )}
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold leading-snug">
                  {news.title}
                </h2>
                <span className="text-sm text-gray-400">{news.date}</span>
              </div>
              <p className="text-gray-300 whitespace-pre-line text-sm">
                {news.description}
              </p>
              <div className="flex gap-4 pt-2">
                <button className="flex items-center gap-1 text-yellow-400 hover:scale-105 transition">
                  <FaShareAlt />
                </button>
                <button
                  onClick={() => handleLike(index)}
                  className="flex items-center gap-1 text-green-500 hover:scale-105 transition"
                >
                  <FaThumbsUp />
                  <span className="text-sm">{reactions[index].likes}</span>
                </button>
                <button
                  onClick={() => handleDislike(index)}
                  className="flex items-center gap-1 text-blue-400 hover:scale-105 transition"
                >
                  <FaThumbsDown />
                  <span className="text-sm">{reactions[index].dislikes}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
