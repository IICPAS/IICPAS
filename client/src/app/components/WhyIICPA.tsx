"use client";

import Link from "next/link";
import { FaGraduationCap, FaUsers, FaPlay } from "react-icons/fa";
import { useEffect } from "react";

export default function WhyIICPA() {
  // Add custom movement animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes moveLeftRight {
        0%, 100% { 
          transform: translateX(0px); 
        }
        50% { 
          transform: translateX(15px); 
        }
      }
      @keyframes moveUpDown {
        0%, 100% { 
          transform: translateY(0px); 
        }
        50% { 
          transform: translateY(-10px); 
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            <div 
              className="relative overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-1000 ease-out hover:scale-105 hover:-translate-y-2 border-4 border-gray-300 hover:border-blue-500"
              style={{
                animation: 'moveLeftRight 4s ease-in-out infinite'
              }}
            >
              <img
                src="/images/img1.jpg"
                alt="IICPA Students Learning"
                className="w-full h-[500px] object-cover transform hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>


              {/* Floating stats card */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 rounded-full p-2">
                    <FaGraduationCap className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-xl font-bold text-gray-900">98%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Button */}
            <div className="mt-8 text-center">
              <Link
                href="/courses"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <FaGraduationCap className="text-xl" />
                Explore Our Courses
                <FaPlay className="text-sm" />
              </Link>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            {/* Section Title */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-1 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
                  Why Choose IICPA
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Empowering Your
                <span className="text-green-500"> Future</span> with
                <span className="text-blue-600"> Excellence</span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed">
              IICPA Institute stands as a beacon of educational excellence,
              offering cutting-edge courses designed to transform your career
              aspirations into reality. Our comprehensive curriculum, expert
              instructors, and industry-aligned programs ensure you receive
              world-class education that prepares you for the dynamic
              professional landscape.
            </p>

            {/* Statistics Boxes */}
            <div className="grid grid-cols-2 gap-6">
              {/* Courses Box */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-500 rounded-xl p-3">
                      <FaGraduationCap className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">50+</h3>
                      <p className="text-blue-600 font-semibold">Courses</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Comprehensive courses covering accounting, finance, and
                    professional development
                  </p>
                </div>
              </div>

              {/* Students Box */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-green-500 rounded-xl p-3">
                      <FaUsers className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">10K+</h3>
                      <p className="text-green-600 font-semibold">Students</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Successful graduates building successful careers across
                    industries
                  </p>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">
                  Industry-Expert Instructors
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">
                  Flexible Learning Schedule
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">
                  Practical Hands-on Training
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Career Placement Support</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold group"
              >
                Learn More About IICPA
                <FaPlay className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
