"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaUsers,
  FaStar,
  FaBookOpen,
} from "react-icons/fa";

// Mock data for centers
const mockCenters = [
  {
    id: 1,
    name: "IICPA Delhi Center",
    location: "Connaught Place, New Delhi",
    phone: "+91 98765 43210",
    email: "delhi@iicpa.in",
    rating: 4.8,
    students: 1250,
    courses: 25,
    image: "/images/college.jpg",
    availableCourses: [
      "Basic Accounting",
      "Tally ERP 9",
      "Advanced Excel",
      "GST Training",
    ],
  },
  {
    id: 2,
    name: "IICPA Mumbai Center",
    location: "Andheri West, Mumbai",
    phone: "+91 98765 43211",
    email: "mumbai@iicpa.in",
    rating: 4.7,
    students: 980,
    courses: 22,
    image: "/images/college.avif",
    availableCourses: [
      "Basic Accounting",
      "Tally ERP 9",
      "Advanced Excel",
      "Income Tax",
    ],
  },
  {
    id: 3,
    name: "IICPA Bangalore Center",
    location: "Koramangala, Bangalore",
    phone: "+91 98765 43212",
    email: "bangalore@iicpa.in",
    rating: 4.9,
    students: 1100,
    courses: 28,
    image: "/images/college.jpg",
    availableCourses: [
      "Basic Accounting",
      "Tally ERP 9",
      "Advanced Excel",
      "Audit Training",
    ],
  },
  {
    id: 4,
    name: "IICPA Chennai Center",
    location: "T Nagar, Chennai",
    phone: "+91 98765 43213",
    email: "chennai@iicpa.in",
    rating: 4.6,
    students: 850,
    courses: 20,
    image: "/images/college.avif",
    availableCourses: [
      "Basic Accounting",
      "Tally ERP 9",
      "Advanced Excel",
      "Company Law",
    ],
  },
];

export default function SearchCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [filteredCenters, setFilteredCenters] = useState(mockCenters);
  const [hasSearched, setHasSearched] = useState(false);

  const locations = [
    "All Locations",
    "New Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
  ];
  const courses = [
    "All Courses",
    "Basic Accounting",
    "Tally ERP 9",
    "Advanced Excel",
    "GST Training",
    "Income Tax",
    "Audit Training",
    "Company Law",
  ];

  const handleSearch = () => {
    setHasSearched(true);
    let filtered = mockCenters;

    if (searchTerm) {
      filtered = filtered.filter(
        (center) =>
          center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          center.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation && selectedLocation !== "All Locations") {
      filtered = filtered.filter((center) =>
        center.location.includes(selectedLocation)
      );
    }

    if (selectedCourse && selectedCourse !== "All Courses") {
      filtered = filtered.filter((center) =>
        center.availableCourses.includes(selectedCourse)
      );
    }

    setFilteredCenters(filtered);
  };

  const handleBookCourse = (centerId: number, courseName: string) => {
    // This would typically redirect to a booking page or open a modal
    console.log(`Booking ${courseName} at center ${centerId}`);
    // You can implement the booking logic here
  };

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-green-100/30 to-blue-100/30 rounded-full blur-3xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-100/30 to-green-100/30 rounded-full blur-3xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            <span className="text-green-600 font-bold text-sm uppercase tracking-wider">
              Find Your Nearest Center
            </span>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
          </motion.div>
          
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Search & Book
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent"> Courses</span> at
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"> IICPA Centers</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find the nearest IICPA center, explore available courses, and book
            your preferred training program with just a few clicks.
          </motion.p>
        </motion.div>

        {/* 3D Search Filters */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border border-gray-200/50 transform-gpu"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ 
            scale: 1.02,
            rotateY: 2
          }}
          style={{
            transform: 'translateZ(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
          }}
        >
          <div className="grid md:grid-cols-4 gap-6">
            {/* 3D Search Input */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white bg-green-500 p-3 rounded-xl shadow-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaSearch className="text-xl font-bold" style={{ fontSize: '20px' }} />
              </motion.div>
              <input
                type="text"
                placeholder="Search centers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-20 pr-4 py-4 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white"
              />
            </motion.div>

            {/* 3D Location Filter */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.div
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white bg-blue-500 p-3 rounded-xl shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FaMapMarkerAlt className="text-xl font-bold" style={{ fontSize: '20px' }} />
              </motion.div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* 3D Course Filter */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white bg-purple-500 p-3 rounded-xl shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <FaBookOpen className="text-xl font-bold" style={{ fontSize: '20px' }} />
              </motion.div>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white"
              >
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* 3D Search Button */}
            <motion.button
              onClick={handleSearch}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl transition-all duration-300 transform-gpu hover:scale-105 hover:shadow-green-500/25 border border-white/20"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5
              }}
              whileTap={{ scale: 0.95 }}
            >
              Search Centers
            </motion.button>
          </div>
        </motion.div>

        {/* Results - Only show if search has been performed */}
        {hasSearched && (
          <div className="space-y-6">
            {filteredCenters.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  No Centers Found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria or contact us for
                  assistance.
                </p>
              </div>
            ) : (
              filteredCenters.map((center) => (
                <div
                  key={center.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="grid lg:grid-cols-3 gap-6 p-8">
                    {/* Center Image */}
                    <div className="relative">
                      <img
                        src={center.image}
                        alt={center.name}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {center.rating} ⭐
                      </div>
                    </div>

                    {/* Center Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {center.name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <FaMapMarkerAlt className="text-green-500" />
                          <span>{center.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <FaPhone className="text-green-500" />
                          <span>{center.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaEnvelope className="text-green-500" />
                          <span>{center.email}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {center.students}
                          </div>
                          <div className="text-sm text-gray-600">Students</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {center.courses}
                          </div>
                          <div className="text-sm text-gray-600">Courses</div>
                        </div>
                      </div>
                    </div>

                    {/* Available Courses & Booking */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Available Courses
                        </h4>
                        <div className="space-y-2">
                          {center.availableCourses.map((course, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                            >
                              <span className="text-gray-700 font-medium">
                                {course}
                              </span>
                              <button
                                onClick={() =>
                                  handleBookCourse(center.id, course)
                                }
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300"
                              >
                                Book Now
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Contact */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                        <h5 className="font-semibold text-gray-900 mb-2">
                          Need Help?
                        </h5>
                        <p className="text-sm text-gray-600 mb-3">
                          Contact this center directly for personalized
                          assistance.
                        </p>
                        <Link
                          href={`tel:${center.phone}`}
                          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300"
                        >
                          <FaPhone />
                          Call Center
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Can&apos;t Find Your Location?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              We&apos;re expanding! Contact us to request a new center in your
              area or explore our online learning options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-colors duration-300"
              >
                Request New Center
              </Link>
              <Link
                href="/courses"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Explore Online Courses
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-gpu { transform-style: preserve-3d; }
      `}</style>
    </section>
  );
}
