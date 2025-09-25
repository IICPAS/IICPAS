"use client";

import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

const boxes = [
  {
    title: "Our Address",
    icon: <FaMapMarkerAlt className="text-2xl text-purple-600" />,
    content: (
      <>
        3149 New Creek Road, <br />
        Huntsville, Alabama, USA
      </>
    ),
    bg: "from-purple-100 to-white",
  },
  {
    title: "Contact Number",
    icon: <FaPhoneAlt className="text-2xl text-pink-600" />,
    content: (
      <>
        +12 (00) 123 456789 <br /> +91 (000) 1245 8963
      </>
    ),
    bg: "from-pink-100 to-white",
  },
  {
    title: "Email Addresss",
    icon: <FaEnvelope className="text-2xl text-yellow-600" />,
    content: (
      <>
        info@domain.com <br /> support@domain.com
      </>
    ),
    bg: "from-yellow-100 to-white",
  },
  {
    title: "Class Schedule",
    icon: <FaClock className="text-2xl text-green-600" />,
    content: (
      <>
        10:00 AM - 6:00 PM <br /> Monday - Friday
      </>
    ),
    bg: "from-green-100 to-white",
  },
];

export default function ContactBoxes() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 px-4 md:px-20">
      {boxes.map((box, idx) => (
        <div
          key={idx}
          className={`bg-gradient-to-br ${box.bg} rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300`}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow mb-4">
            {box.icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {box.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{box.content}</p>
        </div>
      ))}
    </div>
  );
}
