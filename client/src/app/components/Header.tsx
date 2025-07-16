"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

// Nav structure with dropdowns
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
      { name: "College on site training", href: "/training/college" },
      { name: "Corporate on site training", href: "/training/corporate" },
    ],
  },
  {
    name: "Placements",
    children: [
      { name: "HIRE FROM US", href: "/placements/hire" },
      { name: "APPLY FOR JOB", href: "/placements/apply" },
    ],
  },
  {
    name: "Join us",
    children: [
      { name: "Centre", href: "/join/centre" },
      { name: "College", href: "/join/college" },
      { name: "International Organisations", href: "/join/international" },
    ],
  },
  { name: "Live Session", href: "/live-session" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );
  };

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

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-white shadow transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-[#003057]">
            <img src="/images/logo.png" alt="IICPA Logo" className="h-10" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm text-gray-800 font-medium relative">
            {navLinks.map((item) =>
              item.children ? (
                <div key={item.name} className="relative group">
                  <button className="flex items-center gap-1 hover:text-green-600 transition">
                    {item.name}
                    <svg
                      className="w-3 h-3 transition-transform transform group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-xl rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-200 z-50">
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

          {/* CTA - Student Login */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              href="/student-login"
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition"
            >
              Student Login
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden text-gray-800"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        direction="right"
        className="p-6 bg-white"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-bold text-[#003057]">Menu</h2>
          <button onClick={() => setDrawerOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 text-sm font-medium">
          {navLinks.map((item) => {
            const hasChildren = !!item.children;
            const isOpen = expandedMenus.includes(item.name);

            return (
              <div key={item.name}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className="w-full flex items-center justify-between text-left hover:text-green-600"
                    >
                      <span>{item.name}</span>
                      <span className="text-lg">{isOpen ? "−" : "+"}</span>
                    </button>
                    <div
                      className={`ml-4 mt-1 flex flex-col gap-1 overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setDrawerOpen(false)}
                          className="hover:text-green-600"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className="hover:text-green-600"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            );
          })}

          <Link
            href="/student-login"
            onClick={() => setDrawerOpen(false)}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition text-center"
          >
            Student Login
          </Link>
        </nav>
      </Drawer>
    </>
  );
}
