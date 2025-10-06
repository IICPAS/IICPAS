"use client";
import { useState, useEffect } from "react";
import ThinHeroSection from "../../components/ThinHeroSection";

export default function AboutHero() {
  const [heroData, setHeroData] = useState({
    title: "About Us",
    breadcrumb: "Home // About Us",
  });

  // Fetch About Us data from backend
  useEffect(() => {
    const fetchAboutUsData = async () => {
      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
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
    <ThinHeroSection title={heroData.title} breadcrumb={heroData.breadcrumb} />
  );
}
