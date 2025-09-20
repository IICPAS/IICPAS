"use client";

import { useState, useEffect } from "react";
import { FaStar, FaChevronLeft, FaChevronRight, FaQuoteLeft } from "react-icons/fa";
import Image from "next/image";
import { BiSolidQuoteRight } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import StarRating from "./StarRating";

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

  // Fallback testimonials if API fails
  const fallbackTestimonials = [
    {
      quote:
        "IICPA Institute transformed my career completely. The courses are comprehensive and the instructors are experts in their field. Highly recommended!",
      author: "Rajiv Ranjan",
      designation: "Student",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
    },
    {
      quote:
        "The learning experience at IICPA is exceptional. The practical approach and real-world examples made complex concepts easy to understand.",
      author: "Sneha Kapoor",
      designation: "HR Manager",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 5,
    },
    {
      quote:
        "IICPA helped me master accounting and finance skills that directly improved my job performance. The support team is amazing!",
      author: "Michael Scott",
      designation: "Marketing Head",
      image: "https://randomuser.me/api/portraits/men/78.jpg",
      rating: 4,
    },
  ];

  useEffect(() => {
    fetchApprovedTestimonials();
  }, []);

  const fetchApprovedTestimonials = async () => {
    try {
      const response = await axios.get(`${API_BASE}/testimonials/approved`);
      if (response.data && response.data.length > 0) {
        setTestimonials(response.data);
      } else {
        setTestimonials(fallbackTestimonials);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setTestimonials(fallbackTestimonials);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-6 text-center overflow-hidden">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3cd664] mx-auto mb-4"></div>
            <p className="text-white">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials.length) return null;

  const current = testimonials[index];

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-6 text-center overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#3cd664]/20 to-transparent rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-lg"
          animate={{
            x: [0, 30, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating Quote Icon */}
      <motion.div
        className="absolute top-8 right-8 md:top-12 md:right-16 w-16 h-16 rounded-2xl border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-2xl z-10"
        initial={{ rotate: 0, scale: 0.8 }}
        animate={{ rotate: [0, 5, -5, 0], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 4, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <FaQuoteLeft className="text-2xl text-[#3cd664]" />
      </motion.div>

      {/* Main Content Container */}
      <div className="relative z-20 max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.02 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            What Our <span className="text-[#3cd664]">Students</span> Say
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#3cd664] to-blue-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* 3D Testimonial Card */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.02 }}
        >
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
            {/* 3D Card Effect */}
            <div
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent"
              style={{
                transform: "perspective(1000px) rotateX(5deg) rotateY(-2deg)",
                transformStyle: "preserve-3d",
              }}
            />

            {/* Rating Stars */}
            <motion.div
              className="flex justify-center gap-1 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.02, delay: 0.01 }}
            >
              <StarRating 
                rating={current.rating || 5} 
                interactive={false}
                size="text-xl"
              />
            </motion.div>

            {/* Quote */}
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 30, rotateX: 15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -30, rotateX: -15 }}
                transition={{ duration: 0.02, ease: "easeOut" }}
                className="max-w-3xl mx-auto text-lg md:text-xl text-white font-medium leading-relaxed mb-8 relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute -top-2 -left-2 text-4xl text-[#3cd664]/30 font-serif">
                  "
                </div>
                {current.message || current.quote}
                <div className="absolute -bottom-4 -right-2 text-4xl text-[#3cd664]/30 font-serif">
                  "
                </div>
              </motion.blockquote>
            </AnimatePresence>

            {/* Author Info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`author-${index}`}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="relative w-16 h-16 rounded-full overflow-hidden border-3 border-[#3cd664]/50 shadow-2xl"
                  whileHover={{ scale: 1.1, rotateY: 10 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {(() => {
                    // Helper function to get valid image URL
                    const getImageUrl = () => {
                      // If current.image is a valid URL (starts with http/https), use it directly
                      if (current.image && (current.image.startsWith('http://') || current.image.startsWith('https://'))) {
                        return current.image;
                      }
                      
                      // If current.image exists and is not empty, construct URL with API base
                      if (current.image && current.image.trim() !== '') {
                        const baseUrl = API_BASE.replace('/api', '');
                        return `${baseUrl}/${current.image}`;
                      }
                      
                      // Fallback to default avatar
                      return 'https://randomuser.me/api/portraits/men/32.jpg';
                    };
                    
                    return (
                      <Image
                        src={getImageUrl()}
                        alt={current.name || current.author || 'Testimonial Author'}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          // If image fails to load, set a fallback
                          e.target.src = 'https://randomuser.me/api/portraits/men/32.jpg';
                        }}
                      />
                    );
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3cd664]/20 to-transparent"></div>
                </motion.div>
                <motion.h4
                  className="mt-3 text-xl font-bold text-white"
                  whileHover={{ scale: 1.05 }}
                >
                  {current.name || current.author}
                </motion.h4>
                <motion.p
                  className="text-base text-[#3cd664] font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  {current.designation || current.role}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 3D Navigation Controls */}
        <motion.div
          className="mt-8 flex justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.button
            onClick={handlePrev}
            className="group relative bg-gradient-to-r from-[#3cd664] to-[#2db955] hover:from-[#2db955] hover:to-[#3cd664] text-white p-3 rounded-xl shadow-2xl border border-white/20 backdrop-blur-md"
            whileHover={{ 
              scale: 1.1, 
              rotateY: -5,
              boxShadow: "0 20px 40px rgba(60, 214, 100, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{ transformStyle: "preserve-3d" }}
            aria-label="Previous"
          >
            <FaChevronLeft className="text-xl" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>

          <motion.button
            onClick={handleNext}
            className="group relative bg-gradient-to-r from-[#3cd664] to-[#2db955] hover:from-[#2db955] hover:to-[#3cd664] text-white p-3 rounded-xl shadow-2xl border border-white/20 backdrop-blur-md"
            whileHover={{ 
              scale: 1.1, 
              rotateY: 5,
              boxShadow: "0 20px 40px rgba(60, 214, 100, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{ transformStyle: "preserve-3d" }}
            aria-label="Next"
          >
            <FaChevronRight className="text-xl" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </motion.div>

        {/* Dots Indicator */}
        <motion.div
          className="flex justify-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.02, delay: 0.01 }}
        >
          {testimonials.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === index
                  ? "bg-[#3cd664] scale-125 shadow-lg shadow-[#3cd664]/50"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
