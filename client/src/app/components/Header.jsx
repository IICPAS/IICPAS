"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Menu, X, LogOut, ShoppingCart, Trash2 } from "lucide-react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Course", href: "/course" },
  {
    name: "Centres",
    children: [
      { name: "GREATER NOIDA", href: "/centres/greater-noida" },
      { name: "GREATER NOIDA WEST", href: "/centres/greater-noida-west" },
      { name: "DELHI", href: "/centres/delhi" },
      { name: "GURGAON", href: "/centres/gurgaon" },
      { name: "GHAZIABAD", href: "/centres/ghaziabad" },
    ],
  },
  {
    name: "Training on site",
    children: [
      { name: "Practical Training", href: "/training/practical" },
      { name: "College on site training", href: "/join/college" },
      { name: "Corporate on site training", href: "/placements/hire" },
    ],
  },
  {
    name: "Placements",
    children: [
      { name: "HIRE FROM US", href: "/placements/hire" },
      { name: "APPLY FOR JOB", href: "/jobs" },
    ],
  },
  {
    name: "Join us",
    children: [
      { name: "Centre", href: "/join/centre" },
      { name: "College", href: "/join/college" },
    ],
  },
  { name: "Live Session", href: "/live-session" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartDrawer, setCartDrawer] = useState(false);
  const [student, setStudent] = useState(null);
  const [cartCourses, setCartCourses] = useState([]);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 60) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
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

  const handleRemoveFromCart = async (courseId) => {
    try {
      await axios.post(
        `${API}/api/v1/students/remove-from-cart/${student._id}`,
        { courseId },
        { withCredentials: true }
      );
      fetchStudentAndCart();
    } catch {
      alert("Failed to remove item.");
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.post(
        `${API}/api/v1/students/clear-cart/${student._id}`,
        {},
        { withCredentials: true }
      );
      fetchStudentAndCart();
    } catch {
      alert("Failed to clear cart.");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-white shadow transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#003057]">
            <img src="/images/logo.png" alt="IICPA Logo" className="h-12" />
          </Link>

          {!student && (
            <nav className="hidden lg:flex items-center gap-8 text-[1.85vmin] text-gray-800 font-medium">
              {navLinks.map((item) =>
                item.children ? (
                  <div key={item.name} className="relative group">
                    <button className="flex items-center gap-1 hover:text-green-600 transition">
                      {item.name}
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white shadow-xl rounded-md opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-3 py-1.5 text-sm hover:bg-green-50 hover:text-green-700 transition"
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
                    className={`hover:text-green-600 transition ${
                      pathname === item.href ? "text-green-600" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </nav>
          )}

          {/* CTA / User */}
          <div className="hidden lg:flex items-center space-x-6">
            {student ? (
              <>
                <button
                  onClick={() => setCartDrawer(true)}
                  className="relative"
                >
                  <ShoppingCart size={22} />
                  {cartCourses.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCourses.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium hover:text-red-600"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link
                href="/student-login"
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition"
              >
                Student Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          {!student && (
            <button
              className="lg:hidden text-gray-800"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu size={26} />
            </button>
          )}
        </div>
      </header>

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
            {/* {cartCourses.length > 0 && (
              <button onClick={handleClearCart}>
                <X size={20} className="text-red-500" />
              </button>
            )} */}
            <button onClick={() => setCartDrawer(false)}>
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
                className="border-[0.5px] p-3 rounded-md shadow-sm bg-gray-50 flex flex-col items-center gap-4"
              >
                <button onClick={() => handleRemoveFromCart(c._id)}>
                  <Trash2 size={18} className="text-red-600" />
                </button>
                <img
                  src={API + c.image}
                  alt={c.title}
                  className="h-28 w-32 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold text-lg">{c.title}</p>
                  <p className="text-xs text-gray-500 text-center">
                    ₹{c.price}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => handleBuyNow(c._id)}
                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
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
