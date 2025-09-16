"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaEnvelope, FaRocket, FaCheckCircle, FaStar } from "react-icons/fa";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterData, setNewsletterData] = useState({
    badge: {
      text: "Stay Updated",
      icon: "FaEnvelope"
    },
    title: {
      part1: "Never Miss Our",
      part2: "Latest Updates"
    },
    description: "Get exclusive access to new courses, special offers, and educational content delivered straight to your inbox. Join thousands of learners who stay ahead.",
    features: [
      { text: "Weekly Updates", icon: "FaCheckCircle" },
      { text: "Exclusive Content", icon: "FaCheckCircle" },
      { text: "No Spam", icon: "FaCheckCircle" }
    ],
    form: {
      placeholder: "Enter your email address",
      buttonText: "Subscribe",
      successText: "Done!",
      buttonIcon: "FaRocket",
      successIcon: "FaCheckCircle"
    },
    stats: {
      rating: "4.9/5 Rating",
      subscribers: "10,000+ Subscribers"
    },
    image: {
      src: "/images/student.png",
      alt: "Newsletter Student"
    },
    colors: {
      badge: "text-[#3cd664]",
      badgeBg: "bg-[#3cd664]/10",
      title: "text-gray-900",
      titleAccent: "from-[#3cd664] to-[#22c55e]",
      description: "text-gray-600",
      background: "bg-gradient-to-br from-[#f8fffe] via-[#f0fdf4] to-[#ecfdf5]",
      button: "from-[#3cd664] to-[#22c55e]",
      buttonHover: "from-[#22c55e] to-[#16a34a]"
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsletterData();
  }, []);

  const fetchNewsletterData = async () => {
    try {
      const response = await fetch("/api/newsletter-section");
      if (response.ok) {
        const data = await response.json();
        setNewsletterData(data);
      }
    } catch (error) {
      console.error("Error fetching Newsletter data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      FaEnvelope: FaEnvelope,
      FaRocket: FaRocket,
      FaCheckCircle: FaCheckCircle,
      FaStar: FaStar
    };
    return iconMap[iconName] || FaEnvelope;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  if (loading) {
    return (
      <section className="relative py-12 px-4 md:px-8 lg:px-12 xl:px-16 mt-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-12 px-4 md:px-8 lg:px-12 xl:px-16 mt-12">
      {/* Background Elements */}
      <div className={`absolute inset-0 ${newsletterData.colors.background}`}></div>
      <div className="absolute top-6 left-6 w-24 h-24 bg-[#3cd664]/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-6 right-6 w-32 h-32 bg-[#162955]/10 rounded-full blur-2xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="relative bg-gradient-to-br from-white via-white to-[#f8fffe] rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.02, ease: "easeOut" }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#3cd664] via-[#22c55e] to-[#16a34a]"></div>
          <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-[#3cd664]/20 to-[#162955]/20 rounded-full blur-lg"></div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-6 md:p-8 lg:p-10">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-6">
              {/* Badge */}
              <motion.div
                className={`inline-flex items-center gap-2 ${newsletterData.colors.badgeBg} ${newsletterData.colors.badge} px-3 py-1.5 rounded-full text-sm font-semibold`}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.01 }}
              >
                {React.createElement(getIconComponent(newsletterData.badge.icon), { className: "w-3.5 h-3.5" })}
                {newsletterData.badge.text}
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.01 }}
              >
                <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${newsletterData.colors.title} leading-tight`}>
                  {newsletterData.title.part1}
                  <span className={`block bg-gradient-to-r ${newsletterData.colors.titleAccent} bg-clip-text text-transparent`}>
                    {newsletterData.title.part2}
                  </span>
                </h2>
              </motion.div>

              {/* Description */}
              <motion.p
                className={`text-base ${newsletterData.colors.description} leading-relaxed max-w-lg`}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.01 }}
              >
                {newsletterData.description}
              </motion.p>

              {/* Features */}
              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.01 }}
              >
                {newsletterData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/60 px-2.5 py-1.5 rounded-full text-xs font-medium text-gray-700">
                    {React.createElement(getIconComponent(feature.icon), { className: "w-3 h-3 text-[#3cd664]" })}
                    {feature.text}
                  </div>
                ))}
              </motion.div>

              {/* Email Form */}
              <motion.form
                onSubmit={handleSubmit}
                className="relative max-w-sm"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.01 }}
              >
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={newsletterData.form.placeholder}
                    className="w-full px-4 py-3 pr-28 rounded-xl border-2 border-gray-200 focus:border-[#3cd664] focus:outline-none text-gray-900 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm transition-all duration-300 text-sm"
                    required
                  />
                  <motion.button
                    type="submit"
                    className={`absolute top-0.5 right-0.5 bottom-0.5 bg-gradient-to-r ${newsletterData.colors.button} hover:bg-gradient-to-r ${newsletterData.colors.buttonHover} text-white px-4 rounded-lg font-semibold flex items-center gap-1.5 transition-all duration-300 shadow-lg hover:shadow-xl text-sm`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubscribed ? (
                      <>
                        {React.createElement(getIconComponent(newsletterData.form.successIcon), { className: "w-3.5 h-3.5" })}
                        {newsletterData.form.successText}
                      </>
                    ) : (
                      <>
                        {React.createElement(getIconComponent(newsletterData.form.buttonIcon), { className: "w-3.5 h-3.5" })}
                        {newsletterData.form.buttonText}
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>

              {/* Stats */}
              <motion.div
                className="flex items-center gap-6 text-xs text-gray-500"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.01 }}
              >
                <div className="flex items-center gap-1">
                  <FaStar className="w-3.5 h-3.5 text-yellow-500" />
                  <span>{newsletterData.stats.rating}</span>
                </div>
                <div>{newsletterData.stats.subscribers}</div>
              </motion.div>
            </div>

            {/* Right Image */}
            <motion.div
              className="w-full lg:w-1/2 flex justify-center lg:justify-end"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.01, duration: 0.02 }}
            >
              <div className="relative">
                <motion.div
                  className="relative w-64 h-64 lg:w-80 lg:h-80"
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, 1.5, 0, -1.5, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    ease: "easeInOut"
                  }}
                >
                  <Image
                    src={newsletterData.image.src}
                    alt={newsletterData.image.alt}
                    fill
                    className="object-contain drop-shadow-xl"
                  />
                  
                  {/* Floating Elements */}
                  <motion.div
                    className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-[#3cd664] to-[#22c55e] rounded-full flex items-center justify-center text-white text-lg shadow-lg"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      ease: "easeInOut"
                    }}
                  >
                    📚
                  </motion.div>
                  
                  <motion.div
                    className="absolute -bottom-3 -left-3 w-10 h-10 bg-gradient-to-br from-[#162955] to-[#1e40af] rounded-full flex items-center justify-center text-white text-sm shadow-lg"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, -15, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    ✨
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
