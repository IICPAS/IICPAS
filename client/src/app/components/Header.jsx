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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartDrawer, setCartDrawer] = useState(false);
  const [student, setStudent] = useState(null);
  const [cartCourses, setCartCourses] = useState([]);
  const [wishlistCourses, setWishlistCourses] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const isDashboardPage =
    pathname.includes("-dashboard") || pathname.includes("/dashboard");
  if (isDashboardPage) return null;

  const fetchStudentAndCart = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      if (adminToken) {
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

      const wishlistRes = await axios.get(
        `${API}/api/v1/students/get-wishlist/${studentData._id}`,
        { withCredentials: true }
      );
      const wishlistIDs = wishlistRes.data.wishlist || [];

      const allCourses = await axios.get(`${API}/api/courses`);
      const courseList = allCourses.data.courses || allCourses.data;

      setCartCourses(courseList.filter((c) => cartIDs.includes(c._id)));
      setWishlistCourses(courseList.filter((c) => wishlistIDs.includes(c._id)));
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest(".profile-dropdown")) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileDropdown]);

  const handleLogout = async () => {
    try {
      await axios.get(`${API}/api/v1/students/logout`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setStudent(null);
      setCartCourses([]);
      setWishlistCourses([]);
      setShowProfileDropdown(false);
      window.location.href = "/";
    }
  };

  // ... keep all your existing handlers (handleBuyNow, handleRemoveFromCart, etc.)

  return (
    <>
      <AlertMarquee />
      <header
        className="fixed left-0 w-full z-40 bg-white shadow-lg"
        style={{ top: "40px" }}
      >
        <div className="w-full px-2 md:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-[#003057]">
            <img src="/images/logo.png" alt="IICPA Logo" className="h-12" />
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((item) =>
              item.children ? (
                <div key={item.name} className="relative group">
                  <button className="flex items-center gap-1 py-1.5 px-2 hover:text-green-600 hover:bg-green-50 rounded-md">
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
                  <div className="absolute left-0 mt-2 w-40 bg-white shadow-xl rounded-lg opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-3 py-2 text-sm hover:bg-green-50"
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
                  className={`py-1.5 px-2 hover:text-green-600 hover:bg-green-50 rounded-md ${
                    pathname === item.href ? "text-green-600 bg-green-50" : ""
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAdmin ? (
              <Link
                href="/admin-dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Admin Dashboard
              </Link>
            ) : student ? (
              <div className="relative profile-dropdown">
                 <button
                   onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                   className="w-12 h-12 rounded-full overflow-hidden bg-green-600 hover:bg-green-700 transition-colors"
                 >
                  {student.image ? (
                    <img 
                      src={student.image.startsWith('http') ? student.image : `${API}/${student.image}`}
                      alt={student.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center" style={{display: student.image ? 'none' : 'flex'}}>
                    <User size={20} className="text-white" />
                  </div>
                </button>
                
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-3 w-56 bg-white shadow-2xl rounded-xl border border-gray-100 z-50 overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <User size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{student.name}</p>
                          <p className="text-xs text-green-100">{student.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/student-dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <BookOpen size={18} className="text-gray-400 group-hover:text-green-600" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                      <Link
                        href="/student-dashboard?tab=profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <User size={18} className="text-gray-400 group-hover:text-green-600" />
                        <span className="font-medium">Profile</span>
                      </Link>
                      <Link
                        href="/student-dashboard?tab=wishlist"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <Star size={18} className="text-gray-400 group-hover:text-green-600" />
                        <span className="font-medium">Wishlist</span>
                      </Link>
                      
                      {/* Divider */}
                      <div className="border-t border-gray-100 my-2"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group w-full text-left"
                      >
                        <LogOut size={18} className="text-red-400 group-hover:text-red-600" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/student-login"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Digital Hub
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-800 p-1.5 hover:bg-gray-100 rounded-md"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Keep your Drawer (mobile menu + cart drawer) unchanged */}
    </>
  );
}
