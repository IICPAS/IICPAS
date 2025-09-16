"use client";

import { useEffect, useState } from "react";
import { Calendar, User, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

export default function BlogSection() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await axios.get(`${API_BASE}/blogs`);
        // Filter only blogs that have status === "active"
        const activeBlogs = (res.data || []).filter(
          (blog) => blog.status === "active"
        );
        setBlogs(activeBlogs);
      } catch {
        setBlogs([]);
      }
    }
    fetchBlogs();
  }, []);

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
        {/* Modern Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.02 }}
        >
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.02, delay: 0.01 }}
          >
            Your Source For Ideas, Insights, And{" "}
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              Inspiration
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.02, delay: 0.01 }}
          >
            Discover the latest insights, trends, and inspiration from our expert team
          </motion.p>
        </motion.div>

        {/* Modern Blog Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden transform-gpu hover:shadow-2xl transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.02, delay: index * 0.005 }}
              whileHover={{ 
                scale: 1.03,
                rotateY: 5,
                z: 20
              }}
              style={{
                transform: 'translateZ(20px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
              }}
            >
              {/* Image Container with 3D Effect */}
              <motion.div 
                className="relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={
                    blog.imageUrl?.startsWith("http")
                      ? blog.imageUrl
                      : `${API_BASE.replace("/api", "")}/${blog.imageUrl}`
                  }
                  alt={blog.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Date Badge */}
                <motion.div 
                  className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-2 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Calendar size={14} className="text-green-500" />
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </motion.div>

                {/* Read More Overlay */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl">
                    <Eye size={24} className="text-green-500" />
                  </div>
                </motion.div>
              </motion.div>

              {/* Content Container */}
              <div className="p-6 flex flex-col justify-between flex-1">
                {/* Author Badge */}
                <motion.div 
                  className="mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-full border border-green-200/50">
                    <User size={16} className="text-green-500" />
                    <span>{blog.author}</span>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.02, delay: 0.01 + index * 0.005 }}
                >
                  <Link
                    href={`/blogs/${encodeURIComponent(
                      blog.title.replace(/\s+/g, "-").toLowerCase()
                    )}`}
                    className="text-xl font-bold leading-tight mb-3 text-gray-900 hover:text-green-600 transition-colors duration-300 group-hover:underline"
                  >
                    {blog.title}
                  </Link>
                </motion.div>

                {/* Content Preview */}
                <motion.p 
                  className="text-gray-600 text-sm leading-relaxed mb-4 flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.02, delay: 0.01 + index * 0.005 }}
                >
                  {blog.content.replace(/<[^>]+>/g, "").slice(0, 120)}
                  {blog.content.length > 120 && "..."}
                </motion.p>

                {/* Read More Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.02, delay: 0.01 + index * 0.005 }}
                >
                  <Link
                    href={`/blogs/${encodeURIComponent(
                      blog.title.replace(/\s+/g, "-").toLowerCase()
                    )}`}
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm transition-all duration-300 group-hover:gap-3"
                  >
                    Read More
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight size={16} />
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Blogs Button */}
        {blogs.length > 0 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.02, delay: 0.01 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/blogs"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl transition-all duration-300 hover:shadow-2xl"
              >
                View All Blogs
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-gpu { transform-style: preserve-3d; }
      `}</style>
    </section>
  );
}
