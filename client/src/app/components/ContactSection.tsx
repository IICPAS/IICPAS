/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, PhoneCall, MapPin, Send } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ContactSection() {
  const [contactData, setContactData] = useState({
    title: "Contact Us",
    subtitle: "Let's Get in Touch",
    description: "Ready to start your learning journey? Get in touch with us today!",
    contactInfo: {
      phone: {
        number: "+91 98765 43210",
        label: "Phone"
      },
      email: {
        address: "support@iicpa.org",
        label: "Email"
      },
      address: {
        text: "123 Knowledge Park, New Delhi, India",
        label: "Address"
      }
    },
    form: {
      buttonText: "Send Message",
      successMessage: "Message sent successfully!",
      errorMessage: "Something went wrong. Please try again."
    },
    colors: {
      title: "text-green-600",
      subtitle: "text-gray-900",
      description: "text-gray-600",
      background: "bg-white"
    }
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch("/api/contact");
      if (response.ok) {
        const data = await response.json();
        setContactData(data);
      }
    } catch (error) {
      console.error("Error fetching Contact data:", error);
    } finally {
      setLoading(false);
    }
  };

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
      toast.success(contactData.form.successMessage);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || contactData.form.errorMessage);
    }
  };

  if (loading) {
    return (
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative py-20 ${contactData.colors.background} overflow-hidden`}>
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
            transition={{ duration: 0.02 }}
          >
            {/* Modern Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.02 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                <span className={`${contactData.colors.title} font-bold text-lg uppercase tracking-wider`}>
                  {contactData.title}
                </span>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
              </div>
              

              <h2 className={`text-4xl lg:text-5xl font-bold ${contactData.colors.subtitle} leading-tight mb-6`}>
                {contactData.subtitle}

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Let&apos;s{" "}
                <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  Get in Touch
                </span>

              </h2>
              
              <p className={`text-lg ${contactData.colors.description} leading-relaxed`}>
                {contactData.description}
              </p>
            </motion.div>

            {/* Modern Form */}
            <motion.form 
              className="space-y-6" 
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.02, delay: 0.01 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.02, delay: 0.01 }}
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
                transition={{ duration: 0.02, delay: 0.01 }}
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
                transition={{ duration: 0.02, delay: 0.01 }}
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
                transition={{ duration: 0.02, delay: 0.01 }}
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
                transition={{ duration: 0.02, delay: 0.01 }}
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
                {contactData.form.buttonText}
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
            transition={{ duration: 0.02, delay: 0.01 }}
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
              transition={{ duration: 0.02, delay: 0.01 }}
            >
              {/* Phone Contact */}
              <motion.div 
                className="flex items-start gap-4 group"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.02, delay: 0.01 }}
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
                  <p className="font-bold text-gray-900 text-lg mb-1">{contactData.contactInfo.phone.label}</p>
                  <p className="text-gray-600">{contactData.contactInfo.phone.number}</p>
                </div>
              </motion.div>

              {/* Email Contact */}
              <motion.div 
                className="flex items-start gap-4 group"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.02, delay: 0.01 }}
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
                  <p className="font-bold text-gray-900 text-lg mb-1">{contactData.contactInfo.email.label}</p>
                  <p className="text-gray-600">{contactData.contactInfo.email.address}</p>
                </div>
              </motion.div>

              {/* Address Contact */}
              <motion.div 
                className="flex items-start gap-4 group"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.02, delay: 0.01 }}
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
                  <p className="font-bold text-gray-900 text-lg mb-1">{contactData.contactInfo.address.label}</p>
                  <p className="text-gray-600">
                    {contactData.contactInfo.address.text}
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
