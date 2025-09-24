"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import wishlistEventManager from "../../utils/wishlistEventManager";

import {
  Menu,
  X,
  LogOut,
  ShoppingCart,
  Trash2,
  User,
  ChevronDown,
  Settings,
  BookOpen,
  Heart,
  Bell,
  Shield,
  Star,
} from "lucide-react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AlertMarquee from "./AlertMarquee";

const MySwal = withReactContent(Swal);

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/course" },
  {
    name: "Placement",
    children: [
      { name: "Hire from us", href: "/placements/hire" },
      { name: "Apply for job", href: "/jobs" },
    ],
  },
  {
    name: "Join Us",
    children: [
      { name: "Practical Training", href: "/training/practical" },
      { name: "College on site training", href: "/join/college" },
      { name: "Corporate on site training", href: "/placements/hire" },
      { name: "Centres", href: "/center-login" },
    ],
  },
  {
    name: "Resources",
    children: [
      { name: "Blogs", href: "/blog" },
      { name: "Contact", href: "/contact" },
      { name: "About", href: "/about" },
      { name: "Demo Digital Hub", href: "/demo-digital-hub" },
      { name: "FAQ", href: "/faq" },
    ],
  },
  { name: "Live Session", href: "/live-session" },
];

export default function Header() {
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartDrawer, setCartDrawer] = useState(false);
  const [student, setStudent] = useState(null);
  const [cartCourses, setCartCourses] = useState([]);
  const [wishlistCourses, setWishlistCourses] = useState([]);
  const [wishlistDrawer, setWishlistDrawer] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // Check if current page is a dashboard page
  const isDashboardPage =
    pathname.includes("-dashboard") || pathname.includes("/dashboard");

  // Hide header on dashboard pages
  if (isDashboardPage) {
    return null;
  }

  const fetchStudentAndCart = async () => {
    try {
      // Check if admin is logged in first
      const adminToken = localStorage.getItem("adminToken");
      if (adminToken) {
        // If admin is logged in, don't try to fetch student data
        setIsAdmin(true);
        setStudent(null);
        setCartCourses([]);
        setWishlistCourses([]);
        return;
      } else {
        setIsAdmin(false);
      }

      const res = await axios.get(`${API}/api/v1/students/isstudent`, {
        withCredentials: true,
      });
      const studentData = res.data.student;
      setStudent(studentData);

      const cartRes = await axios.get(
        `${API}/api/v1/students/get-cart/${studentData._id}`,
        { withCredentials: true }
      );
      const cartIDs = cartRes.data.cart || [];

      // Fetch wishlist
      const wishlistRes = await axios.get(
        `${API}/api/v1/students/get-wishlist/${studentData._id}`,
        { withCredentials: true }
      );
      const wishlistIDs = wishlistRes.data.wishlist || [];

      const allCourses = await axios.get(`${API}/api/courses`);
      const courseList = allCourses.data.courses || allCourses.data;

      const filteredCartCourses = courseList.filter((c) =>
        cartIDs.includes(c._id)
      );
      const filteredWishlistCourses = courseList.filter((c) =>
        wishlistIDs.includes(c._id)
      );

      setCartCourses(filteredCartCourses);
      setWishlistCourses(filteredWishlistCourses);
    } catch {
      setStudent(null);
      setCartCourses([]);
      setWishlistCourses([]);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchStudentAndCart();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest(".profile-dropdown")) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleLogout = async () => {
    try {
      await axios.get(`${API}/api/v1/students/logout`, {
        withCredentials: true,
      });
      setStudent(null);
      setCartCourses([]);
      setWishlistCourses([]);
      setShowProfileDropdown(false);
      // Redirect to home page after logout
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails on server, clear local state
      setStudent(null);
      setCartCourses([]);
      setWishlistCourses([]);
      setShowProfileDropdown(false);
      window.location.href = "/";
    }
  };

  const handleBuyNow = async (courseId) => {
    console.log("Buy Now clicked for courseId:", courseId);
    console.log("Current student:", student);
    console.log("Cart courses:", cartCourses);

    const selectedCourse = cartCourses.find((c) => c._id === courseId);
    console.log("Selected course:", selectedCourse);

    if (!selectedCourse) {
      console.log("No course found with ID:", courseId);
      return;
    }

    if (!student) {
      console.log("No student logged in");
      Swal.fire(
        "Login Required",
        "Please login to proceed with payment.",
        "warning"
      );
      return;
    }

    console.log("Creating payment record...");
    try {
      // Create payment record using our new payment system
      const response = await axios.post(
        `${API}/api/v1/payments/create`,
        {
          courseId: courseId,
          amount: selectedCourse.price,
        },
        { withCredentials: true }
      );

      // Show success message and redirect to course page for UPI payment
      Swal.fire({
        title: "Payment Record Created",
        text: "Please complete UPI payment and upload screenshot for verification.",
        icon: "success",
        confirmButtonText: "Go to Course",
      }).then(() => {
        // Redirect to course page where user can complete UPI payment
        window.location.href = `/course/${
          selectedCourse.slug || selectedCourse.title.replace(/\s+/g, "_")
        }`;
      });
    } catch (err) {
      console.error("Payment error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      Swal.fire(
        "Payment Failed",
        `Something went wrong while creating payment record. ${
          err.response?.data?.message || ""
        }`,
        "error"
      );
    }
  };

  const handleRemoveFromCart = async (courseId) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You are about to remove this course from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.post(
          `${API}/api/v1/students/remove-cart/${student._id}`,
          { courseId },
          { withCredentials: true }
        );
        fetchStudentAndCart();
        Swal.fire("Removed!", "Course removed from cart.", "success");
      } catch {
        Swal.fire("Error", "Failed to remove item.", "error");
      }
    }
  };

  const handleClearCart = async () => {
    const result = await MySwal.fire({
      title: "Clear entire cart?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, clear it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API}/api/v1/students/clear-cart/${student._id}`, {
          withCredentials: true,
        });
        fetchStudentAndCart();
        Swal.fire("Cleared!", "Your cart has been emptied.", "success");
      } catch {
        Swal.fire("Error", "Failed to clear cart.", "error");
      }
    }
  };

  const handleRemoveFromWishlist = async (courseId) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You are about to remove this course from your wishlist.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.post(
          `${API}/api/v1/students/remove-wishlist/${student._id}`,
          { courseId },
          { withCredentials: true }
        );
        // Refresh all data from backend instead of optimistic update
        fetchStudentAndCart();

        // Notify other components of the change
        wishlistEventManager.notifyChange(student._id, courseId, "removed");

        Swal.fire("Removed!", "Course removed from wishlist.", "success");
      } catch {
        Swal.fire("Error", "Failed to remove item.", "error");
      }
    }
  };

  const handleClearWishlist = async () => {
    const result = await MySwal.fire({
      title: "Clear entire wishlist?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, clear it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${API}/api/v1/students/clear-wishlist/${student._id}`,
          {
            withCredentials: true,
          }
        );
        fetchStudentAndCart();
        Swal.fire("Cleared!", "Your wishlist has been emptied.", "success");
      } catch {
        Swal.fire("Error", "Failed to clear wishlist.", "error");
      }
    }
  };

  return (
    <>
      <AlertMarquee />
      <header
        className="fixed left-0 w-full z-40 bg-white shadow-lg"
        style={{ top: "40px" }}
      >
        <div className="w-full px-2 md:px-6 py-3 flex items-center justify-between">
          {/* Logo - Fixed at start */}
          <Link
            href="/"
            className="text-xl font-bold text-[#003057] flex-shrink-0"
          >
            <img src="/images/logo.png" alt="IICPA Logo" className="h-12" />
          </Link>

          {/* Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-8 text-base text-gray-800 font-medium flex-1 justify-center">
            {navLinks.map((item) =>
              item.children ? (
                <div key={item.name} className="relative group">
                  <button className="flex items-center gap-1 hover:text-green-600 transition-colors duration-200 py-1.5 px-2 rounded-md hover:bg-green-50 text-base">
                    {item.name}
                    <svg
                      className="w-3 h-3 transition-transform group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-40 bg-white shadow-xl rounded-lg opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50 border border-gray-100">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-3 py-2 text-sm hover:bg-green-50 hover:text-green-700 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`hover:text-green-600 transition-colors duration-200 py-1.5 px-2 rounded-md hover:bg-green-50 text-base ${
                    pathname === item.href ? "text-green-600 bg-green-50" : ""
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* Right side - Fixed at end */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            {isAdmin ? (
              // Admin is logged in - show admin dashboard link
              <Link
                href="/admin-dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Admin Dashboard
              </Link>
            ) : (
              // Regular user - show wishlist and student login
              <>
                {/* Star Plus Icon Button - Wishlist */}
                <button
                  onClick={() => {
                    // Always go to wishlist page - it will handle login check internally
                    window.location.href = "/wishlist";
                  }}
                  className="w-10 h-10 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-md hover:shadow-lg border border-blue-200 relative"
                  title={student ? "My Wishlist" : "Login to view Wishlist"}
                >
                  <svg
                    className="w-6 h-6"
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="1"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Star shape */}
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>

                {/* Conditional rendering: Student Login button or Profile dropdown */}
                {student ? (
                  <div className="relative profile-dropdown">
                    <button
                      onClick={() =>
                        setShowProfileDropdown(!showProfileDropdown)
                      }
                      className="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 relative"
                      title={student.name || "Profile"}
                    >
                      <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-800">
                        {student.image ? (
                          <img
                            src={`${API}/${student.image}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log(
                                "Profile image failed to load:",
                                `${API}/${student.image}`
                              );
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display =
                                "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-full h-full flex items-center justify-center bg-blue-800 ${
                            student.image ? "hidden" : ""
                          }`}
                        >
                          <User size={18} className="text-white" />
                        </div>
                      </div>
                      <ChevronDown
                        size={12}
                        className={`absolute -bottom-1 -right-1 bg-white text-blue-800 rounded-full p-0.5 transition-transform duration-200 ${
                          showProfileDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Enhanced Profile Dropdown */}
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in slide-in-from-top-2 duration-200">
                        {/* Profile Header */}
                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden">
                              {student.image ? (
                                <img
                                  src={`${API}/${student.image}`}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    console.log(
                                      "Desktop profile image failed to load:",
                                      `${API}/${student.image}`
                                    );
                                    e.target.style.display = "none";
                                    e.target.nextElementSibling.style.display =
                                      "flex";
                                  }}
                                />
                              ) : null}
                              <div
                                className={`w-full h-full flex items-center justify-center ${
                                  student.image ? "hidden" : ""
                                }`}
                              >
                                {student.name
                                  ? student.name.charAt(0).toUpperCase()
                                  : "U"}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {student.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            href="/student-dashboard"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                            onClick={() => setShowProfileDropdown(false)}
                          >
                            <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center mr-3 transition-colors duration-200">
                              <BookOpen size={16} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Dashboard</p>
                              <p className="text-xs text-gray-500">
                                View your courses
                              </p>
                            </div>
                          </Link>

                          <Link
                            href="/wishlist"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 group"
                            onClick={() => setShowProfileDropdown(false)}
                          >
                            <div className="w-8 h-8 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center mr-3 transition-colors duration-200">
                              <Star size={16} className="text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">My Wishlist</p>
                              <p className="text-xs text-gray-500">
                                Saved courses
                              </p>
                            </div>
                          </Link>

                          <Link
                            href="/student-dashboard?tab=profile"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
                            onClick={() => setShowProfileDropdown(false)}
                          >
                            <div className="w-8 h-8 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center mr-3 transition-colors duration-200">
                              <Settings size={16} className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Profile Settings</p>
                              <p className="text-xs text-gray-500">
                                Manage account
                              </p>
                            </div>
                          </Link>
                        </div>

                        {/* Logout Button */}
                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group"
                          >
                            <div className="w-8 h-8 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center mr-3 transition-colors duration-200">
                              <LogOut size={16} className="text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium">Logout</p>
                              <p className="text-xs text-gray-500">
                                Sign out of account
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/student-login"
                    className="bg-green-600 hover:bg-green-700 text-white text-base font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Student Login
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-800 p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isClient && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          direction="right"
          className="p-6 bg-white"
          size={300}
          enableOverlay={true}
          overlayOpacity={0.4}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#003057]">Menu</h2>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {navLinks.map((item) =>
              item.children ? (
                <div key={item.name} className="space-y-2">
                  <div className="py-2 px-4 text-lg font-medium text-gray-700">
                    {item.name}
                  </div>
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        onClick={() => setDrawerOpen(false)}
                        className="block py-2 px-4 text-base hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors duration-200"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`block py-3 px-4 text-lg font-medium hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors duration-200 ${
                    pathname === item.href ? "text-green-600 bg-green-50" : ""
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
            <div className="pt-4 border-t">
              {isAdmin ? (
                <Link
                  href="/admin-dashboard"
                  onClick={() => setDrawerOpen(false)}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200 shadow-md"
                >
                  Admin Dashboard
                </Link>
              ) : student ? (
                <div className="space-y-3">
                  {/* Enhanced Mobile Profile Header */}
                  <div className="px-4 py-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden">
                        {student.image ? (
                          <img
                            src={`${API}/${student.image}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log(
                                "Mobile profile image failed to load:",
                                `${API}/${student.image}`
                              );
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display =
                                "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-full h-full flex items-center justify-center ${
                            student.image ? "hidden" : ""
                          }`}
                        >
                          {student.name
                            ? student.name.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Mobile Menu Items */}
                  <Link
                    href="/student-dashboard"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <BookOpen size={16} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Dashboard</p>
                      <p className="text-xs text-blue-100">View your courses</p>
                    </div>
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <Star size={16} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">My Wishlist</p>
                      <p className="text-xs text-purple-100">Saved courses</p>
                    </div>
                  </Link>

                  <Link
                    href="/student-dashboard?tab=profile"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <Settings size={16} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Profile Settings</p>
                      <p className="text-xs text-green-100">Manage account</p>
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <LogOut size={16} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Logout</p>
                      <p className="text-xs text-red-100">
                        Sign out of account
                      </p>
                    </div>
                  </button>
                </div>
              ) : (
                <Link
                  href="/student-login"
                  onClick={() => setDrawerOpen(false)}
                  className="block w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-center py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  Student Login
                </Link>
              )}
            </div>
          </div>
        </Drawer>
      )}

      {/* Cart Drawer */}
      {isClient && (
        <Drawer
          open={cartDrawer}
          onClose={() => setCartDrawer(false)}
          direction="right"
          className="p-6 bg-white"
          size={350}
          enableOverlay={true}
          overlayOpacity={0.4}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-[#003057]">My Cart</h2>
            <div className="flex items-center gap-3">
              {cartCourses.length > 0 && (
                <button
                  onClick={handleClearCart}
                  title="Clear Cart"
                  className="hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors duration-200"
                >
                  <Trash2 size={20} className="text-red-600" />
                </button>
              )}
              <button
                onClick={() => setCartDrawer(false)}
                title="Close"
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {cartCourses.length === 0 ? (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              {cartCourses.map((c) => (
                <div
                  key={c._id}
                  className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50 flex flex-col items-center gap-4 hover:shadow-md transition-shadow duration-200"
                >
                  <button
                    onClick={() => handleRemoveFromCart(c._id)}
                    className="self-end p-1 hover:bg-red-100 rounded-md transition-colors duration-200"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                  <img
                    src={API + c.image}
                    alt={c.title}
                    className="h-28 w-32 object-cover rounded-lg"
                  />
                  <div className="flex-1 text-center">
                    <p className="font-semibold text-lg">{c.title}</p>
                    <p className="text-xs text-gray-500">₹{c.price}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => handleBuyNow(c._id)}
                      className="text-xs bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Drawer>
      )}
    </>
  );
}
