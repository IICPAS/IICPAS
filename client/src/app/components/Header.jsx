"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import { Menu, X, LogOut, ShoppingCart, Trash2 } from "lucide-react";
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
    ],
  },
  { name: "Live Session", href: "/live-session" },
];

export default function Header() {
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartDrawer, setCartDrawer] = useState(false);
  const [student, setStudent] = useState(null);
  const [cartCourses, setCartCourses] = useState([]);
  const [showMarquee, setShowMarquee] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 60) {
        setShowHeader(false);
        setShowMarquee(false);
      } else {
        setShowHeader(true);
        setShowMarquee(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const fetchStudentAndCart = async () => {
    try {
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

      const allCourses = await axios.get(`${API}/api/courses`);
      const courseList = allCourses.data.courses || allCourses.data;

      const filteredCourses = courseList.filter((c) => cartIDs.includes(c._id));
      setCartCourses(filteredCourses);
    } catch {
      setStudent(null);
      setCartCourses([]);
    }
  };

  useEffect(() => {
    fetchStudentAndCart();
  }, []);

  const handleLogout = async () => {
    await axios.get(`${API}/api/v1/students/logout`, {
      withCredentials: true,
    });
    setStudent(null);
    setCartCourses([]);
    location.reload();
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

  return (
    <>
      <AlertMarquee showMarquee={showMarquee} />
      <header
        className={`fixed left-0 w-full z-40 bg-white shadow-lg transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ top: showMarquee ? "40px" : "0px" }}
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
          <nav className="hidden lg:flex items-center gap-4 text-base text-gray-800 font-medium flex-1 justify-center">
            {navLinks.map((item) =>
              item.children ? (
                <div key={item.name} className="relative group">
                  <button className="flex items-center gap-1 hover:text-green-600 transition-colors duration-200 py-1.5 px-2 rounded-md hover:bg-green-50 text-sm">
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
                  className={`hover:text-green-600 transition-colors duration-200 py-1.5 px-2 rounded-md hover:bg-green-50 text-sm ${
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
            {student ? (
              <>
                <Link
                  href="/student-dashboard"
                  className="text-xs font-medium hover:text-green-600 transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  href="/course"
                  className="text-xs font-medium hover:text-green-600 transition-colors duration-200"
                >
                  Courses
                </Link>
                <button
                  onClick={() => setCartDrawer(true)}
                  className="relative p-1.5 hover:bg-green-50 rounded-md transition-colors duration-200"
                >
                  <ShoppingCart size={18} />
                  {cartCourses.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCourses.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs font-medium hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <Link
                href="/student-login"
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Student Login
              </Link>
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
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        direction="right"
        className="p-6 bg-white"
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

        {student ? (
          <div className="space-y-4">
            <Link
              href="/student-dashboard"
              onClick={() => setDrawerOpen(false)}
              className="block py-3 px-4 text-lg font-medium hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/course"
              onClick={() => setDrawerOpen(false)}
              className="block py-3 px-4 text-lg font-medium hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors duration-200"
            >
              Courses
            </Link>
            <button
              onClick={() => {
                setDrawerOpen(false);
                setCartDrawer(true);
              }}
              className="w-full flex items-center justify-between py-3 px-4 text-lg font-medium hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} />
                <span>Cart</span>
              </div>
              {cartCourses.length > 0 && (
                <span className="bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCourses.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setDrawerOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-2 py-3 px-4 text-lg font-medium hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        ) : (
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
              <Link
                href="/student-login"
                onClick={() => setDrawerOpen(false)}
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200 shadow-md"
              >
                Student Login
              </Link>
            </div>
          </div>
        )}
        
        {/* Navigation links for authenticated users */}
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
        </div>
      </Drawer>

      {/* Cart Drawer */}
      <Drawer
        open={cartDrawer}
        onClose={() => setCartDrawer(false)}
        direction="right"
        className="p-6 bg-white"
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
    </>
  );
}
