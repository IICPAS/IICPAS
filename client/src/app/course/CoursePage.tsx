"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const categories = ["Accounting", "Taxation", "HR", "Finance", "US CMA"];
const skills = ["Foundation", "Core", "Expert"];

const courses = [
  {
    title: "Basic Accounting & Tally Foundation",
    category: "Accounting",
    price: 5000,
    discount: 5,
    image: "/images/accounting.webp",
  },
  {
    title: "Microsoft Excel",
    category: "Taxation",
    price: 5000,
    discount: 0,
    image: "/images/excel.jpg",
  },
  {
    title: "Advanced Diploma in Computer Application",
    category: "Finance",
    price: 10000,
    discount: 5,
    image: "/images/adca.jpg",
  },
  {
    title: "HR Management",
    category: "HR",
    price: 8000,
    discount: 2,
    image: "/images/hr.jpg",
  },
];

export default function CoursePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCourses = selectedCategory
    ? courses.filter((course) => course.category === selectedCategory)
    : courses;

  return (
    <section className="bg-gradient-to-br from-[#f5fcfa] via-white to-[#eef7fc] min-h-screen text-[#0b1224]">
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Find by Course Name</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full border rounded-lg px-4 py-2 focus:outline-none shadow"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Categories</h3>
            {categories.map((cat) => (
              <label
                key={cat}
                className="flex items-center space-x-2 text-sm mb-2"
              >
                <input
                  type="checkbox"
                  checked={selectedCategory === cat}
                  onChange={() =>
                    setSelectedCategory(selectedCategory === cat ? null : cat)
                  }
                  className="accent-green-600"
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Skills Level</h3>
            {skills.map((level) => (
              <label
                key={level}
                className="flex items-center space-x-2 text-sm mb-2"
              >
                <input type="checkbox" className="accent-green-600" />
                <span>{level}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Course Cards */}
        <main className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => {
            const discountedPrice =
              course.price - (course.price * course.discount) / 100;

            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition duration-300 ease-in-out group"
              >
                {/* Image with overlay */}
                <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                  {/* Overlay tint on hover */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-[#0b1224]/40 transition duration-300 z-10 rounded-t-2xl" />
                  {course.discount > 0 && (
                    <span className="absolute top-3 right-3 z-20 bg-green-600 text-white text-xs px-2 py-1 rounded-full shadow-md">
                      {course.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col justify-between h-[220px]">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {course.category}
                    </p>
                    <h3 className="text-lg font-semibold text-[#0b1224] group-hover:text-green-700 line-clamp-2">
                      {course.title}
                    </h3>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-green-600 font-bold text-xl">
                        ₹{discountedPrice.toLocaleString()}
                      </p>
                      {course.discount > 0 && (
                        <p className="text-gray-400 text-sm line-through">
                          ₹{course.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        router.push(
                          `/course/${course.title
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`
                        )
                      }
                      className="bg-[#0b1224] text-white px-4 py-2 rounded-full text-sm hover:bg-green-600 transition"
                    >
                      Enroll Now →
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </main>
      </div>
    </section>
  );
}
