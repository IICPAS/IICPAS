"use client";

import { useEffect, useState } from "react";
import { FaStar, FaChevronLeft, FaChevronRight, FaQuoteLeft } from "react-icons/fa";
import Image from "next/image";
import { BiSolidQuoteRight } from "react-icons/bi";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Mock fallback data
const mockTestimonials = [
  {
    quote:
      "Their support and technical expertise helped us launch our platform in record time. Highly recommended!",
    author: "Rajiv Ranjan",
    role: "Student",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "The team was super responsive and helped us with every challenge. A truly professional experience!",
    author: "Sneha Kapoor",
    role: "HR Manager",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    quote:
      "Triostack built our platform with impressive speed and quality. Will definitely work again!",
    author: "Michael Scott",
    role: "Marketing Head",
    image: "https://randomuser.me/api/portraits/men/78.jpg",
  },
];

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`
        );
        const data = res.data;

        // Map and normalize
        const formatted = data.length
          ? data.map((t, i) => ({
              quote: t.message,
              author: t.name,
              role: t.designation,
              image: t.image 
                ? `${process.env.NEXT_PUBLIC_API_URL}/${t.image}`
                : `https://randomuser.me/api/portraits/${
                    i % 2 === 0 ? "men" : "women"
                  }/${30 + i}.jpg`,
            }))
          : mockTestimonials;

        setTestimonials(formatted);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setTestimonials(mockTestimonials);
      }
    };

    fetchTestimonials();
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

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
            repeat: Infinity,
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
            repeat: Infinity,
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
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating Quote Icon */}
      <motion.div
        className="absolute top-8 right-8 md:top-12 md:right-16 w-16 h-16 rounded-2xl border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-2xl z-10"
        initial={{ rotate: 0, scale: 0.8 }}
        animate={{ rotate: [0, 5, -5, 0], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.02, delay: 0.01 + i * 0.005 }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <FaStar className="text-xl text-[#3cd664] drop-shadow-lg" />
                </motion.div>
              ))}
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
                {current.quote}
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
                  <Image
                    src={current.image}
                    alt={current.author}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3cd664]/20 to-transparent"></div>
                </motion.div>
                <motion.h4
                  className="mt-3 text-xl font-bold text-white"
                  whileHover={{ scale: 1.05 }}
                >
                  {current.author}
                </motion.h4>
                <motion.p
                  className="text-base text-[#3cd664] font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  {current.role}
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
