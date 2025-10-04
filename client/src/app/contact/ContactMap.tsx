"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaDirections,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

export default function ContactMap() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Us Here
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Visit our office or get directions to our location. We're always
            happy to welcome you in person.
          </p>
        </motion.div>

        {/* Full Width Map */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            {/* Google Maps Embed */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.1234567890!2d77.4567890123!3d28.4567890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c8f1234567890%3A0x1234567890abcdef!2sKasana%20Tower%2C%20Alpha%20Commercial%20Belt%2C%20Greater%20Noida%2C%20Uttar%20Pradesh%20201308!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl"
            />

            {/* Map Overlay Info */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaMapMarkerAlt className="text-red-500 text-lg" />
                <span className="font-semibold text-gray-900">
                  IICPA Institute
                </span>
              </div>
              <p className="text-sm text-gray-600">
                SHOP NO 712-A, SEVENTH FLOOR
                <br />
                KASANA TOWER, ALPHA COMMERCIAL BELT
                <br />
                Greater Noida, Uttar Pradesh, 201308
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
