"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaGraduationCap, FaUsers, FaPlay, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function WhyIICPA() {
  const [whyIICPAData, setWhyIICPAData] = useState({
    title: "Empowering Your Future with Excellence",
    subtitle: "Why Choose IICPA",
    description: "IICPA Institute stands as a beacon of educational excellence, offering cutting-edge courses designed to transform your career aspirations into reality. Our comprehensive curriculum, expert instructors, and industry-aligned programs ensure you receive world-class education that prepares you for the dynamic professional landscape.",
    image: "/images/img1.jpg",
    statistics: {
      courses: {
        number: "50+",
        label: "Courses",
        description: "Comprehensive courses covering accounting, finance, and professional development"
      },
      students: {
        number: "10K+",
        label: "Students",
        description: "Successful graduates building successful careers across industries"
      },
      successRate: {
        number: "98%",
        label: "Success Rate"
      }
    },
    features: [
      "Industry-Expert Instructors",
      "Flexible Learning Schedule",
      "Practical Hands-on Training",
      "Career Placement Support"
    ],
    buttons: {
      exploreCourses: {
        text: "Explore Our Courses",
        link: "/courses"
      },
      learnMore: {
        text: "Learn More About IICPA",
        link: "/about"
      }
    },
    colors: {
      title: "text-white",
      subtitle: "text-green-400",
      description: "text-white/70",
      background: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWhyIICPAData();
  }, []);

  const fetchWhyIICPAData = async () => {
    try {
      const response = await fetch("/api/why-iicpa");
      if (response.ok) {
        const data = await response.json();
        setWhyIICPAData(data);
      }
    } catch (error) {
      console.error("Error fetching WhyIICPA data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative py-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }
  return (
    <section className={`relative py-12 ${whyIICPAData.colors.background} overflow-hidden`}>
      {/* Lightweight Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-green-400/10 to-blue-500/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-2xl animate-float-gentle"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Optimized Image */}
          <div className="relative animate-fade-in-left">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-shadow duration-500">
              <img
                src={whyIICPAData.image}
                alt="IICPA Students Learning"
                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
              />
                
                {/* 3D Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                {/* Optimized stats card */}
                <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/20 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-3 hover:rotate-12 transition-transform duration-300">
                      <FaGraduationCap className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">{whyIICPAData.statistics.successRate.label}</p>
                      <p className="text-xl font-bold text-white">{whyIICPAData.statistics.successRate.number}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimized Courses Button */}
            <div className="mt-8 text-center animate-fade-in-up animation-delay-300">
              <Link
                href={whyIICPAData.buttons.exploreCourses.link}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-green-500/25 border border-white/20"
              >
                <FaGraduationCap className="text-xl" />
                {whyIICPAData.buttons.exploreCourses.text}
                <FaPlay className="text-sm" />
              </Link>
            </div>
          </div>

          {/* Right Side - Optimized Content */}
          <div className="space-y-6 animate-fade-in-right">
            {/* Section Title */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 animate-fade-in-up animation-delay-100">
                <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                <span className={`${whyIICPAData.colors.subtitle} font-semibold text-sm uppercase tracking-wider`}>
                  {whyIICPAData.subtitle}
                </span>
              </div>
              
              <h2 className={`text-3xl lg:text-4xl font-bold ${whyIICPAData.colors.title} leading-tight animate-fade-in-up animation-delay-200`}>
                {whyIICPAData.title}
              </h2>
            </div>

            {/* Description */}
            <p className={`text-base ${whyIICPAData.colors.description} leading-relaxed animate-fade-in-up animation-delay-300`}>
              {whyIICPAData.description}
            </p>

            {/* Optimized Statistics Boxes */}
            <div className="grid grid-cols-2 gap-6">
              {/* Courses Box */}
              <div className="group relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-400">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-3 hover:rotate-12 transition-transform duration-300">
                      <FaGraduationCap className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{whyIICPAData.statistics.courses.number}</h3>
                      <p className="text-blue-400 font-semibold">{whyIICPAData.statistics.courses.label}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/70">
                    {whyIICPAData.statistics.courses.description}
                  </p>
                </div>
              </div>

              {/* Students Box */}
              <div className="group relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-500">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 hover:rotate-12 transition-transform duration-300">
                      <FaUsers className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{whyIICPAData.statistics.students.number}</h3>
                      <p className="text-green-400 font-semibold">{whyIICPAData.statistics.students.label}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/70">
                    {whyIICPAData.statistics.students.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Optimized Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up animation-delay-600">
              {whyIICPAData.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 group animate-fade-in-up"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300" />
                  <span className="text-white/80 group-hover:text-white transition-colors duration-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Optimized CTA Button */}
            <div className="pt-4 animate-fade-in-up animation-delay-700">
              <Link
                href={whyIICPAData.buttons.learnMore.link}
                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold group transition-colors duration-300 hover:gap-3"
              >
                {whyIICPAData.buttons.learnMore.text}
                <FaPlay className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(20px) translateX(-10px); }
        }
        
        @keyframes floatGentle {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float-slow {
          animation: floatSlow 6s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: floatReverse 8s ease-in-out infinite;
        }
        
        .animate-float-gentle {
          animation: floatGentle 4s ease-in-out infinite;
        }
        
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-700 { animation-delay: 0.7s; }
      `}</style>
    </section>
  );
}
