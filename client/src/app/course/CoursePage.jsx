"use client";

import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

const skillLevels = ["Foundation", "Core", "Expert"];

export default function CoursePage() {
  const router = useRouter();
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);

  // Fetch data
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`)
      .then((res) => setAllCourses(res.data.courses || res.data));
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then((res) => {
        console.log("Fetched categories:", res.data.categories || res.data);
        setCategories(res.data.categories || res.data);
      });
  }, []);

  // Filtering
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      !search || course.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(course.category);
    const matchesLevel =
      selectedLevels.length === 0 || selectedLevels.includes(course.level);
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Handlers
  const toggleCategory = (categoryName) =>
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );

  const toggleLevel = (lvl) =>
    setSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none shadow"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Categories</h3>
            {categories.length === 0 && (
              <div className="text-gray-400 text-sm">No categories</div>
            )}
            {categories.map((cat) => (
              <label
                key={cat._id}
                className="flex items-center space-x-2 text-sm mb-2"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.category)}
                  onChange={() => toggleCategory(cat.category)}
                  className="accent-green-600"
                />
                <span>{cat.category}</span>
              </label>
            ))}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Skills Level</h3>
            {skillLevels.map((level) => (
              <label
                key={level}
                className="flex items-center space-x-2 text-sm mb-2"
              >
                <input
                  type="checkbox"
                  checked={selectedLevels.includes(level)}
                  onChange={() => toggleLevel(level)}
                  className="accent-green-600"
                />
                <span>{level}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Course Cards */}
        <main className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 && (
            <div className="col-span-3 text-gray-500 text-center py-12">
              No courses found.
            </div>
          )}
          {filteredCourses.map((course, index) => {
            const discountedPrice =
              course.price - (course.price * (course.discount || 0)) / 100;

            return (
              <motion.div
                key={course._id || index}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition duration-300 ease-in-out group"
              >
                {/* Image with overlay */}
                <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
                  {course.image ? (
                    <Image
                      src={"http://localhost:8080" + course.image}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={index < 2}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
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
                          `/course/${course.title.replace(/\s+/g, "_")}`
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
