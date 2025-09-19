"use client";
import { useState, useEffect } from "react";

export default function AboutHero() {
  const [heroData, setHeroData] = useState({
    title: "About Us",
    breadcrumb: "Home // About Us"
  });

  // Fetch About Us data from backend
  useEffect(() => {
    const fetchAboutUsData = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
        const response = await fetch(`${API_BASE}/about-us`);
        
        if (response.ok) {
          const data = await response.json();
          setHeroData(data.hero);
        }
      } catch (error) {
        console.error("Error fetching about us data:", error);
        // Keep using default data if API fails
      }
    };

    fetchAboutUsData();
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-[#afffe8] via-white to-[#b8e6ff] py-16 md:py-20 px-4 md:px-20 pl-8 mt-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mt-8">
        {heroData.title}
      </h1>
      <p className="mt-2 text-sm text-gray-500 font-medium ">
        {heroData.breadcrumb}
      </p>
    </section>
  );
}
