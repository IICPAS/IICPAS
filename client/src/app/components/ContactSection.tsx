/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, PhoneCall, MapPin, Send } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

    try {
      await axios.post(`${API_BASE_URL}/contact`, formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
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
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Modern Left Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Modern Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                <span className="text-green-600 font-bold text-lg uppercase tracking-wider">
                  Contact Us
                </span>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Let's{" "}
                <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  Get in Touch
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Ready to start your learning journey? Get in touch with us today!
              </p>
            </motion.div>

            {/* Modern Form */}
            <motion.form 
              className="space-y-6" 
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-6 py-4 rounded-2xl text-gray-900 placeholder:text-gray-500 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:bg-white/90"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full px-6 py-4 rounded-2xl text-gray-900 placeholder:text-gray-500 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:bg-white/90"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full px-6 py-4 rounded-2xl text-gray-900 placeholder:text-gray-500 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:bg-white/90"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-6 py-4 rounded-2xl text-gray-900 placeholder:text-gray-500 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:bg-white/90 resize-none"
                  required
                />
              </motion.div>

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl transform-gpu flex items-center justify-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 2
                }}
                whileTap={{ scale: 0.98 }}
                style={{
                  transform: 'translateZ(10px)',
                  boxShadow: '0 10px 25px -5px rgba(34, 197, 94, 0.4)'
                }}
              >
                Send Message
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <Send size={20} />
                </motion.div>
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Modern Right Info Card */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 shadow-xl transform-gpu"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
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
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Phone Contact */}
              <motion.div 
                className="flex items-start gap-4 group"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ x: 5 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white shadow-lg transform-gpu"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5
                  }}
                  animate={{
                    y: [0, -3, 0],
                    rotate: [0, 1, -1, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    transform: 'translateZ(20px)',
                    boxShadow: '0 10px 25px -5px rgba(34, 197, 94, 0.4)'
                  }}
                >
                  <PhoneCall size={20} />
                </motion.div>
                <div>
                  <p className="font-bold text-gray-900 text-lg mb-1">Phone</p>
                  <p className="text-gray-600">+91 98765 43210</p>
                </div>
              </motion.div>

              {/* Email Contact */}
              <motion.div 
                className="flex items-start gap-4 group"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ x: 5 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg transform-gpu"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5
                  }}
                  animate={{
                    y: [0, -3, 0],
                    rotate: [0, 1, -1, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  style={{
                    transform: 'translateZ(20px)',
                    boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  <Mail size={20} />
                </motion.div>
                <div>
                  <p className="font-bold text-gray-900 text-lg mb-1">Email</p>
                  <p className="text-gray-600">support@iicpa.org</p>
                </div>
              </motion.div>

              {/* Address Contact */}
              <motion.div 
                className="flex items-start gap-4 group"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ x: 5 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg transform-gpu"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5
                  }}
                  animate={{
                    y: [0, -3, 0],
                    rotate: [0, 1, -1, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                  style={{
                    transform: 'translateZ(20px)',
                    boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.4)'
                  }}
                >
                  <MapPin size={20} />
                </motion.div>
                <div>
                  <p className="font-bold text-gray-900 text-lg mb-1">Address</p>
                  <p className="text-gray-600">
                    123 Knowledge Park, New Delhi, India
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Hover Overlay Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1 }}
            />
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-gpu { transform-style: preserve-3d; }
      `}</style>
    </section>
  );
}
