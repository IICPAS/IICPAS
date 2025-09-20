"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const FAQHero = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/website/faq`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching FAQ data:", error);
      // Fallback to default data
      setData({
        hero: {
          title: "Frequently Asked Questions",
          subtitle: "Find answers to common questions about our courses, admissions, and services. Can't find what you're looking for? Contact us for personalized assistance.",
          button1: { text: "Contact Support", link: "/contact" },
          button2: { text: "Browse Courses", link: "/course" },
          backgroundGradient: { from: "from-blue-200", via: "via-white", to: "to-indigo-200" },
          textColor: "text-gray-800"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-200 via-white to-indigo-200 text-gray-800 py-32 mt-18">
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
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about our courses, admissions, and services. Can't find what you're looking for? Contact us for personalized assistance.",
    button1: { text: "Contact Support", link: "/contact" },
    button2: { text: "Browse Courses", link: "/course" },
    backgroundGradient: { from: "from-blue-200", via: "via-white", to: "to-indigo-200" },
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
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              {hero.button1.text}
            </button>
            <button 
              onClick={() => window.location.href = hero.button2.link}
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200"
            >
              {hero.button2.text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQHero;
