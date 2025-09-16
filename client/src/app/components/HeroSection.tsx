"use client";

import { useState, useEffect } from "react";

export default function HeroSection() {
  const [heroData, setHeroData] = useState({
    smallText: "# Best Online Platform",
    mainHeading: {
      part1: "Start Learning",
      part2: "Today",
      part3: "Discover",
      part4: "Your Next",
      part5: "Great Skill"
    },
    description: "Enhance your educational journey with our cutting-edge course platform.",
    buttonText: "Get Started »",
    videoUrl: "/videos/homehero.mp4",
    videoFile: null,
    colors: {
      smallText: "text-green-400",
      part1: "text-white",
      part2: "text-green-400",
      part3: "text-green-400",
      part4: "text-white",
      part5: "text-blue-300",
      description: "text-white/90",
      button: "bg-green-500 hover:bg-green-600"
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await fetch("/api/hero");
      if (response.ok) {
        const data = await response.json();
        setHeroData(data);
      }
    } catch (error) {
      console.error("Error fetching hero data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroData.videoFile || heroData.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Text Content Overlay */}
      <div className="relative z-10 h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          {/* Small green text */}
          <h3 className={`${heroData.colors.smallText} font-bold text-lg mb-6 drop-shadow-lg`}>
            {heroData.smallText}
          </h3>
          
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-2xl">
            <span className={heroData.colors.part1}>{heroData.mainHeading.part1} </span>
            <span className={heroData.colors.part2}>{heroData.mainHeading.part2}</span>
            <br />
            <span className={heroData.colors.part3}>{heroData.mainHeading.part3}</span> <span className={heroData.colors.part4}>{heroData.mainHeading.part4}</span>
            <br />
            <span className={heroData.colors.part5}>{heroData.mainHeading.part5}</span>
          </h1>
          
          {/* Description */}
          <p className={`${heroData.colors.description} text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg`}>
            {heroData.description}
          </p>
          
          {/* CTA Button */}
          <button className={`${heroData.colors.button} text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105`}>
            {heroData.buttonText}
          </button>
        </div>
      </div>
    </section>
  );
}
