"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function AboutPeoplePassion() {
  const [tab, setTab] = useState<"mission" | "vision">("mission");
  const [aboutUsData, setAboutUsData] = useState({
    hero: {
      title: "About Us",
      breadcrumb: "Home // About Us"
    },
    mainContent: {
      badge: "📘 About Us",
      title: "Behind The Scenes: Discover The People & Passion",
      description: "Meet the talented individuals who bring our vision to life every day. With a shared passion and commitment, our team works tirelessly to deliver exceptional quality and innovation."
    },
    images: {
      mainImage: {
        url: "/images/girl-yellow.jpg",
        alt: "Student 1"
      },
      secondaryImage: {
        url: "/images/boy-color.jpg",
        alt: "Student 2"
      }
    },
    experienceBadge: {
      icon: "💡",
      years: "25+",
      text: "Years of experience"
    },
    mission: {
      title: "It provides tools for course creation",
      description: "Enrollment management, and tracking learner progress, ensuring a streamlined learning experience."
    },
    vision: {
      title: "Our vision is to reshape education globally",
      description: "Empowering students with quality learning through personalized technology-driven platforms."
    },
    colors: {
      primary: "text-green-600",
      secondary: "text-gray-600",
      accent: "bg-green-600"
    }
  });

  // Fetch About Us data from backend
  useEffect(() => {
    const fetchAboutUsData = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
        const response = await fetch(`${API_BASE}/about-us`);
        
        if (response.ok) {
          const data = await response.json();
          setAboutUsData(data);
        }
      } catch (error) {
        console.error("Error fetching about us data:", error);
        // Keep using default data if API fails
      }
    };

    fetchAboutUsData();
  }, []);

  return (
    <section className="bg-white py-24 px-4 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left Side - Images */}
        <div className="relative w-fit mx-auto md:mx-0 -ml-1 -mt-10 md:mt-0 md:ml-0">
          {/* Main Large Image */}
          <div className="rounded-3xl overflow-hidden shadow-xl w-[320px] md:w-[490px]">
            <Image
              src={aboutUsData.images.mainImage.url}
              alt={aboutUsData.images.mainImage.alt}
              width={490}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Overlapping Smaller Image */}
          <div className="absolute -bottom-8 -right-8 w-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src={aboutUsData.images.secondaryImage.url}
              alt={aboutUsData.images.secondaryImage.alt}
              width={224}
              height={280}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Badge */}
          <div className="absolute top-full left-4 mt-8 bg-white shadow-lg px-5 py-3 rounded-xl flex items-center gap-3 border border-gray-200">
            <span className="text-yellow-500 text-xl">{aboutUsData.experienceBadge.icon}</span>
            <div>
              <span className="text-green-600 font-bold">{aboutUsData.experienceBadge.years} </span>
              <span className="text-sm text-gray-700">{aboutUsData.experienceBadge.text}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div>
          <p className={`${aboutUsData.colors.primary} font-medium text-sm mb-3 mt-10 md:mt-0`}>
            {aboutUsData.mainContent.badge}
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {aboutUsData.mainContent.title}
          </h2>
          <p className={`${aboutUsData.colors.secondary} mb-8 text-base leading-relaxed`}>
            {aboutUsData.mainContent.description}
          </p>

          {/* Toggle Tabs */}
          <div className="flex gap-4 mb-5">
            <button
              onClick={() => setTab("mission")}
              className={`px-5 py-2 text-sm rounded-full font-semibold transition ${
                tab === "mission"
                  ? `${aboutUsData.colors.accent} text-white`
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Our Mission
            </button>
            <button
              onClick={() => setTab("vision")}
              className={`px-5 py-2 text-sm rounded-full font-semibold transition ${
                tab === "vision"
                  ? `${aboutUsData.colors.accent} text-white`
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Our Vision
            </button>
          </div>

          {/* Description Box */}
          <div className="bg-gray-50 p-6 border border-gray-200 rounded-xl shadow-sm">
            {tab === "mission" ? (
              <>
                <h4 className="font-semibold text-gray-800 mb-1">
                  {aboutUsData.mission.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {aboutUsData.mission.description}
                </p>
              </>
            ) : (
              <>
                <h4 className="font-semibold text-gray-800 mb-1">
                  {aboutUsData.vision.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {aboutUsData.vision.description}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
