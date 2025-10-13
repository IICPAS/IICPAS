"use client";

import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import wishlistEventManager from "../../utils/wishlistEventManager";
import GroupCourseCard from "../components/GroupCourseCard";
import SimpleScrabbleGame from "./SimpleScrabbleGame";

export default function CoursePage() {
  const router = useRouter();
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groupPricing, setGroupPricing] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGroupNames, setSelectedGroupNames] = useState([]);
  const [student, setStudent] = useState(null);
  const [wishlistCourseIds, setWishlistCourseIds] = useState([]);
  const [loading, setLoading] = useState(false); // Initialize as false to prevent initial blinking

  // Define API_BASE at component level
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
  console.log("API_BASE", process.env.NEXT_PUBLIC_API_URL);
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch courses, categories, group pricing, and blogs in parallel
        const [
          coursesResponse,
          categoriesResponse,
          groupPricingResponse,
          blogsResponse,
        ] = await Promise.allSettled([
          axios.get(`${API_BASE}/courses`),
          axios.get(`${API_BASE}/categories`),
          axios.get(`${API_BASE}/group-pricing`),
          axios.get(`${API_BASE}/blogs`),
        ]);

        // Update courses if API call succeeded
        if (
          coursesResponse.status === "fulfilled" &&
          coursesResponse.value.data?.length > 0
        ) {
          setAllCourses(coursesResponse.value.data);
        }

        // Update categories if API call succeeded
        if (categoriesResponse.status === "fulfilled") {
          const apiCategories =
            categoriesResponse.value.data.categories ||
            categoriesResponse.value.data;
          if (apiCategories && apiCategories.length > 0) {
            setCategories(apiCategories);
          }
        }

        // Update group pricing if API call succeeded
        console.log("Group pricing response:", groupPricingResponse);
        if (
          groupPricingResponse.status === "fulfilled" &&
          groupPricingResponse.value.data?.length > 0
        ) {
          console.log(
            "Setting group pricing data:",
            groupPricingResponse.value.data
          );
          setGroupPricing(groupPricingResponse.value.data);
        } else {
          console.log(
            "Group pricing response failed or empty:",
            groupPricingResponse
          );
        }

        // Update blogs if API call succeeded
        if (
          blogsResponse.status === "fulfilled" &&
          blogsResponse.value.data?.length > 0
        ) {
          // Filter only active blogs
          const activeBlogs = blogsResponse.value.data.filter(
            (blog) => blog.status === "active"
          );
          setBlogs(activeBlogs);
        }
      } catch (error) {
        console.log("API calls failed:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data from API
    fetchData();

    // Fetch wishlist state (don't depend on student state)
    fetchWishlistState();

    // Subscribe to wishlist changes
    const unsubscribe = wishlistEventManager.subscribe(
      ({ studentId, courseId, action }) => {
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
  }, []); // Remove student dependency to prevent loops

  // Fetch current wishlist state
  const fetchWishlistState = async () => {
    try {
      const studentRes = await axios.get(`${API_BASE}/v1/students/isstudent`, {
        withCredentials: true,
      });

      if (studentRes.data.student) {
        setStudent(studentRes.data.student);
        const studentId = studentRes.data.student._id;

        // Fetch wishlist
        const wishlistRes = await axios.get(
          `${API_BASE}/v1/students/get-wishlist/${studentId}`,
          { withCredentials: true }
        );
        const wishlistIds = wishlistRes.data.wishlist || [];
        setWishlistCourseIds(wishlistIds);
      } else {
        // No student logged in, clear wishlist
        setStudent(null);
        setWishlistCourseIds([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist state:", error);
      // Handle 401 Unauthorized errors gracefully
      if (error.response?.status === 401) {
        console.log("User not authenticated, clearing student data");
      }
      // Don't show error to user for background operations
      // Just log it and continue
      setStudent(null);
      setWishlistCourseIds([]);
    }
  };

  // Filtering
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      !search || course.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(course.category);
    return matchesSearch && matchesCategory;
  });

  // Filter group pricing based on selected group names
  const filteredGroupPricing = groupPricing.filter((group) => {
    // Show all groups if no group name filter is selected, otherwise filter by selected group names
    return (
      selectedGroupNames.length === 0 ||
      selectedGroupNames.includes(group.groupName)
    );
  });

  // Handlers
  const toggleCategory = (categoryName) =>
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );

  const toggleGroupName = (groupName) =>
    setSelectedGroupNames((prev) =>
      prev.includes(groupName)
        ? prev.filter((g) => g !== groupName)
        : [...prev, groupName]
    );

  const toggleLike = async (courseId) => {
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
          `${API_BASE}/v1/students/remove-wishlist/${studentId}`,
          { courseId },
          { withCredentials: true }
        );

        console.log("Remove wishlist response:", response.data);
      } else {
        // Add to wishlist
        const response = await axios.post(
          `${API_BASE}/v1/students/add-wishlist/${studentId}`,
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
    } catch (error) {
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
    <section className="bg-gradient-to-br from-[#f5fcfa] via-white to-[#eef7fc] min-h-screen text-[#0b1224]">
      <div className="max-w-full mx-auto px-4 pb-8 mr-4">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 xl:w-1/5 lg:sticky lg:top-24 lg:max-h-screen lg:overflow-y-auto ml-8">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Find by Course Name</h2>
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

            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3">Categories</h3>
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

            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Course Combinations
              </h3>
              {groupPricing.length === 0 ? (
                <div className="text-gray-400 text-sm">No groups available</div>
              ) : (
                groupPricing.map((group) => (
                  <label
                    key={group._id}
                    className="flex items-center space-x-2 text-sm mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroupNames.includes(group.groupName)}
                      onChange={() => toggleGroupName(group.groupName)}
                      className="accent-green-600"
                    />
                    <span>{group.groupName}</span>
                  </label>
                ))
              )}
            </div>

            {/* Mini Scrabble Game */}
            <SimpleScrabbleGame />
          </aside>

          {/* Course Cards */}
          <main className="w-full lg:w-3/4 xl:w-4/5">
            {/* Unified Display: Show all courses together in a single grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 auto-rows-max">
              {/* Individual Course Cards */}
              {filteredCourses.map((course, index) => {
                // Use recorded session pricing if available, otherwise fall back to legacy pricing
                const recordedPrice =
                  course.pricing?.recordedSession?.finalPrice ||
                  course.pricing?.recordedSession?.price;
                const recordedDiscount =
                  course.pricing?.recordedSession?.discount;
                const legacyPrice = course.price;
                const legacyDiscount = course.discount;

                // Determine which pricing to use
                const displayPrice = recordedPrice || legacyPrice;
                const displayDiscount = recordedDiscount || legacyDiscount;

                const discountedPrice =
                  displayDiscount && displayDiscount > 0
                    ? displayPrice
                    : displayPrice;

                return (
                  <motion.div
                    key={course._id || index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out group cursor-pointer"
                    onClick={() => {
                      // Use course slug if available, otherwise generate from title
                      const courseId =
                        course.slug ||
                        course.title
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^\w-]/g, "");
                      router.push(`/course/${courseId}`);
                    }}
                  >
                    {/* Image Section */}
                    <div className="relative h-40 w-full rounded-t-xl overflow-hidden">
                      {course.image ? (
                        <Image
                          src={
                            course.image.startsWith("http")
                              ? course.image
                              : course.image.startsWith("/uploads/")
                              ? `${process.env.NEXT_PUBLIC_API_URL}${course.image}`
                              : course.image.startsWith("/")
                              ? course.image
                              : `${process.env.NEXT_PUBLIC_API_URL}${course.image}`
                          }
                          alt={course.title}
                          fill
                          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={index < 2}
                          onError={(e) => {
                            console.log("Image failed to load:", e);
                            console.log("Image src was:", e.currentTarget.src);
                            // Fallback to placeholder
                            e.currentTarget.style.display = "none";
                            const placeholder =
                              e.currentTarget.nextElementSibling;
                            if (placeholder) {
                              placeholder.style.display = "flex";
                            }
                          }}
                        />
                      ) : null}

                      {/* Fallback placeholder - always present but hidden when image loads */}
                      <div
                        className={`w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 ${
                          course.image ? "hidden" : ""
                        }`}
                        style={{
                          display: course.image ? "none" : "flex",
                        }}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-2">📚</div>
                          <div className="text-sm">Course Image</div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-2 relative">
                      {/* Wishlist Star */}
                      <div
                        className="absolute top-3 right-3 cursor-pointer z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(course._id);
                        }}
                      >
                        <button
                          className={`w-8 h-8 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                            wishlistCourseIds.includes(course._id)
                              ? "text-yellow-500"
                              : "text-yellow-500 hover:text-yellow-600"
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
                      {/* Category */}
                      <p className="text-sm text-gray-500 font-medium">
                        {course.category}
                      </p>

                      {/* Title */}
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Price Section */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 font-bold text-lg">
                            ₹
                            {discountedPrice &&
                            typeof discountedPrice === "number"
                              ? discountedPrice.toLocaleString()
                              : "0"}
                          </p>
                          {displayDiscount > 0 && (
                            <p className="text-gray-400 text-sm line-through">
                              ₹
                              {(() => {
                                const originalPrice =
                                  course.pricing?.recordedSession?.price ||
                                  course.price;
                                return originalPrice &&
                                  typeof originalPrice === "number"
                                  ? originalPrice.toLocaleString()
                                  : "0";
                              })()}
                            </p>
                          )}
                        </div>

                        {/* Enroll Button */}
                        <button
                          className="bg-gray-900 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Use course slug if available, otherwise generate from title
                            const courseId =
                              course.slug ||
                              course.title
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                                .replace(/[^\w-]/g, "");
                            router.push(`/course/${courseId}`);
                          }}
                        >
                          Enroll →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Course Packages Section */}
              {filteredGroupPricing.length > 0 && (
                <>
                  <div className="col-span-full mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Course Packages
                    </h2>
                    <p className="text-gray-600">
                      Complete course bundles with special pricing
                    </p>
                  </div>
                  {filteredGroupPricing.map((group, index) => (
                    <GroupCourseCard
                      key={group._id || `group-${index}`}
                      groupPricing={group}
                      index={index}
                    />
                  ))}
                </>
              )}

              {/* No courses found message */}
              {filteredCourses.length === 0 &&
                filteredGroupPricing.length === 0 && (
                  <div className="col-span-full text-gray-500 text-center py-12">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold mb-2">
                      No courses found
                    </h3>
                    <p>Try adjusting your search or filter criteria.</p>
                  </div>
                )}
            </div>
          </main>
        </div>
      </div>

      {/* Softwares We Teach Carousel Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full">
          <motion.div
            className="text-center mb-16 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Softwares We Teach
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Master industry-leading software tools and technologies
            </p>
          </motion.div>

          {/* Moving Cards Container */}
          <div
            className="relative overflow-hidden bg-white py-8"
            style={{ width: "95vw" }}
          >
            <motion.div
              className="flex gap-8"
              animate={{
                x: [0, -100 * 8],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: `${8 * 360}px`,
              }}
            >
              {/* Software data */}
              {(() => {
                const softwares = [
                  { name: "Power BI", image: "/softwares/PowerBI.jpeg" },
                  {
                    name: "Share Trading",
                    image: "/softwares/share-trading.jpg",
                  },
                  { name: "Zoho", image: "/softwares/zoho.png" },
                  { name: "PowerPoint", image: "/softwares/powerpoint.svg" },
                  { name: "QuickBooks", image: "/softwares/quickbooks.png" },
                  { name: "SAP", image: "/softwares/sap.webp" },
                  { name: "Tally Prime", image: "/softwares/tally-prime.png" },
                  {
                    name: "Microsoft Excel",
                    image: "/softwares/microsoft-excel-icon.webp",
                  },
                ];

                // Duplicate cards for seamless loop
                return [...softwares, ...softwares].map((software, index) => (
                  <motion.div
                    key={`${software.name}-${index}`}
                    className="flex-shrink-0 w-80 bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 mx-4"
                    whileHover={{ y: -8 }}
                  >
                    <div className="h-56 overflow-hidden rounded-t-3xl bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                      <img
                        src={software.image}
                        alt={software.name}
                        className="w-32 h-32 object-contain hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-8">
                      <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-4">
                        <span>💻</span>
                        <span>Software</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-3">
                        {software.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Professional certification course
                      </p>
                    </div>
                  </motion.div>
                ));
              })()}
            </motion.div>
          </div>
        </div>
      </section>
    </section>
  );
}
