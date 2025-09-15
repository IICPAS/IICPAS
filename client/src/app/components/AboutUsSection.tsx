"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";

export default function AboutUsSection() {
  const [aboutContent, setAboutContent] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/about`
        );
        if (res.data.length > 0) {
          setAboutContent(res.data[0].content);
        }
      } catch (error) {
        console.error("Failed to fetch About Us content", error);
      }
    };

    fetchAbout();
  }, []);

  return (
    <section className="relative bg-white py-16 px-4 md:px-8 lg:px-12 xl:px-16 text-gray-800 overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-green-100/30 rounded-full blur-3xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-green-100/30 to-blue-100/30 rounded-full blur-3xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Side - 3D Image */}
          <motion.div 
            className="relative w-full lg:w-[45%]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative perspective-1000"
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                rotateY: 5,
                rotateX: 5,
                scale: 1.02
              }}
            >
              <Image
                src="/images/about.jpeg"
                alt="Student"
                width={500}
                height={500}
                className="rounded-3xl shadow-2xl w-full h-auto border border-gray-200/50 transform-gpu"
                style={{
                  transform: 'translateZ(20px)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                }}
              />
            </motion.div>

            {/* Modern Testimonial Card */}
            <motion.div 
              className="mt-10 lg:mt-0 absolute -top-20 lg:top-4 left-4 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 max-w-[280px] z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              animate={{
                y: [0, -8, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">"</span>
                </div>
                <p className="text-sm italic text-gray-700 leading-relaxed">
                  It is a long established fact that a reader will be
                  distracted by the readable content of a page when looking at its
                  layout.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/young-woman.jpg"
                  alt="Alisa"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-gray-200"
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Alisa Oliva</h4>
                  <p className="text-xs text-gray-500">Web Designer</p>
                </div>
              </div>
            </motion.div>

            {/* Modern Class Schedule Card */}
            <motion.div 
              className="absolute -bottom-35 lg:-bottom-16 right-0 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-4 w-[200px] shadow-xl z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              animate={{
                y: [0, -6, 0]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.05,
                rotateY: -5
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📅</span>
                </div>
                <h3 className="text-base font-bold">Our Class Day</h3>
              </div>
              <ul className="text-xs space-y-1">
                {["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"].map(
                  (day, index) => (
                    <motion.li
                      key={day}
                      className="flex justify-between items-center py-1 border-b border-white/20 last:border-b-0"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    >
                      <span className="font-medium text-xs">{day}</span>
                      <span className="bg-white/20 px-1 py-0.5 rounded-full text-xs">10:00-16:00</span>
                    </motion.li>
                  )
                )}
              </ul>
            </motion.div>
          </motion.div>

          {/* Right Side - Modern Content */}
          <motion.div 
            className="w-full lg:w-[50%] mt-20 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Modern Section Header */}
            <motion.div 
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
              <p className="text-green-600 font-bold text-2xl uppercase tracking-wider">About Us</p>
            </motion.div>

            {/* Content with Modern Styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {aboutContent ? (
                <div
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: aboutContent.replace(
                      /<p>/g, 
                      '<p class="mb-4 text-gray-700 leading-relaxed">'
                    )
                  }}
                />
              ) : (
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              )}
            </motion.div>

            {/* Modern CTA Button */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-full font-semibold shadow-lg transition-all duration-300 transform-gpu hover:scale-105 hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More About Us
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-gpu { transform-style: preserve-3d; }
      `}</style>
    </section>
  );
}
