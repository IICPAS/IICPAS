"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  User,
  ArrowRight,
  Eye,
  Clock,
  Tag,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await axios.get(`${API_BASE}/blogs`);
        // Filter only blogs that have status === "active"
        const activeBlogs = (res.data || []).filter(
          (blog) => blog.status === "active"
        );
        setBlogs(activeBlogs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blogs...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24 bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden">
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

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Our Blog
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover insights, trends, and inspiration from our expert team
            </motion.p>
          </div>
        </section>

        {/* Blog Grid Section */}
        <section className="relative py-20 bg-white overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-6">
            {blogs.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No Blogs Yet
                </h3>
                <p className="text-gray-600">
                  Check back soon for amazing content!
                </p>
              </div>
            ) : (
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog, index) => {
                  // Generate fallback image based on blog title or use default
                  const getFallbackImage = (title) => {
                    const images = [
                      "/images/accounting.webp",
                      "/images/course.png",
                      "/images/live-class.jpg",
                      "/images/student.png",
                      "/images/university.png",
                      "/images/vr-student.jpg",
                    ];
                    const hash = title.split("").reduce((a, b) => {
                      a = (a << 5) - a + b.charCodeAt(0);
                      return a & a;
                    }, 0);
                    return images[Math.abs(hash) % images.length];
                  };

                  const imageUrl = blog.imageUrl?.startsWith("http")
                    ? blog.imageUrl
                    : blog.imageUrl
                    ? `${API_BASE.replace("/api", "")}/${blog.imageUrl}`
                    : getFallbackImage(blog.title);

                  return (
                    <motion.div
                      key={blog._id}
                      className="group relative bg-white rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden transform-gpu hover:shadow-3xl transition-all duration-700 hover:-translate-y-2"
                      initial={{ opacity: 0, y: 50, rotateX: 15 }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{
                        scale: 1.02,
                        rotateY: 2,
                        z: 50,
                      }}
                      style={{
                        transformStyle: "preserve-3d",
                        boxShadow:
                          "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      {/* Glassmorphism Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl" />

                      {/* Image Container with Advanced Effects */}
                      <motion.div
                        className="relative overflow-hidden h-72"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <img
                          src={imageUrl}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                          onError={(e) => {
                            e.target.src = getFallbackImage(blog.title);
                          }}
                        />

                        {/* Multi-layer Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Floating Date Badge */}
                        <motion.div
                          className="absolute top-6 left-6 bg-white/95 backdrop-blur-md text-gray-800 text-xs font-bold px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/20"
                          whileHover={{ scale: 1.1, rotate: 2 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Calendar size={16} className="text-green-500" />
                          {blog.createdAt
                            ? new Date(blog.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "Recent"}
                        </motion.div>

                        {/* Category Badge */}
                        <motion.div
                          className="absolute top-6 right-6 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl"
                          whileHover={{ scale: 1.1, rotate: -2 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Tag size={14} />
                          <span>{blog.category || "General"}</span>
                        </motion.div>

                        {/* Reading Time Badge */}
                        <motion.div
                          className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md text-white text-xs font-medium px-3 py-2 rounded-xl flex items-center gap-2"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.3 + index * 0.1,
                          }}
                        >
                          <Clock size={14} />
                          <span>
                            {Math.ceil(blog.content.length / 500)} min read
                          </span>
                        </motion.div>

                        {/* Interactive Read More Overlay */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
                          initial={{ scale: 0.5, rotate: -180 }}
                          whileHover={{ scale: 1, rotate: 0 }}
                        >
                          <motion.div
                            className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/30"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <BookOpen
                              size={32}
                              className="text-green-500 mx-auto"
                            />
                            <p className="text-sm font-semibold text-gray-800 mt-2">
                              Read Article
                            </p>
                          </motion.div>
                        </motion.div>
                      </motion.div>

                      {/* Enhanced Content Container */}
                      <div className="relative p-8 flex flex-col justify-between flex-1 min-h-[280px]">
                        {/* Author Section with Avatar */}
                        <motion.div
                          className="mb-6"
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.2 + index * 0.1,
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {blog.author?.charAt(0) || "A"}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {blog.author || "Anonymous"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Content Creator
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Enhanced Title */}
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.3 + index * 0.1,
                          }}
                        >
                          <Link
                            href={`/blogs/${encodeURIComponent(
                              blog.title.replace(/\s+/g, "-").toLowerCase()
                            )}`}
                            className="text-2xl font-bold leading-tight mb-4 text-gray-900 hover:text-transparent hover:bg-gradient-to-r hover:from-green-600 hover:to-blue-600 hover:bg-clip-text transition-all duration-500 group-hover:underline decoration-2 underline-offset-4"
                          >
                            {blog.title}
                          </Link>
                        </motion.div>

                        {/* Enhanced Content Preview */}
                        <motion.p
                          className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3"
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.4 + index * 0.1,
                          }}
                        >
                          {blog.content.replace(/<[^>]+>/g, "").slice(0, 150)}
                          {blog.content.length > 150 && "..."}
                        </motion.p>

                        {/* Enhanced Read More Button */}
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.5 + index * 0.1,
                          }}
                        >
                          <Link
                            href={`/blogs/${encodeURIComponent(
                              blog.title.replace(/\s+/g, "-").toLowerCase()
                            )}`}
                            className="group/btn inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 hover:shadow-xl hover:shadow-green-500/25 hover:-translate-y-1"
                          >
                            <span>Read Full Article</span>
                            <motion.div
                              whileHover={{ x: 5, rotate: 5 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ArrowRight size={18} />
                            </motion.div>
                          </Link>
                        </motion.div>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-blue-400/20 to-green-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-gpu {
          transform-style: preserve-3d;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.05);
        }
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </>
  );
}
