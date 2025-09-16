"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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

interface Category {
  _id: string;
  category: string;
  status: string;
  courses?: number;
}

export default function FinanceCourseCategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        // Transform the data to include course count (mock for now)
        const transformedCategories = data.map((cat: Category, index: number) => ({
          ...cat,
          courses: Math.floor(Math.random() * 20) + 5, // Mock course count
        }));
        setCategories(transformedCategories);
      } else {
        // Fallback to mock data if API fails
        setCategories([
          { _id: "1", category: "Investment Strategies", status: "Active", courses: 12 },
          { _id: "2", category: "Stock Market Analysis", status: "Active", courses: 10 },
          { _id: "3", category: "Personal Finance", status: "Active", courses: 15 },
          { _id: "4", category: "Taxation & Compliance", status: "Active", courses: 8 },
          { _id: "5", category: "Wealth Management", status: "Active", courses: 11 },
          { _id: "6", category: "Corporate Finance", status: "Active", courses: 13 },
          { _id: "7", category: "Cryptocurrency & Blockchain", status: "Active", courses: 9 },
          { _id: "8", category: "Banking Fundamentals", status: "Active", courses: 14 },
        ]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback to mock data
      setCategories([
        { _id: "1", category: "Investment Strategies", status: "Active", courses: 12 },
        { _id: "2", category: "Stock Market Analysis", status: "Active", courses: 10 },
        { _id: "3", category: "Personal Finance", status: "Active", courses: 15 },
        { _id: "4", category: "Taxation & Compliance", status: "Active", courses: 8 },
        { _id: "5", category: "Wealth Management", status: "Active", courses: 11 },
        { _id: "6", category: "Corporate Finance", status: "Active", courses: 13 },
        { _id: "7", category: "Cryptocurrency & Blockchain", status: "Active", courses: 9 },
        { _id: "8", category: "Banking Fundamentals", status: "Active", courses: 14 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </section>
    );
  }
  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-green-100/30 to-blue-100/30 rounded-full blur-3xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-100/30 to-green-100/30 rounded-full blur-3xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Modern Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.02 }}
        >
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.02 }}
          >
            <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            <span className="text-green-600 font-bold text-lg uppercase tracking-wider">
              💼 Finance
            </span>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
          </motion.div>
          
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.02, delay: 0.01 }}
          >
            Build Your Career with{" "}
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              Finance & Investment Courses
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.02, delay: 0.01 }}
          >
            Master the art of finance with our comprehensive course categories designed for career growth
          </motion.p>
        </motion.div>

        {/* Modern Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => {
            const Icon = iconPool[idx % iconPool.length];
            return (
              <motion.div
                key={cat._id}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-6 pt-12 shadow-xl transform-gpu hover:shadow-2xl transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.02, delay: idx * 0.005 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 20
                }}
                style={{
                  transform: 'translateZ(20px)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                }}
              >
                {/* 3D Icon Container */}
                <motion.div 
                  className="absolute -top-6 left-6 w-14 h-14 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl shadow-xl flex items-center justify-center text-white text-xl transform-gpu"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5
                  }}
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    transform: 'translateZ(30px)',
                    boxShadow: '0 15px 30px -5px rgba(34, 197, 94, 0.4)'
                  }}
                >
                  <Icon />
                </motion.div>

                {/* Course Count Badge */}
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.02, delay: 0.01 + idx * 0.005 }}
                >
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 text-green-600 text-sm font-semibold px-4 py-2 rounded-full border border-green-200/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {cat.courses} Courses
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h3 
                  className="font-bold text-lg mb-4 text-gray-900 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.02, delay: 0.01 + idx * 0.005 }}
                >
                  {cat.category}
                </motion.h3>

                {/* 3D Button */}
                <motion.button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-sm px-6 py-3 rounded-2xl inline-flex items-center justify-center gap-2 shadow-lg transition-all duration-300 transform-gpu"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.02, delay: 0.01 + idx * 0.005 }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    transform: 'translateZ(10px)',
                    boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  View More
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </motion.svg>
                </motion.button>

                {/* Hover Overlay Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* View All Courses Button */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.02, delay: 0.01 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl transition-all duration-300 hover:shadow-2xl">
              Explore All Finance Courses
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </button>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-gpu { transform-style: preserve-3d; }
      `}</style>
    </section>
  );
}
