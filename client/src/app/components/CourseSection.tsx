"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar, FaBook, FaClock } from "react-icons/fa";
import axios from "axios";

interface Course {
  _id: string;
  title: string;
  image: string;
  price: number;
  lessons: string;
  duration: string;
  rating: number;
  reviews: number;
}

export default function CoursesSection() {
  const router = useRouter();
  const [likedIndexes, setLikedIndexes] = useState<number[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseRatings, setCourseRatings] = useState<{[key: string]: {averageRating: number, totalRatings: number}}>({});

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Fallback data with real course IDs from database
  const fallbackCourses: Course[] = [
    {
      _id: "68cba03ff6d6e18d9a7588f1",
      title: "Basic Accounting & Tally Foundation",
      image: "/images/accounting.webp",
      price: 5000,
      lessons: "28 Lessons",
      duration: "40 hours",
      rating: 4.7,
      reviews: 449,
    },
    {
      _id: "68cba03ff6d6e18d9a7588f2",
      title: "HR Certification Course",
      image: "/images/young-woman.jpg",
      price: 1000,
      lessons: "20 Lessons",
      duration: "30 hours",
      rating: 4.5,
      reviews: 320,
    },
    {
      _id: "68cba03ff6d6e18d9a7588f3",
      title: "Excel Certification Course",
      image: "/images/course.png",
      price: 2000,
      lessons: "35 Lessons",
      duration: "35 hours",
      rating: 4.8,
      reviews: 680,
    },
    {
      _id: "68cba03ff6d6e18d9a7588f4",
      title: "Learn the Foundations of Visual Communication",
      image: "/images/a4.jpg",
      price: 240.00,
      lessons: "12 Lesson",
      duration: "620h, 20min",
      rating: 4.5,
      reviews: 129,
    },
    {
      _id: "68cba03ff6d6e18d9a7588f5",
      title: "Cooking Made Easy: Essential Skills for Everyday Meals",
      image: "/images/about.jpeg",
      price: 240.00,
      lessons: "12 Lesson",
      duration: "620h, 20min",
      rating: 4.5,
      reviews: 129,
    },
    {
      _id: "68cba03ff6d6e18d9a7588f6",
      title: "How to Capture Stunning Photos with Ease",
      image: "/images/s.jpg",
      price: 240.00,
      lessons: "12 Lesson",
      duration: "620h, 20min",
      rating: 4.5,
      reviews: 129,
    },
  ];

  useEffect(() => {
    // Set fallback courses immediately for instant display
    setCourses(fallbackCourses);
    
    // Optionally fetch from API in background (without loading state)
    fetchCourses();
    
    // Fetch ratings for all courses
    fetchCourseRatings();
  }, []);

  // Fetch ratings for all courses
  const fetchCourseRatings = async () => {
    try {
      const ratingsPromises = fallbackCourses.map(async (course) => {
        try {
          const response = await axios.get(
            `${API_BASE}/api/v1/course-ratings/course/${course._id}`
          );
          if (response.data.success) {
            return {
              courseId: course._id,
              averageRating: response.data.averageRating || course.rating,
              totalRatings: response.data.totalRatings || course.reviews
            };
          }
        } catch (error) {
          console.error(`Error fetching ratings for course ${course._id}:`, error);
        }
        return {
          courseId: course._id,
          averageRating: course.rating,
          totalRatings: course.reviews
        };
      });

      const ratings = await Promise.all(ratingsPromises);
      const ratingsMap: {[key: string]: {averageRating: number, totalRatings: number}} = {};
      ratings.forEach(rating => {
        ratingsMap[rating.courseId] = {
          averageRating: rating.averageRating,
          totalRatings: rating.totalRatings
        };
      });
      setCourseRatings(ratingsMap);
    } catch (error) {
      console.error("Error fetching course ratings:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const response = await fetch(`${API_BASE}/courses/available`);
      if (response.ok) {
        const data = await response.json();
        // Transform the data to match the expected format
        const transformedCourses = data.map((course: { _id: string; title: string; image?: string; price: number; level: string; discount?: number; status: string; chapters?: { _id: string; title: string }[] }) => ({
          _id: course._id,
          title: course.title,
          image: course.image || "/images/a1.jpeg",
          price: course.price || 240.00,
          lessons: course.chapters?.length ? `${course.chapters.length} Lesson` : "12 Lesson",
          duration: "620h, 20min", // This could be calculated from course content
          rating: 4.5, // This could be fetched from reviews
          reviews: 129, // This could be fetched from reviews
        }));
        // Update courses if API data is different from fallback
        if (transformedCourses.length > 0) {
          setCourses(transformedCourses);
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Keep fallback courses if API fails
    }
  };

  const toggleLike = async (courseId: string, index: number) => {
    try {
      const API = process.env.NEXT_PUBLIC_API_URL;
      
      // Check if student is logged in
      const studentRes = await axios.get(`${API}/api/v1/students/isstudent`, {
        withCredentials: true,
      });
      
      if (!studentRes.data.student) {
        // Redirect to wishlist page - it will show login prompt
        window.location.href = "/wishlist";
        return;
      }
      
      const studentId = studentRes.data.student._id;
      const isLiked = likedIndexes.includes(index);
      
      if (isLiked) {
        // Remove from wishlist
        await axios.post(
          `${API}/api/v1/students/remove-wishlist/${studentId}`,
          { courseId },
          { withCredentials: true }
        );
      } else {
        // Add to wishlist
        await axios.post(
          `${API}/api/v1/students/add-wishlist/${studentId}`,
          { courseId },
          { withCredentials: true }
        );
      }
      
      // Update local state
      setLikedIndexes((prev) =>
        isLiked ? prev.filter((i) => i !== index) : [...prev, index]
      );
      
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert("Error updating wishlist. Please try again.");
    }
  };

  return (
    <section className="py-16 px-4 md:px-20 bg-[#f9fbfa]">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-800 animate-fade-in-up">
        Our Courses Designed For{" "}
        <span className="text-[#3cd664] bg-[#3cd664]/10 px-2 py-1 rounded-lg">
          Your Success
        </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <div
            key={index}
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden group transition-all duration-300 hover:shadow-2xl animate-fade-in-up cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => {
              // Map course titles to our dummy course IDs
              let courseId = course.title.toLowerCase().replace(/\s+/g, "-");
              if (course.title.includes("Basic Accounting")) {
                courseId = "basic-accounting-tally";
              } else if (course.title.includes("HR Certification")) {
                courseId = "hr-certification";
              } else if (course.title.includes("Excel Certification")) {
                courseId = "excel-certification";
              }
              router.push(`/course/${courseId}`);
            }}
          >
            <div className="relative w-full h-48 md:h-56 p-4 bg-white rounded-xl">
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition duration-300" />
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600 font-semibold">
                <span className="text-lg text-[#3cd664] font-bold">
                  ₹{course.price}
                </span>
                <span className="flex items-center gap-1 text-yellow-500">
                  <FaStar /> {courseRatings[course._id]?.averageRating || course.rating}
                  <span className="text-gray-400 ml-1">
                    ({courseRatings[course._id]?.totalRatings || course.reviews} Reviews)
                  </span>
                </span>
              </div>

              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                {course.title}
              </h3>

              <button 
                className="mt-2 inline-flex items-center gap-2 bg-[#3cd664] hover:bg-[#33bb58] text-white text-sm font-semibold px-4 py-2 rounded-full transition-all"
              >
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
              className="absolute top-6 right-6 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(course._id, index);
              }}
            >
              <button
                className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                  likedIndexes.includes(index) 
                    ? 'text-blue-600' 
                    : 'text-blue-600'
                }`}
                title="Add to Favorites"
              >
                <svg
                  className="w-5 h-5"
                  fill="white"
                  stroke="currentColor"
                  strokeWidth="1"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center items-center mt-10 animate-fade-in-up animation-delay-500">
        <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-300 hover:scale-105">View All</button>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-500 { animation-delay: 0.5s; }
      `}</style>
    </section>
  );
}
