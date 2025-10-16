"use client";

import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { IconType } from "react-icons";
import { motion } from "framer-motion";

interface ContactBox {
  title: string;
  content: string;
  icon: string;
  bg: string;
  color: string;
  _id?: string;
  isActive?: boolean;
  order?: number;
}

const iconMap: { [key: string]: IconType } = {
  FaMapMarkerAlt: FaMapMarkerAlt,
  FaPhoneAlt: FaPhoneAlt,
  FaEnvelope: FaEnvelope,
};

export default function ContactBoxes() {
  const [contactInfo, setContactInfo] = useState<ContactBox[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use hardcoded data directly - no API call needed
    setContactInfo([
      {
        title: "Address",
        content:
          "SHOP NO 712-A, SEVENTH FLOOR, KASANA TOWER, ALPHA COMMERCIAL BELT, Greater Noida, Gautam Buddha Nagar,Uttar Pradesh, 201308",
        icon: "FaMapMarkerAlt",
        bg: "from-blue-50 to-blue-100",
        color: "text-blue-700",
      },
      {
        title: "Phone",
        content: "+91 9593330999",
        icon: "FaPhoneAlt",
        bg: "from-green-50 to-green-100",
        color: "text-green-700",
      },
      {
        title: "Email",
        content: "support@iicpa.org",
        icon: "FaEnvelope",
        bg: "from-purple-50 to-purple-100",
        color: "text-purple-700",
      },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-100 rounded-xl p-6 shadow-sm animate-pulse"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 shadow mb-4"></div>
                <div className="h-5 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Contact Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((box, idx) => {
            const IconComponent = iconMap[box.icon];
            return (
              <motion.div
                key={idx}
                className={`bg-gradient-to-br ${box.bg} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50 relative overflow-hidden`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                {/* Shining overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>

                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md mb-4 relative z-10`}
                >
                  <IconComponent className={`text-lg ${box.color}`} />
                </div>
                <h3
                  className={`text-sm font-semibold ${box.color} mb-3 relative z-10`}
                >
                  {box.title}
                </h3>
                <p
                  className={`${box.color}/80 leading-relaxed text-xs relative z-10`}
                  dangerouslySetInnerHTML={{ __html: box.content }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
