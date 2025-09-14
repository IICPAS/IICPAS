"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    courses: [
      { name: "Finance Courses", href: "/courses/finance" },
      { name: "Accounting", href: "/courses/accounting" },
      { name: "Taxation", href: "/courses/taxation" },
      { name: "Auditing", href: "/courses/auditing" },
      { name: "Investment Banking", href: "/courses/investment-banking" },
    ],
    resources: [
      { name: "Blog", href: "/blog" },
      { name: "Study Materials", href: "/resources" },
      { name: "Practice Tests", href: "/practice" },
      { name: "Career Guidance", href: "/career" },
      { name: "Placement Support", href: "/placement" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/team" },
      { name: "Success Stories", href: "/success" },
      { name: "Partners", href: "/partners" },
      { name: "Contact Us", href: "/contact" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Live Sessions", href: "/live" },
      { name: "Student Login", href: "/login" },
      { name: "FAQ", href: "/faq" },
      { name: "Privacy Policy", href: "/privacy" },
    ]
  };

  const socialLinks = [
    { icon: FaFacebook, href: "https://facebook.com/iicpa", label: "Facebook" },
    { icon: FaTwitter, href: "https://twitter.com/iicpa", label: "Twitter" },
    { icon: FaLinkedin, href: "https://linkedin.com/company/iicpa", label: "LinkedIn" },
    { icon: FaInstagram, href: "https://instagram.com/iicpa", label: "Instagram" },
    { icon: FaYoutube, href: "https://youtube.com/iicpa", label: "YouTube" },
  ];


  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/images/footer-pattern.svg')] opacity-5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3cd664] via-[#22c55e] to-[#16a34a]"></div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <motion.div
            className="lg:col-span-1"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                IICPA <span className="text-[#3cd664]">Institute</span>
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Empowering future finance professionals with world-class education, 
                expert guidance, and industry-relevant skills for career success.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <FaPhone className="w-4 h-4 text-[#3cd664]" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <FaEnvelope className="w-4 h-4 text-[#3cd664]" />
                <span>info@iicpa.com</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-300">
                <FaMapMarkerAlt className="w-4 h-4 text-[#3cd664] mt-0.5" />
                <span>123 Education Street,<br />Learning City, LC 12345</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 hover:bg-[#3cd664] rounded-full flex items-center justify-center transition-all duration-300 group"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-gray-300 group-hover:text-white" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Courses */}
          <motion.div
            className="lg:col-span-1"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Courses</h4>
            <ul className="space-y-3">
              {footerLinks.courses.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-green-500 transition-colors duration-300 text-sm cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            className="lg:col-span-1"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-green-500 transition-colors duration-300 text-sm cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            className="lg:col-span-1"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-green-500 transition-colors duration-300 text-sm cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            className="lg:col-span-1"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-green-500 transition-colors duration-300 text-sm cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>


      </div>

      {/* Bottom Bar */}
      <motion.div
        className="bg-gray-900 border-t border-gray-700 py-6"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {currentYear} IICPA Institute. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/terms" className="hover:text-green-500 transition-colors duration-300 cursor-pointer">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-green-500 transition-colors duration-300 cursor-pointer">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="hover:text-green-500 transition-colors duration-300 cursor-pointer">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}