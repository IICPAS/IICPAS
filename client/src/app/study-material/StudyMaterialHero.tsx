"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const StudyMaterialHero = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        hero: {
          title: "Study Materials",
          subtitle: "Access comprehensive study materials, notes, and resources to excel in your finance and accounting journey.",
          button1: { text: "Browse Materials", link: "#materials" },
          button2: { text: "Download Resources", link: "#download" },
          backgroundGradient: { from: "from-teal-200", via: "via-white", to: "to-blue-200" },
          textColor: "text-gray-800"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-teal-200 via-white to-blue-200 text-gray-800 py-20 mt-[16vmin]">
        <div className="max-w-lg mx-auto px-20">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2 mx-auto max-w-xs"></div>
              <div className="h-2 bg-gray-300 rounded mb-3 mx-auto max-w-lg"></div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
                <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hero = data?.hero || {
    title: "Study Materials",
    subtitle: "Access comprehensive study materials, notes, and resources to excel in your finance and accounting journey.",
    button1: { text: "Browse Materials", link: "#materials" },
    button2: { text: "Download Resources", link: "#download" },
    backgroundGradient: { from: "from-teal-200", via: "via-white", to: "to-blue-200" },
    textColor: "text-gray-800"
  };

  return (
    <div className={`bg-gradient-to-r ${hero.backgroundGradient.from} ${hero.backgroundGradient.via} ${hero.backgroundGradient.to} ${hero.textColor} py-20 mt-[16vmin]`}>
      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="text-center">
          <h1 className="text-xs font-bold mb-1">
            {hero.title}
          </h1>
          <p className="text-xs font-normal mb-2 max-w-sm mx-auto">
            {hero.subtitle}
          </p>
          <div className="flex flex-col gap-1 justify-center">
            <button 
              onClick={() => window.location.href = hero.button1.link}
              className="bg-teal-600 text-white px-2 py-0.5 rounded text-xs font-normal hover:bg-teal-700 transition-colors duration-200"
            >
              {hero.button1.text}
            </button>
            <button 
              onClick={() => window.location.href = hero.button2.link}
              className="border-2 border-teal-600 text-teal-600 px-2 py-0.5 rounded text-xs font-normal hover:bg-teal-600 hover:text-white transition-colors duration-200"
            >
              {hero.button2.text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterialHero;
