"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0b1224] text-white pt-12 pb-6 px-6 md:px-20">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Column 1: IICPA Institute (About) */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-yellow-400 border-b border-yellow-400 w-fit">
            IICPA Institute
          </h3>
          <p className="text-sm mb-4 opacity-80">
            IICPA Institute is a premier educational organization committed to
            excellence in professional development and skill enhancement.
          </p>
          <div className="flex items-center gap-2 mb-4">
            <FaPhone className="text-green-400" />
            <span className="text-sm opacity-80">+91 98765 43210</span>
          </div>
          <div className="flex gap-4 mb-4">
            <a
              href="#"
              className="p-2 rounded-full bg-white text-[#0b1224] hover:bg-[#3cd664] transition"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-white text-[#0b1224] hover:bg-[#3cd664] transition"
            >
              <FaPinterestP />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-white text-[#0b1224] hover:bg-[#3cd664] transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="p-2 rounded-full bg-white text-[#0b1224] hover:bg-[#3cd664] transition"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Column 2: Our Policy */}
        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-yellow-400 w-fit">
            Our Policy
          </h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li>
              <a href="/privacy-policy" className="hover:text-[#3cd664]">
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/cancellation-refund-policy"
                className="hover:text-[#3cd664]"
              >
                Cancellation & Refund Policy
              </a>
            </li>
            <li>
              <a href="/terms-conditions" className="hover:text-[#3cd664]">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="/shipping-delivery" className="hover:text-[#3cd664]">
                Shipping & Delivery
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-yellow-400 w-fit">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li>
              <Link href="/" className="hover:text-[#3cd664]">
                Home
              </Link>
            </li>
            <li>
              <a href="/about" className="hover:text-[#3cd664]">
                About
              </a>
            </li>
            <li>
              <a href="/courses" className="hover:text-[#3cd664]">
                Courses
              </a>
            </li>
            <li>
              <a href="/live-session" className="hover:text-[#3cd664]">
                Live Sessions
              </a>
            </li>
            <li>
              <a href="/jobs" className="hover:text-[#3cd664]">
                Jobs
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-[#3cd664]">
                Contact
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-[#3cd664]">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-yellow-400 w-fit">
            Contact Info
          </h3>
          <p className="text-sm mb-4 text-yellow-400">
            &ldquo;Empowering Careers, Building Futures&rdquo; - IICPA Motto
          </p>
          <div className="space-y-3 text-sm opacity-90">
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-green-400 mt-1 flex-shrink-0" />
              <span>
                IICPA Institute, Professional Development Center, New Delhi,
                India
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-green-400" />
              <a href="mailto:info@iicpa.in" className="hover:text-[#3cd664]">
                info@iicpa.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center mt-10 text-sm text-white/60 border-t border-white/20 pt-6">
        © {new Date().getFullYear()} IICPA Institute. All rights reserved.
      </div>
    </footer>
  );
}
