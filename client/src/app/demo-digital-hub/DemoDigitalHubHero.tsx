"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ThinHeroSection from "../components/ThinHeroSection";

interface HeroData {
  title: string;
  subtitle: string;
  button1: { text: string; link: string };
  button2: { text: string; link: string };
  backgroundGradient: { from: string; via: string; to: string };
  textColor: string;
}

interface DemoData {
  hero: HeroData;
}

const DemoDigitalHubHero = () => {
  const [data, setData] = useState<DemoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        }/api/v1/website/demo-digital-hub`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching demo digital hub data:", error);
      // Fallback to default data
      setData({
        hero: {
          title: "Demo Digital Hub",
          subtitle:
            "Explore our comprehensive course demos and get a preview of what you'll learn in our finance and accounting programs.",
          button1: { text: "Browse Demos", link: "#demos" },
          button2: { text: "Try Free Samples", link: "#samples" },
          backgroundGradient: {
            from: "from-[#afffe8]",
            via: "via-white",
            to: "to-[#b8e6ff]",
          },
          textColor: "text-gray-800",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative bg-blue-600 py-4 px-4 md:px-20 pl-8 mt-16">
        <div className="animate-pulse">
          <div className="h-8 bg-blue-400 rounded mb-2 max-w-md"></div>
          <div className="h-4 bg-blue-400 rounded max-w-xs"></div>
        </div>
      </section>
    );
  }

  const hero = data?.hero || {
    title: "Demo Digital Hub",
    subtitle:
      "Explore our comprehensive course demos and get a preview of what you'll learn in our finance and accounting programs.",
    button1: { text: "Browse Demos", link: "#demos" },
    button2: { text: "Try Free Samples", link: "#samples" },
    backgroundGradient: {
      from: "from-[#afffe8]",
      via: "via-white",
      to: "to-[#b8e6ff]",
    },
    textColor: "text-gray-800",
  };

  return (
    <ThinHeroSection title={hero.title} breadcrumb="Home // Demo Digital Hub" />
  );
};

export default DemoDigitalHubHero;
