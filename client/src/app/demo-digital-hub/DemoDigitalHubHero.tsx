"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const DemoDigitalHubHero = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/website/demo-digital-hub`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching demo digital hub data:", error);
      // Fallback to default data
      setData({
        hero: {
          title: "Demo Digital Hub",
          subtitle: "Explore our comprehensive course demos and get a preview of what you'll learn in our finance and accounting programs.",
          button1: { text: "Browse Demos", link: "#demos" },
          button2: { text: "Try Free Samples", link: "#samples" },
          backgroundGradient: { from: "from-[#afffe8]", via: "via-white", to: "to-[#b8e6ff]" },
          textColor: "text-gray-800"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-[#afffe8] via-white to-[#b8e6ff] py-8 md:py-12 px-4 md:px-20 pl-8 mt-28">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-300 rounded mb-4 max-w-md"></div>
          <div className="h-4 bg-gray-300 rounded max-w-xs"></div>
        </div>
      </section>
    );
  }

  const hero = data?.hero || {
    title: "Demo Digital Hub",
    subtitle: "Explore our comprehensive course demos and get a preview of what you'll learn in our finance and accounting programs.",
    button1: { text: "Browse Demos", link: "#demos" },
    button2: { text: "Try Free Samples", link: "#samples" },
    backgroundGradient: { from: "from-[#afffe8]", via: "via-white", to: "to-[#b8e6ff]" },
    textColor: "text-gray-800"
  };

  return (
    <section className={`relative bg-gradient-to-br ${hero.backgroundGradient.from} ${hero.backgroundGradient.via} ${hero.backgroundGradient.to} py-16 md:py-20 px-4 md:px-20 pl-8 mt-28`}>
      <h1 className={`text-3xl md:text-4xl font-extrabold ${hero.textColor} mt-8`}>
        {hero.title}
      </h1>
      <p className="mt-4 text-base text-gray-500 font-medium">
        Home // Demo Digital Hub
      </p>
    </section>
  );
};

export default DemoDigitalHubHero;
