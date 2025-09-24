"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaBook } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import wishlistEventManager from "../../utils/wishlistEventManager";

interface Course {
  _id: string;
  title: string;
  image: string;
  price: number;
  lessons: string;
  duration: string;
  rating: number;
  reviews: number;
  slug?: string;
}

export default function CoursesSection() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);

  const [courseRatings, setCourseRatings] = useState<{
    [key: string]: { averageRating: number; totalRatings: number };
  }>({});
  const [student, setStudent] = useState<any>(null);
  const [wishlistCourseIds, setWishlistCourseIds] = useState<string[]>([]);

  const [courseChapters, setCourseChapters] = useState<{
    [key: string]: number;
  }>({});

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

  // Fallback data with real course IDs from database
  const fallbackCourses: Course[] = useMemo(
    () => [
      {
        _id: "68cba03ff6d6e18d9a7588f1",
        title: "Basic Accounting & Tally Foundation",
        image: "/images/accounting.webp",
        price: 5000,
        lessons: "28 Lessons",
        duration: "40 hours",
        rating: 4.7,
        reviews: 449,
        slug: "basic-accounting-tally-foundation",
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
        slug: "hr-certification-course",
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
        slug: "excel-certification-course",
      },
      {
        _id: "68cba03ff6d6e18d9a7588f4",
        title: "Learn the Foundations of Visual Communication",
        image: "/images/a4.jpg",
        price: 240.0,
        lessons: "12 Lesson",
        duration: "620h, 20min",
        rating: 4.5,
        reviews: 129,
        slug: "learn-foundations-visual-communication",
      },
      {
        _id: "68cba03ff6d6e18d9a7588f5",
        title: "Cooking Made Easy: Essential Skills for Everyday Meals",
        image: "/images/about.jpeg",
        price: 240.0,
        lessons: "12 Lesson",
        duration: "620h, 20min",
        rating: 4.5,
        reviews: 129,
        slug: "cooking-made-easy-essential-skills",
      },
      {
        _id: "68cba03ff6d6e18d9a7588f6",
        title: "How to Capture Stunning Photos with Ease",
        image: "/images/s.jpg",
        price: 240.0,
        lessons: "12 Lesson",
        duration: "620h, 20min",
        rating: 4.5,
        reviews: 129,
        slug: "capture-stunning-photos-ease",
      },
    ],
    []
  );

  useEffect(() => {
    // Set fallback courses immediately for instant display
    setCourses(fallbackCourses);

    // Optionally fetch from API in background (without loading state)
    fetchCourses();

    // Fetch ratings for all courses
    fetchCourseRatings();

    // Fetch current wishlist state
    fetchWishlistState();

    // Subscribe to wishlist changes
    const unsubscribe = wishlistEventManager.subscribe(
      ({
        studentId,
        courseId,
        action,
      }: {
        studentId: string;
        courseId: string;
        action: "added" | "removed";
      }) => {
        if (student && student._id === studentId) {
          console.log(
            `Wishlist ${action} event received for course ${courseId}`
          );
          // Refresh wishlist state when other components make changes
          fetchWishlistState();
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [student]);

  // Fetch current wishlist state
  const fetchWishlistState = async () => {
    try {
      const studentRes = await axios.get(
        `${API_BASE}/api/v1/students/isstudent`,
        {
          withCredentials: true,
        }
      );

      if (studentRes.data.student) {
        setStudent(studentRes.data.student);
        const studentId = studentRes.data.student._id;

        // Fetch wishlist
        const wishlistRes = await axios.get(
          `${API_BASE}/api/v1/students/get-wishlist/${studentId}`,
          { withCredentials: true }
        );
        const wishlistIds = wishlistRes.data.wishlist || [];
        setWishlistCourseIds(wishlistIds);

        // Update liked indexes based on wishlist
        const likedIndexes = courses
          .map((course, index) =>
            wishlistIds.includes(course._id) ? index : -1
          )
          .filter((index) => index !== -1);
        setLikedIndexes(likedIndexes);
      }
    } catch (error) {
      console.error("Error fetching wishlist state:", error);
    }
  };

  useEffect(() => {
    // Fetch chapter counts for all courses
    fetchCourseChapters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch chapter counts for all courses
  const fetchCourseChapters = useCallback(async () => {
    try {
      // Use current courses state or fallback courses
      const coursesToFetch = courses.length > 0 ? courses : fallbackCourses;

      const chaptersPromises = coursesToFetch.map(async (course) => {
        try {
          const response = await axios.get(
            `${API_BASE}/api/chapters/course/${course._id}`
          );
          if (response.data.success) {
            return {
              courseId: course._id,
              chapterCount: response.data.chapters?.length || 0,
            };
          }
        } catch (error) {
          console.error(
            `Error fetching chapters for course ${course._id}:`,
            error
          );
        }
        return {
          courseId: course._id,
          chapterCount: 0,
        };
      });

      const chapters = await Promise.all(chaptersPromises);
      const chaptersMap: { [key: string]: number } = {};
      chapters.forEach((chapter) => {
        chaptersMap[chapter.courseId] = chapter.chapterCount;
      });
      setCourseChapters(chaptersMap);
    } catch (error) {
      console.error("Error fetching course chapters:", error);
    }
  }, [courses, fallbackCourses, API_BASE]);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/courses/available`);
      if (response.ok) {
        const data = await response.json();
        // Transform the data to match the expected format
        const transformedCourses = data.map(
          (course: {
            _id: string;
            title: string;
            image?: string;
            price: number;
            level: string;
            discount?: number;
            status: string;
            chapters?: { _id: string; title: string }[];
            slug?: string;
          }) => ({
            _id: course._id,
            title: course.title,
            image: course.image || "/images/a1.jpeg",
            price: course.price || 240.0,
            lessons: course.chapters?.length
              ? `${course.chapters.length} Lessons`
              : "0 Lessons",
            duration: "620h, 20min", // This could be calculated from course content
            rating: 4.5, // This could be fetched from reviews
            reviews: 129, // This could be fetched from reviews
            slug:
              course.slug ||
              course.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, ""),
          })
        );
        // Update courses if API data is different from fallback
        if (transformedCourses.length > 0) {
          setCourses(transformedCourses);
          // Fetch chapters for the new courses
          setTimeout(() => fetchCourseChapters(), 100);
        }
      } else {
        // Fallback to dummy courses if API fails
        setCourses(fallbackCourses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Keep fallback courses if API fails
      setCourses(fallbackCourses);
    }
  }, [fallbackCourses, fetchCourseChapters]);

  const toggleLike = async (courseId: string, index: number) => {
    try {
      // Check if student is logged in
      if (!student) {
        // Show login prompt instead of redirecting
        const result = await Swal.fire({
          title: "Login Required",
          text: "Please login to add courses to your wishlist.",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Login",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        });

        if (result.isConfirmed) {
          window.location.href = "/student-login?redirect=course";
        }
        return;
      }

      const studentId = student._id;
      const isLiked = wishlistCourseIds.includes(courseId);

      console.log("Toggle wishlist:", {
        studentId,
        courseId,
        isLiked,
        API_BASE,
      });

      if (isLiked) {
        // Remove from wishlist
        const response = await axios.post(
          `${API_BASE}/api/v1/students/remove-wishlist/${studentId}`,
          { courseId },
          { withCredentials: true }
        );

        console.log("Remove wishlist response:", response.data);
      } else {
        // Add to wishlist
        const response = await axios.post(
          `${API_BASE}/api/v1/students/add-wishlist/${studentId}`,
          { courseId },
          { withCredentials: true }
        );

        console.log("Add wishlist response:", response.data);
      }

      // Refresh wishlist state from backend instead of optimistic update
      await fetchWishlistState();

      // Notify other components of the change
      wishlistEventManager.notifyChange(
        studentId,
        courseId,
        isLiked ? "removed" : "added"
      );
    } catch (error: any) {
      console.error("Error toggling wishlist:", error);

      // Extract specific error message
      let errorMessage = "Failed to update wishlist. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Please login to add courses to your wishlist.";
      } else if (error.response?.status === 404) {
        errorMessage = "Course or student not found.";
      } else if (error.response?.status === 400) {
        errorMessage =
          error.response.data.message || "Invalid request. Please try again.";
      }

      // Show user-friendly error message
      await Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
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
        {courses.slice(0, 3).map((course, index) => (
          <div
            key={index}
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden group transition-all duration-300 hover:shadow-2xl animate-fade-in-up cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => {
              // Use course slug if available, otherwise generate from title
              const courseSlug =
                course.slug ||
                course.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^\w-]/g, "");
              router.push(`/course/${courseSlug}`);
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
              </div>

              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                {course.title}
              </h3>

              <button
                className="mt-2 inline-flex items-center gap-2 bg-[#3cd664] hover:bg-[#33bb58] text-white text-sm font-semibold px-4 py-2 rounded-full transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  // Use course slug if available, otherwise generate from title
                  const courseSlug =
                    course.slug ||
                    course.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^\w-]/g, "");
                  router.push(`/course/${courseSlug}`);
                }}
              >
                Enroll Now <span className="text-xl leading-none">›</span>
              </button>

              <div className="mt-4 flex items-center justify-between text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <FaBook />{" "}
                  {courseChapters[course._id]
                    ? `${courseChapters[course._id]} Lessons`
                    : course.lessons}
                </div>
              </div>
            </div>

            <div
              className="absolute top-6 right-6 cursor-pointer z-10"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(course._id, index);
              }}
            >
              <button
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 ${
                  wishlistCourseIds.includes(course._id)
                    ? "bg-yellow-400 text-white shadow-lg"
                    : "bg-white/80 text-gray-600 hover:bg-yellow-400 hover:text-white"
                }`}
                title={
                  wishlistCourseIds.includes(course._id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                }
              >
                <svg
                  className="w-5 h-5"
                  fill={
                    wishlistCourseIds.includes(course._id)
                      ? "currentColor"
                      : "none"
                  }
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center items-center mt-10 animate-fade-in-up animation-delay-500">
        <button
          onClick={() => router.push("/course")}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-300 hover:scale-105"
        >
          View All
        </button>
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

        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  );
}
