"use client";

import { useState } from "react";
import Image from "next/image";
import { FaStar, FaHeart, FaRegHeart, FaBook, FaClock } from "react-icons/fa";

export default function CoursesSection() {
  const [likedIndexes, setLikedIndexes] = useState<number[]>([]);

  const courses = [
    {
      title: "Learn the Foundations of Visual Communication",
      image: "/images/a1.jpeg",
      price: "$240.00",
      lessons: "12 Lesson",
      duration: "620h, 20min",
      rating: 4.5,
      reviews: 129,
    },
    {
      title: "Cooking Made Easy: Essential Skills for Everyday Meals",
      image: "/images/a2.avif",
      price: "$240.00",
      lessons: "12 Lesson",
      duration: "620h, 20min",
      rating: 4.5,
      reviews: 129,
    },
    {
      title: "A Beginner’s Guide to Basic Skills and Improved",
      image: "/images/a3.jpeg",
      price: "$240.00",
      lessons: "12 Lesson",
      duration: "620h, 20min",
      rating: 4.5,
      reviews: 129,
    },
    {
      title: "Learn the Foundations of Visual Communication",
      image: "/images/a4.jpg",
      price: "$240.00",
      lessons: "12 Lesson",
      duration: "620h, 20min",
      rating: 4.5,
      reviews: 129,
    },
    {
      title: "Cooking Made Easy: Essential Skills for Everyday Meals",
      image: "/images/about.jpeg",
      price: "$240.00",
      lessons: "12 Lesson",
      duration: "620h, 20min",
      rating: 4.5,
      reviews: 129,
    },
    {
      title: "How to Capture Stunning Photos with Ease",
      image: "/images/s.jpg",
      price: "$240.00",
      lessons: "12 Lesson",
      duration: "620h, 20min",
      rating: 4.5,
      reviews: 129,
    },
  ];

  const toggleLike = (index: number) => {
    setLikedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="py-16 px-4 md:px-20 bg-[#f9fbfa]">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-800">
        Our Courses Designed For{" "}
        <span className="text-[#3cd664] bg-[#3cd664]/10 px-2 py-1 rounded-lg">
          Your Success
        </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <div
            key={index}
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden group transition-all duration-300 hover:shadow-2xl"
          >
            <div className="relative w-full h-48 md:h-56 overflow-hidden">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition duration-300" />
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600 font-semibold">
                <span className="text-lg text-[#3cd664] font-bold">
                  {course.price}
                </span>
                <span className="flex items-center gap-1 text-yellow-500">
                  <FaStar /> {course.rating}
                  <span className="text-gray-400 ml-1">
                    ({course.reviews} Reviews)
                  </span>
                </span>
              </div>

              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                {course.title}
              </h3>

              <button className="mt-2 inline-flex items-center gap-2 bg-[#3cd664] hover:bg-[#33bb58] text-white text-sm font-semibold px-4 py-2 rounded-full transition-all">
                Enroll Now <span className="text-xl leading-none">›</span>
              </button>

              <div className="mt-4 flex items-center justify-between text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <FaBook /> {course.lessons}
                </div>
                <div className="flex items-center gap-2">
                  <FaClock /> {course.duration}
                </div>
              </div>
            </div>

            <div
              className="absolute top-4 right-4 text-xl cursor-pointer text-gray-400 hover:text-pink-500 transition"
              onClick={() => toggleLike(index)}
            >
              {likedIndexes.includes(index) ? <FaHeart /> : <FaRegHeart />}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center items-center mt-10">
        <button className="px-6 py-3 bg-green-500 text-white">View All</button>
      </div>
    </section>
  );
}
