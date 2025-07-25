"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0b1224] text-white pt-12 pb-6 px-6 md:px-20">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Column 1: About & Social */}
        <div>
          <p className="text-sm mb-4 opacity-80">
            Lorem Ipsum is simply dummy text of the printing and typesetting
          </p>
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

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-yellow-400 w-fit">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + Courses
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + Live class
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-yellow-400 w-fit">
            Support
          </h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + Became Partners
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + Privacy & Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + Refund Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + Live Workshop
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + Chose Career
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Courses */}
        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-yellow-400 w-fit">
            Our Courses
          </h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + Website Design
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + Digital Marketing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + Product Design
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + Web Development
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + App Development
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#3cd664]">
                + Many More
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center mt-10 text-sm text-white/60 border-t border-white/20 pt-6">
        © {new Date().getFullYear()} IICPA Institute. All rights reserved.
      </div>
    </footer>
  );
}
