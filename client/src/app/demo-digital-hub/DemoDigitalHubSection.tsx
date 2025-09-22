"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlayCircle, FaBookOpen, FaCalculator, FaChartBar, FaFileAlt, FaVideo, FaDownload, FaEye, FaTimes } from "react-icons/fa";

const DemoDigitalHubSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const iconMap = {
    FaPlayCircle: FaPlayCircle,
    FaBookOpen: FaBookOpen,
    FaCalculator: FaCalculator,
    FaChartBar: FaChartBar,
    FaFileAlt: FaFileAlt,
    FaVideo: FaVideo,
    FaDownload: FaDownload,
    FaEye: FaEye,
  };

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
        mainSection: {
          title: "Interactive Course Demos",
          subtitle: "Experience our courses firsthand with interactive demos, sample lessons, and preview content designed to showcase our teaching methodology.",
          ctaTitle: "Ready to Experience Our Courses?",
          ctaDescription: "Join thousands of students who have discovered their potential through our comprehensive finance and accounting programs.",
          ctaButton1: { text: "Start Free Trial", link: "/student-login" },
          ctaButton2: { text: "View Course Catalog", link: "/course" }
        },
        materials: [
          {
            icon: "FaPlayCircle",
            title: "Video Demo Lessons",
            description: "Watch sample video lessons from our expert instructors covering key concepts in finance and accounting.",
            feature: "HD Quality Videos",
            link: "#video-demos"
          },
          {
            icon: "FaBookOpen",
            title: "Interactive Course Previews",
            description: "Explore interactive course modules and get a feel for our comprehensive curriculum structure.",
            feature: "Interactive Content",
            link: "#course-preview"
          },
          {
            icon: "FaCalculator",
            title: "Practice Problem Demos",
            description: "Try sample practice problems with step-by-step solutions to understand our teaching approach.",
            feature: "Step-by-Step Solutions",
            link: "#practice-demos"
          },
          {
            icon: "FaChartBar",
            title: "Case Study Samples",
            description: "Review real-world case studies and see how we apply theoretical knowledge to practical scenarios.",
            feature: "Real Industry Cases",
            link: "#case-studies"
          },
          {
            icon: "FaFileAlt",
            title: "Sample Study Materials",
            description: "Download sample notes, formula sheets, and reference materials to see the quality of our content.",
            feature: "High-Quality Materials",
            link: "#sample-materials"
          },
          {
            icon: "FaVideo",
            title: "Live Session Previews",
            description: "Experience snippets from our live interactive sessions and Q&A discussions.",
            feature: "Live Interaction",
            link: "#live-previews"
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 bg-gray-50">
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
    title: "Interactive Course Demos",
    subtitle: "Experience our courses firsthand with interactive demos, sample lessons, and preview content designed to showcase our teaching methodology.",
    ctaTitle: "Ready to Experience Our Courses?",
    ctaDescription: "Join thousands of students who have discovered their potential through our comprehensive finance and accounting programs.",
    ctaButton1: { text: "Start Free Trial", link: "/student-login" },
    ctaButton2: { text: "View Course Catalog", link: "/course" }
  };

  const handleDemoClick = (demo) => {
    setSelectedDemo(demo);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDemo(null);
  };

  const materials = data?.materials || data?.demos || [];

  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Demo Courses Showcase Section */}
        <div className="mt-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Our{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Demo Courses
              </span>
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get a preview of our comprehensive course offerings with interactive demos and sample content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {materials.map((material, index) => {
              const IconComponent = iconMap[material.icon] || FaPlayCircle;
              const colors = [
                { bg: "from-blue-500 to-purple-600", text: "text-purple-600", button: "bg-purple-600 hover:bg-purple-700" },
                { bg: "from-green-500 to-blue-600", text: "text-green-600", button: "bg-green-600 hover:bg-green-700" },
                { bg: "from-red-500 to-orange-600", text: "text-red-600", button: "bg-red-600 hover:bg-red-700" },
                { bg: "from-indigo-500 to-purple-600", text: "text-indigo-600", button: "bg-indigo-600 hover:bg-indigo-700" },
                { bg: "from-emerald-500 to-teal-600", text: "text-emerald-600", button: "bg-emerald-600 hover:bg-emerald-700" },
                { bg: "from-amber-500 to-orange-600", text: "text-amber-600", button: "bg-amber-600 hover:bg-amber-700" }
              ];
              const colorScheme = colors[index % colors.length];
              
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-r ${colorScheme.bg} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                      {material.title}
                    </div>
                    <IconComponent className={`text-2xl ${colorScheme.text} group-hover:scale-110 transition-transform`} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{material.title} Demo</h4>
                  <p className="text-gray-600 mb-4">{material.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Type:</span> {material.contentType || 'PDF'}
                    </div>
                    <button 
                      className={`${colorScheme.button} text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium`}
                      onClick={() => handleDemoClick({
                        title: `${material.title} Demo`,
                        description: material.description,
                        duration: material.contentType || 'PDF',
                        type: material.title,
                        contentFile: material.contentFile,
                        contentUrl: material.contentUrl
                      })}
                    >
                      Try Demo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Demo Content Modal */}
      {showModal && selectedDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">{selectedDemo.title}</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedDemo.type}
                  </span>
                  <span className="text-gray-600">
                    Duration: {selectedDemo.duration}
                  </span>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {selectedDemo.description}
                </p>
              </div>

              {/* Demo Content Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {selectedDemo.contentFile ? (
                  <div className="mb-4">
                    <FaFileAlt className="text-6xl text-green-500 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">
                      Demo Content Available
                    </h4>
                    <p className="text-gray-600 mb-6">
                      {selectedDemo.contentFile.name} ({selectedDemo.contentType})
                    </p>
                    <div className="bg-green-50 rounded-lg p-4 mb-6">
                      <p className="text-green-800 font-medium">
                        ✓ Content uploaded successfully
                      </p>
                      <p className="text-green-600 text-sm mt-1">
                        Click "View Content" to access the demo
                      </p>
                    </div>
                    <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium mr-4">
                      View Content
                    </button>
                  </div>
                ) : (
                  <div className="mb-4">
                    <FaFileAlt className="text-6xl text-gray-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">
                      Demo Content Preview
                    </h4>
                    <p className="text-gray-600 mb-6">
                      Upload demo content through the admin dashboard to view it here.
                    </p>
                  </div>
                )}
                
                {/* Sample content preview */}
                <div className="bg-gray-50 rounded-lg p-6 text-left">
                  <h5 className="font-semibold text-gray-800 mb-3">Sample Content Preview:</h5>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaPlayCircle className="text-blue-500" />
                      <span>Introduction to {selectedDemo.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBookOpen className="text-green-500" />
                      <span>Key Concepts and Principles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalculator className="text-purple-500" />
                      <span>Practical Examples and Exercises</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaChartBar className="text-orange-500" />
                      <span>Case Studies and Applications</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Start Full Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoDigitalHubSection;
