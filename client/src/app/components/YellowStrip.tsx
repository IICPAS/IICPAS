"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BsStars } from "react-icons/bs";
import { motion } from "framer-motion";
import { FaGraduationCap, FaClipboardCheck, FaBookOpen, FaTrophy, FaRocket, FaChartLine } from "react-icons/fa";

export default function YellowStatsStrip() {
  const [yellowStatsStripData, setYellowStatsStripData] = useState({
    title: "Our Achievements",
    statistics: [
      {
        icon: "FaGraduationCap",
        number: "120K+",
        label: "Successfully Student",
        color: "from-blue-500 to-cyan-500",
        bgColor: "from-blue-600/20 to-cyan-600/20",
      },
      {
        icon: "FaClipboardCheck",
        number: "560K+",
        label: "Courses Completed",
        color: "from-green-500 to-emerald-500",
        bgColor: "from-green-600/20 to-emerald-600/20",
      },
      {
        icon: "FaBookOpen",
        number: "3M+",
        label: "Satisfied Review",
        color: "from-purple-500 to-pink-500",
        bgColor: "from-purple-600/20 to-pink-600/20",
      },
      {
        icon: "FaTrophy",
        number: "120K+",
        label: "Successfully Student",
        color: "from-orange-500 to-red-500",
        bgColor: "from-orange-600/20 to-red-600/20",
      }
    ],
    colors: {
      title: "text-white",
      accent: "text-[#3cd664]",
      background: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchYellowStatsStripData();
  }, []);

  const fetchYellowStatsStripData = async () => {
    try {
      const response = await fetch("/api/yellow-stats-strip");
      if (response.ok) {
        const data = await response.json();
        setYellowStatsStripData(data);
      }
    } catch (error) {
      console.error("Error fetching YellowStatsStrip data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      FaGraduationCap: FaGraduationCap,
      FaClipboardCheck: FaClipboardCheck,
      FaBookOpen: FaBookOpen,
      FaTrophy: FaTrophy,
      FaRocket: FaRocket,
      FaChartLine: FaChartLine
    };
    return iconMap[iconName] || FaGraduationCap;
  };

  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6 overflow-hidden">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }
  return (
    <section className={`relative ${yellowStatsStripData.colors.background} py-16 px-6 overflow-hidden`}>
      {/* 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-full blur-lg"
          animate={{
            x: [0, 40, 0],
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
                />
              </div>

      {/* Section Title */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.02 }}
      >
        <h2 className={`text-4xl md:text-5xl font-bold ${yellowStatsStripData.colors.title} mb-4`}>
          {yellowStatsStripData.title.split(' ').map((word, index) => 
            index === 1 ? (
              <span key={index} className={yellowStatsStripData.colors.accent}> {word}</span>
            ) : (
              <span key={index}>{index === 0 ? '' : ' '}{word}</span>
            )
          )}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#3cd664] to-green-500 mx-auto rounded-full"></div>
      </motion.div>

      {/* 3D Stats Grid */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {yellowStatsStripData.statistics.map((item, index) => {
            const IconComponent = getIconComponent(item.icon);
            return (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 50, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.02, delay: index * 0.01 }}
                whileHover={{ 
                  y: -10,
                  rotateY: 5,
                  scale: 1.05
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* 3D Card Container */}
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl overflow-hidden">
                  {/* 3D Card Effect */}
                  <div
                    className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent"
                    style={{
                      transform: "perspective(1000px) rotateX(5deg) rotateY(-2deg)",
                      transformStyle: "preserve-3d",
                    }}
                  />

                  {/* Animated Background Gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} opacity-50`}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Icon Container */}
                  <motion.div
                    className="relative z-10 flex flex-col items-center text-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* 3D Icon */}
                    <motion.div
                      className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-2xl`}
                      whileHover={{ 
                        rotateY: 15,
                        scale: 1.1,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                      }}
                      animate={{
                        rotateY: [0, 5, -5, 0],
                      }}
                      transition={{
                        rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <IconComponent className="text-3xl text-white drop-shadow-lg" />
                    </motion.div>

                    {/* Number with Counter Animation */}
                    <motion.div
                      className="text-3xl md:text-4xl font-bold text-white mb-2"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.02, delay: 0.01 + index * 0.005 }}
                      whileHover={{ scale: 1.1 }}
                    >
                {item.number}
                    </motion.div>

                    {/* Label */}
                    <motion.div
                      className="text-sm md:text-base text-gray-300 font-medium"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.02, delay: 0.01 + index * 0.005 }}
                    >
                      {item.label}
                    </motion.div>
                  </motion.div>

                  {/* Floating Particles */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
              </div>
            </div>

                {/* Connection Line */}
            {index !== yellowStatsStripData.statistics.length - 1 && (
                  <motion.div
                    className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.02, delay: 0.01 + index * 0.05 }}
                  />
                )}
              </motion.div>
            );
          })}
          </div>

        {/* Bottom Decorative Elements */}
        <motion.div
          className="flex justify-center mt-12 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.02, delay: 0.01 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-yellow-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
