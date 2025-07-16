"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

const navLinks = [
  "Home",
  "About",
  "Jobs",
  "Course",
  "Live Session",
  "Blog",
  "Contact",
];

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

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
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-[#003057]">
            <img src="/images/logo.png" alt="IICPA Logo" className="h-10" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-gray-800 font-medium">
            {navLinks.map((link) => (
              <Link
                key={link}
                href={`/${link.toLowerCase().replace(" ", "-")}`}
                className={`hover:text-green-600 transition ${
                  pathname === `/${link.toLowerCase().replace(" ", "-")}`
                    ? "text-green-600"
                    : ""
                }`}
              >
                {link}
              </Link>
            ))}

            {/* Contact */}
            <div className="flex items-center gap-1 ml-4 text-green-600 text-sm font-semibold">
              <span className="hidden md:inline">📞</span> +12 (123) 456 78900
            </div>
          </nav>

          {/* Auth / Cart */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/cart" className="relative">
              🛒
              <span className="absolute -top-2 -right-2 text-xs bg-green-600 text-white px-1 rounded-full">
                2
              </span>
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-700 hover:text-green-600"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <button
            className="lg:hidden text-gray-800"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={28} />
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
          <h2 className="text-lg font-bold text-[#003057]">Menu</h2>
          <button onClick={() => setDrawerOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-4 text-lg font-medium">
          {navLinks.map((link) => (
            <Link
              key={link}
              href={`/${link.toLowerCase().replace(" ", "-")}`}
              className="hover:text-green-600"
              onClick={() => setDrawerOpen(false)}
            >
              {link}
            </Link>
          ))}
          <Link href="/cart">🛒 Cart</Link>
          <Link href="/login">Sign In</Link>
          <p className="text-sm mt-4 text-gray-500">
            Support: +12 (123) 456 78900
          </p>
        </nav>
      </Drawer>
    </>
  );
}
