"use client";

import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import { IconType } from "react-icons";

interface ContactBox {
  title: string;
  content: string;
  icon: string;
  bg: string;
}

const iconMap: { [key: string]: IconType } = {
  FaMapMarkerAlt: FaMapMarkerAlt,
  FaPhoneAlt: FaPhoneAlt,
  FaEnvelope: FaEnvelope,
  FaClock: FaClock,
};

export default function ContactBoxes() {
  const [contactInfo, setContactInfo] = useState<ContactBox[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const response = await fetch(`${API_BASE}/contact-info/active`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setContactInfo(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching contact info:", error);
      // Fallback to default data if API fails
      setContactInfo([
        {
          title: "Our Address",
          content: "3149 New Creek Road, <br />Huntsville, Alabama, USA",
          icon: "FaMapMarkerAlt",
          bg: "from-purple-100 to-white",
        },
        {
          title: "Contact Number",
          content: "+12 (00) 123 456789 <br /> +91 (000) 1245 8963",
          icon: "FaPhoneAlt",
          bg: "from-pink-100 to-white",
        },
        {
          title: "Email Addresss",
          content: "info@domain.com <br /> support@domain.com",
          icon: "FaEnvelope",
          bg: "from-yellow-100 to-white",
        },
        {
          title: "Class Schedule",
          content: "10:00 AM - 6:00 PM <br /> Monday - Friday",
          icon: "FaClock",
          bg: "from-green-100 to-white",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 px-4 md:px-20">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-gray-100 to-white rounded-2xl p-6 shadow-sm animate-pulse"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 shadow mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 px-4 md:px-20">
      {contactInfo.map((box, idx) => {
        const IconComponent = iconMap[box.icon];
        return (
          <div
            key={idx}
            className={`bg-gradient-to-br ${box.bg} rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow mb-4">
              <IconComponent className="text-2xl text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {box.title}
            </h3>
            <p 
              className="text-sm text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: box.content }}
            />
          </div>
        );
      })}
    </div>
  );
}
