"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";

export default function AboutUsSection() {
  const [aboutData, setAboutData] = useState({
    title: "About Us",
    content: "Welcome to IICPA Institute, where excellence in education meets innovation in learning.",
    mainImage: "/images/about.jpeg",
    testimonialImage: "/images/young-woman.jpg",
    testimonial: {
      text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      author: "Alisa Oliva",
      position: "Web Designer"
    },
    classSchedule: {
      title: "Our Class Day",
      days: [
        { day: "Saturday", time: "10:00-16:00" },
        { day: "Sunday", time: "10:00-16:00" },
        { day: "Monday", time: "10:00-16:00" },
        { day: "Tuesday", time: "10:00-16:00" },
        { day: "Wednesday", time: "10:00-16:00" }
      ]
    },
    button: {
      text: "Learn More About Us",
      link: "/about"
    },
    colors: {
      title: "text-green-600",
      content: "text-gray-700",
      background: "bg-white"
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/about`
        );
        if (res.data) {
          setAboutData(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch About Us content", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <section className="relative bg-white py-16 px-4 md:px-8 lg:px-12 xl:px-16 text-gray-800 overflow-hidden">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative ${aboutData.colors.background} py-16 px-4 md:px-8 lg:px-12 xl:px-16 text-gray-800 overflow-hidden`}>
      {/* Lightweight Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-green-100/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-green-100/20 to-blue-100/20 rounded-full blur-3xl animate-float-reverse"></div>
      </div>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Side - Optimized Image */}
          <div className="relative w-full lg:w-[45%] animate-fade-in-left">
            <div className="relative">
              <Image
                src={aboutData.mainImage}
                alt="Student"
                width={500}
                height={500}
                className="rounded-3xl shadow-2xl w-full h-auto border border-gray-200/50 hover:shadow-3xl transition-shadow duration-500"
              />
            </div>

            {/* Optimized Testimonial Card */}
            <div className="mt-10 lg:mt-0 absolute -top-20 lg:top-4 left-4 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 max-w-[280px] z-10 hover:scale-105 transition-transform duration-300 animate-fade-in-up animation-delay-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">&ldquo;</span>
                </div>
                <p className="text-sm italic text-gray-700 leading-relaxed">
                  {aboutData.testimonial.text}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src={aboutData.testimonialImage}
                  alt={aboutData.testimonial.author}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-gray-200"
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{aboutData.testimonial.author}</h4>
                  <p className="text-xs text-gray-500">{aboutData.testimonial.position}</p>
                </div>
              </div>
            </div>

            {/* Optimized Class Schedule Card */}
            <div className="absolute -bottom-35 lg:-bottom-16 right-0 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-4 w-[200px] shadow-xl z-10 hover:scale-105 transition-transform duration-300 animate-fade-in-up animation-delay-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📅</span>
                </div>
                <h3 className="text-base font-bold">{aboutData.classSchedule.title}</h3>
              </div>
              <ul className="text-xs space-y-1">
                {aboutData.classSchedule.days.map(
                  (schedule, index) => (
                    <motion.li
                      key={schedule.day}
                      className="flex justify-between items-center py-1 border-b border-white/20 last:border-b-0"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.02, delay: 0.01 + index * 0.005 }}
                    >
                      <span className="font-medium text-xs">{schedule.day}</span>
                      <span className="bg-white/20 px-1 py-0.5 rounded-full text-xs">{schedule.time}</span>
                    </motion.li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Right Side - Optimized Content */}
          <div className="w-full lg:w-[50%] mt-20 lg:mt-0 animate-fade-in-right">
            {/* Optimized Section Header */}
            <div className="flex items-center gap-4 mb-8 animate-fade-in-up animation-delay-100">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
              <p className={`${aboutData.colors.title} font-bold text-2xl uppercase tracking-wider`}>{aboutData.title}</p>
            </div>

            {/* Content with Optimized Styling */}
            <div className="animate-fade-in-up animation-delay-200">
              <div
                className={`prose prose-lg max-w-none ${aboutData.colors.content} leading-relaxed`}
                dangerouslySetInnerHTML={{ 
                  __html: aboutData.content.replace(
                    /<p>/g, 
                    `<p class="mb-4 ${aboutData.colors.content} leading-relaxed">`
                  )
                }}
              />
            </div>

            {/* Optimized CTA Button */}
            <div className="mt-8 animate-fade-in-up animation-delay-300">
              <button
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                onClick={() => window.location.href = aboutData.button.link}
              >
                {aboutData.button.text}
              </button>
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
          50% { transform: translateY(-15px) translateX(8px); }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(15px) translateX(-8px); }
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
        
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
      `}</style>
    </section>
  );
}
