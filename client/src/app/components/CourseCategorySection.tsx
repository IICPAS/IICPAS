"use client";

import {
  FaMoneyBillWave,
  FaChartBar,
  FaPiggyBank,
  FaCalculator,
  FaWallet,
  FaBriefcase,
  FaCoins,
  FaUniversity,
} from "react-icons/fa";

const iconPool = [
  FaMoneyBillWave,
  FaChartBar,
  FaPiggyBank,
  FaCalculator,
  FaWallet,
  FaBriefcase,
  FaCoins,
  FaUniversity,
];

const categories = [
  { title: "Investment Strategies", courses: 12 },
  { title: "Stock Market Analysis", courses: 10 },
  { title: "Personal Finance", courses: 15 },
  { title: "Taxation & Compliance", courses: 8 },
  { title: "Wealth Management", courses: 11 },
  { title: "Corporate Finance", courses: 13 },
  { title: "Cryptocurrency & Blockchain", courses: 9 },
  { title: "Banking Fundamentals", courses: 14 },
];

export default function FinanceCourseCategorySection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
      {/* Title */}
      <div className="text-center mb-12">
        <p className="text-green-600 font-medium text-lg">💼 Finance</p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Build Your Career with <br />
          <span className="bg-green-500 text-white px-4 py-1 rounded-full">
            Finance & Investment Courses
          </span>
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((cat, idx) => {
          const Icon = iconPool[idx % iconPool.length];
          return (
            <div
              key={idx}
              className="relative bg-white rounded-3xl border border-gray-200 p-6 pt-12 shadow-md hover:shadow-xl transition"
            >
              {/* Icon */}
              <div className="absolute -top-6 left-6 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center text-green-600 text-xl">
                <Icon />
              </div>

              {/* Text */}
              <p className="text-green-600 font-semibold text-sm">
                {cat.courses} Courses
              </p>
              <h3 className="font-bold text-lg mt-1 text-gray-900">
                {cat.title}
              </h3>

              {/* Button */}
              <button className="mt-6 bg-[#162955] hover:bg-[#1b3778] transition text-white font-semibold text-sm px-5 py-2 rounded-full inline-flex items-center gap-2">
                View More
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
