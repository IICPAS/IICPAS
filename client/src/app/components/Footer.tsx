"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [footerData, setFooterData] = useState({
    companyInfo: {
      name: "IICPA Institute",
      tagline:
        "Empowering future finance professionals with world-class education, expert guidance, and industry-relevant skills for career success.",
      contact: {
        phone: "+91 98765 43210",
        email: "info@iicpa.com",
        address: "123 Education Street, Learning City, LC 12345",
      },
    },
    footerLinks: {
      companyPolicies: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Refund Policy", href: "/refund" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Return Policy", href: "/return" },
      ],
      generalLinks: [
        { name: "About Us", href: "/about" },
        { name: "Courses", href: "/courses" },
        { name: "Blog", href: "/blog" },
        { name: "Contact Us", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Help Center", href: "/help" },
      ],
    },
    socialLinks: [
      {
        platform: "Facebook",
        href: "https://facebook.com/iicpa",
        icon: "FaFacebook",
      },
      {
        platform: "Twitter",
        href: "https://twitter.com/iicpa",
        icon: "FaTwitter",
      },
      {
        platform: "LinkedIn",
        href: "https://linkedin.com/company/iicpa",
        icon: "FaLinkedin",
      },
      {
        platform: "Instagram",
        href: "https://instagram.com/iicpa",
        icon: "FaInstagram",
      },
      {
        platform: "YouTube",
        href: "https://youtube.com/iicpa",
        icon: "FaYoutube",
      },
    ],
    bottomBar: {
      copyright: "IICPA Institute. All rights reserved.",
      legalLinks: [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "/cookies" },
      ],
    },
    colors: {
      background: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      accent: "text-[#3cd664]",
      text: "text-white",
      textSecondary: "text-gray-300",
    },
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Track component mount
  useEffect(() => {
    setMounted(true);
    console.log("🎯 Footer component mounted!");
  }, []);

  // Fetch footer data from API
  useEffect(() => {
    // Only run on client side and after component is mounted
    if (typeof window === "undefined" || !mounted) {
      console.log("🚫 Footer useEffect skipped - not ready");
      setLoading(false);
      return;
    }

    console.log("🚀 Footer useEffect running on client side..."); // Debug log
    console.log("🌐 Current window location:", window.location.href);
    const fetchFooterData = async () => {
      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
        console.log("API_BASE:", API_BASE); // Debug log
        console.log("Fetching from:", `${API_BASE}/footer`); // Debug log
        const response = await fetch(`${API_BASE}/footer`);

        if (response.ok) {
          const data = await response.json();
          console.log("Footer API Response:", data); // Debug log

          // Clean up the data structure to match frontend expectations
          const cleanedData = {
            companyInfo: data.companyInfo || {
              name: "IICPA Institute",
              tagline:
                "Empowering future finance professionals with world-class education, expert guidance, and industry-relevant skills for career success.",
              contact: {
                phone: "+91 98765 43210",
                email: "info@iicpa.com",
                address: "123 Education Street, Learning City, LC 12345",
              },
            },
            footerLinks: {
              companyPolicies: (data.footerLinks?.companyPolicies || []).map(
                (link: { name: string; href: string }) => ({
                  name: link.name,
                  href: link.href,
                })
              ),
              generalLinks: (data.footerLinks?.generalLinks || []).map(
                (link: { name: string; href: string }) => ({
                  name: link.name,
                  href: link.href,
                })
              ),
            },
            socialLinks: (data.socialLinks || []).map(
              (social: { platform: string; href: string; icon: string }) => ({
                platform: social.platform,
                href: social.href,
                icon: social.icon,
              })
            ),
            bottomBar: {
              copyright:
                data.bottomBar?.copyright ||
                "IICPA Institute. All rights reserved.",
              legalLinks: (data.bottomBar?.legalLinks || []).map(
                (link: { name: string; href: string }) => ({
                  name: link.name,
                  href: link.href,
                })
              ),
            },
            colors: data.colors || {
              background:
                "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
              accent: "text-[#3cd664]",
              text: "text-white",
              textSecondary: "text-gray-300",
            },
          };

          setFooterData(cleanedData);
          console.log("✅ Footer data updated successfully!");
          console.log("📊 Updated company name:", cleanedData.companyInfo.name);
          console.log(
            "📚 Updated general links:",
            cleanedData.footerLinks.generalLinks.length,
            "items"
          );
        } else {
          console.error(
            "Failed to fetch footer data, status:",
            response.status
          );
          console.error("Response:", response);
        }
      } catch (error: unknown) {
        console.error("Error fetching footer data:", error);
        console.error(
          "Error details:",
          error instanceof Error ? error.message : "Unknown error"
        );
        // Keep using default data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, [mounted]);

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  const getSocialIcon = (iconName: string) => {
    const iconMap: {
      [key: string]: React.ComponentType<{ className?: string }>;
    } = {
      FaFacebook: FaFacebook,
      FaTwitter: FaTwitter,
      FaLinkedin: FaLinkedin,
      FaInstagram: FaInstagram,
      FaYoutube: FaYoutube,
      FaWhatsapp: FaWhatsapp,
      FaTelegram: FaTelegram,
      FaDiscord: FaDiscord,
    };
    return iconMap[iconName] || FaFacebook;
  };

  return (
    <footer
      className={`${footerData.colors.background} text-white relative overflow-hidden`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/images/footer-pattern.svg')] opacity-5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3cd664] via-[#22c55e] to-[#16a34a]"></div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Company Info */}
          <motion.div
            className="lg:col-span-1"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <h3
                className={`text-2xl font-bold ${footerData.colors.text} mb-2`}
              >
                {footerData.companyInfo.name}
              </h3>
              <p
                className={`${footerData.colors.textSecondary} text-sm leading-relaxed`}
              >
                {footerData.companyInfo.tagline}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div
                className={`flex items-center gap-3 text-sm ${footerData.colors.textSecondary}`}
              >
                <FaPhone className={`w-4 h-4 ${footerData.colors.accent}`} />
                <span>{footerData.companyInfo.contact.phone}</span>
              </div>
              <div
                className={`flex items-center gap-3 text-sm ${footerData.colors.textSecondary}`}
              >
                <FaEnvelope className={`w-4 h-4 ${footerData.colors.accent}`} />
                <span>{footerData.companyInfo.contact.email}</span>
              </div>
              <div
                className={`flex items-start gap-3 text-sm ${footerData.colors.textSecondary}`}
              >
                <FaMapMarkerAlt
                  className={`w-4 h-4 ${footerData.colors.accent} mt-0.5`}
                />
                <span
                  dangerouslySetInnerHTML={{
                    __html: footerData.companyInfo.contact.address.replace(
                      /\n/g,
                      "<br />"
                    ),
                  }}
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {footerData.socialLinks.map((social, index) => {
                const IconComponent = getSocialIcon(social.icon);
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-700 hover:bg-[#3cd664] rounded-full flex items-center justify-center transition-all duration-300 group"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.platform}
                  >
                    <IconComponent className="w-4 h-4 text-gray-300 group-hover:text-white" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Company Policies */}
          <motion.div
            className="lg:col-span-1"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4
              className={`text-lg font-semibold ${footerData.colors.text} mb-4`}
            >
              Company Policy
            </h4>
            <ul className="space-y-3">
              {footerData.footerLinks.companyPolicies.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className={`${footerData.colors.textSecondary} hover:text-green-500 transition-colors duration-300 text-sm cursor-pointer relative z-20`}
                    onClick={() =>
                      console.log("Company Policy link clicked:", link.href)
                    }
                    style={{ pointerEvents: "auto" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* General Links */}
          <motion.div
            className="lg:col-span-1"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4
              className={`text-lg font-semibold ${footerData.colors.text} mb-4`}
            >
              Links
            </h4>
            <ul className="space-y-3">
              {footerData.footerLinks.generalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className={`${footerData.colors.textSecondary} hover:text-green-500 transition-colors duration-300 text-sm cursor-pointer relative z-20`}
                    onClick={() =>
                      console.log("General link clicked:", link.href)
                    }
                    style={{ pointerEvents: "auto" }}
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
        className="bg-gray-900 border-t border-gray-700 py-6 relative z-10"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className={`text-sm ${footerData.colors.textSecondary}`}>
              © {currentYear} {footerData.bottomBar.copyright}
            </div>
            <div
              className={`flex gap-6 text-sm ${footerData.colors.textSecondary}`}
            >
              {footerData.bottomBar.legalLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="hover:text-green-500 transition-colors duration-300 cursor-pointer relative z-20"
                  onClick={() => console.log("Legal link clicked:", link.href)}
                  style={{ pointerEvents: "auto" }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
