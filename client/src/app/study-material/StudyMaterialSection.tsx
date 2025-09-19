"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBook, FaPlay, FaCalculator, FaFileAlt, FaChartLine, FaClipboardList } from "react-icons/fa";

const StudyMaterialSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    FaBook: FaBook,
    FaPlay: FaPlay,
    FaCalculator: FaCalculator,
    FaFileAlt: FaFileAlt,
    FaChartLine: FaChartLine,
    FaClipboardList: FaClipboardList,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/website/study-material`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching study material data:", error);
      // Fallback to default data
      setData({
        mainSection: {
          title: "Comprehensive Study Resources",
          subtitle: "Everything you need to succeed in your finance and accounting studies, all in one place.",
          ctaTitle: "Ready to Start Learning?",
          ctaDescription: "Join thousands of students who have successfully completed their finance and accounting journey with our comprehensive study materials.",
          ctaButton1: { text: "Get Started Today", link: "/student-login" },
          ctaButton2: { text: "View Sample Materials", link: "#samples" }
        },
        materials: [
          {
            icon: "FaBook",
            title: "Course Notes",
            description: "Detailed notes covering all major topics in finance, accounting, taxation, and auditing.",
            feature: "Available for all courses",
            link: "#notes"
          },
          {
            icon: "FaPlay",
            title: "Video Lectures",
            description: "High-quality video content with expert instructors explaining complex concepts.",
            feature: "HD Quality Videos",
            link: "#videos"
          },
          {
            icon: "FaCalculator",
            title: "Practice Problems",
            description: "Extensive collection of practice problems with step-by-step solutions.",
            feature: "1000+ Problems",
            link: "#problems"
          },
          {
            icon: "FaFileAlt",
            title: "Reference Books",
            description: "Curated list of recommended textbooks and reference materials.",
            feature: "Expert Recommended",
            link: "#books"
          },
          {
            icon: "FaChartLine",
            title: "Case Studies",
            description: "Real-world case studies to apply theoretical knowledge in practical scenarios.",
            feature: "Industry Cases",
            link: "#cases"
          },
          {
            icon: "FaClipboardList",
            title: "Formula Sheets",
            description: "Quick reference guides with all important formulas and calculations.",
            feature: "Quick Reference",
            link: "#formulas"
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4 mx-auto max-w-md"></div>
            <div className="h-6 bg-gray-300 rounded mb-12 mx-auto max-w-3xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-12 bg-gray-300 rounded mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mainSection = data?.mainSection || {
    title: "Comprehensive Study Resources",
    subtitle: "Everything you need to succeed in your finance and accounting studies, all in one place.",
    ctaTitle: "Ready to Start Learning?",
    ctaDescription: "Join thousands of students who have successfully completed their finance and accounting journey with our comprehensive study materials.",
    ctaButton1: { text: "Get Started Today", link: "/student-login" },
    ctaButton2: { text: "View Sample Materials", link: "#samples" }
  };

  const materials = data?.materials || [];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {mainSection.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {mainSection.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {materials.map((material, index) => {
            const IconComponent = iconMap[material.icon] || FaBook;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    <IconComponent className="text-4xl text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {material.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {material.description}
                  </p>
                  <div className="text-green-600 font-medium">
                    {material.feature}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {mainSection.ctaTitle}
            </h3>
            <p className="text-gray-600 mb-6">
              {mainSection.ctaDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = mainSection.ctaButton1.link}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
              >
                {mainSection.ctaButton1.text}
              </button>
              <button 
                onClick={() => window.location.href = mainSection.ctaButton2.link}
                className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors duration-200"
              >
                {mainSection.ctaButton2.text}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterialSection;
