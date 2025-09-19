"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserTie, FaChartBar, FaFileAlt, FaClipboardCheck, FaUsers, FaHandshake } from "react-icons/fa";

const CareerGuidanceSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    FaUserTie: FaUserTie,
    FaChartBar: FaChartBar,
    FaFileAlt: FaFileAlt,
    FaClipboardCheck: FaClipboardCheck,
    FaUsers: FaUsers,
    FaHandshake: FaHandshake,
  };

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
        mainSection: {
          title: "Comprehensive Career Services",
          subtitle: "From career planning to job placement, we provide end-to-end support for your professional journey.",
          ctaTitle: "Ready to Advance Your Career?",
          ctaDescription: "Join thousands of professionals who have successfully advanced their careers with our expert guidance and support.",
          ctaButton1: { text: "Schedule Consultation", link: "/contact" },
          ctaButton2: { text: "View Success Stories", link: "#success-stories" }
        },
        services: [
          {
            icon: "FaUserTie",
            title: "Career Counseling",
            description: "One-on-one sessions with experienced career counselors to help you choose the right path.",
            feature: "Personalized Guidance",
            link: "#counseling"
          },
          {
            icon: "FaChartBar",
            title: "Industry Insights",
            description: "Stay updated with the latest trends, opportunities, and requirements in the finance industry.",
            feature: "Market Updates",
            link: "#insights"
          },
          {
            icon: "FaFileAlt",
            title: "Resume Building",
            description: "Professional resume writing services and interview preparation to land your dream job.",
            feature: "Professional Support",
            link: "#resume"
          },
          {
            icon: "FaClipboardCheck",
            title: "Skill Assessment",
            description: "Comprehensive skill assessments to identify your strengths and areas for improvement.",
            feature: "Detailed Analysis",
            link: "#assessment"
          },
          {
            icon: "FaUsers",
            title: "Networking Opportunities",
            description: "Connect with industry professionals and alumni through our networking events and platforms.",
            feature: "Industry Connections",
            link: "#networking"
          },
          {
            icon: "FaHandshake",
            title: "Job Placement Support",
            description: "Dedicated placement support with job matching, interview scheduling, and follow-up assistance.",
            feature: "End-to-End Support",
            link: "#placement"
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
    title: "Comprehensive Career Services",
    subtitle: "From career planning to job placement, we provide end-to-end support for your professional journey.",
    ctaTitle: "Ready to Advance Your Career?",
    ctaDescription: "Join thousands of professionals who have successfully advanced their careers with our expert guidance and support.",
    ctaButton1: { text: "Schedule Consultation", link: "/contact" },
    ctaButton2: { text: "View Success Stories", link: "#success-stories" }
  };

  const services = data?.services || [];

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
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || FaUserTie;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    <IconComponent className="text-4xl text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="text-blue-600 font-medium">
                    {service.feature}
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
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                {mainSection.ctaButton1.text}
              </button>
              <button 
                onClick={() => window.location.href = mainSection.ctaButton2.link}
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200"
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

export default CareerGuidanceSection;
