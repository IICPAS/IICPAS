"use client";

import { useEffect, useState } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import { BiSolidQuoteRight } from "react-icons/bi";
import axios from "axios";

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
              image: `https://randomuser.me/api/portraits/${
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
    <section className="relative bg-gradient-to-br from-white via-[#f5fdf7] to-white py-16 px-6 text-center overflow-hidden">
      <div className="absolute top-8 right-8 md:top-10 md:right-12 w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-md z-10">
        <BiSolidQuoteRight className="text-xl text-[#3cd664]" />
      </div>

      {/* Rating */}
      <div className="flex justify-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar key={i} className="text-[#3cd664]" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="max-w-2xl mx-auto text-lg md:text-xl text-gray-800 font-medium leading-relaxed mb-6">
        {current.quote}
      </blockquote>

      {/* Author Info */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <Image
            src={current.image}
            alt={current.author}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>
        <h4 className="mt-3 text-lg font-semibold text-gray-900">
          {current.author}
        </h4>
        <p className="text-sm text-gray-500">{current.role}</p>
      </div>

      {/* Controls */}
      <div className="mt-10 flex justify-center gap-8">
        <button
          onClick={handlePrev}
          className="bg-[#3cd664] hover:bg-[#2db955] text-white p-3 rounded-full shadow-md transition"
          aria-label="Previous"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={handleNext}
          className="bg-[#3cd664] hover:bg-[#2db955] text-white p-3 rounded-full shadow-md transition"
          aria-label="Next"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
}
