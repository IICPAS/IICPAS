"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const CareerGuidanceHero = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/website/career-guidance`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching career guidance data:", error);
      // Fallback to default data
      setData({
        hero: {
          title: "Career Guidance",
          subtitle: "Get expert career guidance and counseling to make informed decisions about your professional future in finance and accounting.",
          button1: { text: "Book Consultation", link: "#consultation" },
          button2: { text: "Explore Career Paths", link: "#career-paths" },
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
      <div className="bg-gradient-to-r from-teal-200 via-white to-blue-200 text-gray-800 py-32 mt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-300 rounded mb-6 mx-auto max-w-md"></div>
              <div className="h-6 bg-gray-300 rounded mb-8 mx-auto max-w-3xl"></div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="h-12 bg-gray-300 rounded w-40 mx-auto"></div>
                <div className="h-12 bg-gray-300 rounded w-40 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hero = data?.hero || {
    title: "Career Guidance",
    subtitle: "Get expert career guidance and counseling to make informed decisions about your professional future in finance and accounting.",
    button1: { text: "Book Consultation", link: "#consultation" },
    button2: { text: "Explore Career Paths", link: "#career-paths" },
    backgroundGradient: { from: "from-teal-200", via: "via-white", to: "to-blue-200" },
    textColor: "text-gray-800"
  };

  return (
    <div className={`bg-gradient-to-r ${hero.backgroundGradient.from} ${hero.backgroundGradient.via} ${hero.backgroundGradient.to} ${hero.textColor} py-32 mt-18`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {hero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = hero.button1.link}
              className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-200"
            >
              {hero.button1.text}
            </button>
            <button 
              onClick={() => window.location.href = hero.button2.link}
              className="border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 hover:text-white transition-colors duration-200"
            >
              {hero.button2.text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidanceHero;
