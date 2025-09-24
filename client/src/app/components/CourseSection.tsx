"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Course {
  _id: string;
  title: string;
  image: string;
  price: number;
  slug: string;
  category: string;
  discount?: number;
  status: string;
  description?: string;
  createdAt?: string;
}

export default function CourseSection() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample course data
  const sampleCourses: Course[] = [
    {
      _id: "1",
      title: "Basic Accounting & Tally Foundation",
      image: "/images/a1.jpeg",
      price: 240,
      slug: "basic-accounting-tally-foundation",
      category: "Accounting",
    },
    {
      _id: "2",
      title: "Advanced Financial Management",
      image: "/images/a1.jpeg",
      price: 350,
      slug: "advanced-financial-management",
      category: "Finance",
    },
    {
      _id: "3",
      title: "Corporate Tax Planning",
      image: "/images/a1.jpeg",
      price: 280,
      slug: "corporate-tax-planning",
      category: "Taxation",
    },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        // Fetch from production API
        const API_BASE =
          process.env.NEXT_PUBLIC_API_BASE || "https://api.iicpa.in/api";
        const response = await fetch(`${API_BASE}/courses`);

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            // Transform API data to match our interface
            const transformedCourses = data.map((course: any) => ({
              _id: course._id,
              title: course.title?.trim() || "Untitled Course",
              image: course.image
                ? `https://api.iicpa.in${course.image}`
                : "/images/a1.jpeg",
              price: course.price || 0,
              slug:
                course.slug ||
                course.title
                  ?.toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^\w-]/g, "") ||
                "course",
              category: course.category || "General",
              discount: course.discount || 0,
              status: course.status || "Active",
              description: course.description || "",
              createdAt: course.createdAt || new Date().toISOString(),
            }));

            // Filter only active courses and sort by creation date (newest first)
            const activeCourses = transformedCourses
              .filter((course) => course.status === "Active")
              .sort(
                (a, b) =>
                  new Date(b.createdAt || 0).getTime() -
                  new Date(a.createdAt || 0).getTime()
              );
            setCourses(activeCourses);
          } else {
            setCourses(sampleCourses);
          }
        } else {
          console.warn(`API returned ${response.status}, using sample data`);
          setCourses(sampleCourses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses(sampleCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnrollNow = (course: Course) => {
    router.push(`/course/${course.slug}`);
  };

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-20 bg-[#f9fbfa]">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-20 bg-[#f9fbfa]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-800">
          Our Courses Designed For{" "}
          <span className="text-[#3cd664] bg-[#3cd664]/10 px-2 py-1 rounded-lg">
            Your Success
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.slice(0, 3).map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Course Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#3cd664] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {course.category}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {course.title}
                </h3>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    {course.discount > 0 ? (
                      <>
                        <span className="text-lg font-bold text-[#3cd664]">
                          ₹
                          {Math.round(
                            course.price * (1 - course.discount / 100)
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 line-through">
                            ₹{course.price}
                          </span>
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                            {course.discount}% OFF
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-[#3cd664]">
                        ₹{course.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Enroll Button */}
                <button
                  onClick={() => handleEnrollNow(course)}
                  className="w-full bg-[#3cd664] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#2ea54a] transition-colors duration-300"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Courses Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push("/course")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            View All Courses ({courses.length})
          </button>
        </div>
      </div>
    </section>
  );
}
