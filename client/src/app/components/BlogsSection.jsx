"use client";

import { Calendar, User, ArrowRight, Eye, Clock, Tag, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BlogSection() {
  // Static blog data for instant loading
  const blogs = [
    {
      _id: "1",
      title: "Master the Art of Financial Planning: A Complete Guide",
      content: "Learn the essential strategies for effective financial planning that will help you secure your future and achieve your financial goals. This comprehensive guide covers everything from budgeting to investment strategies.",
      author: "Dr. Sarah Johnson",
      category: "Finance",
      createdAt: new Date().toISOString(),
      imageUrl: "/images/accounting.webp"
    },
    {
      _id: "2", 
      title: "Excel Mastery: Advanced Techniques for Professionals",
      content: "Discover advanced Excel techniques that will make you more productive and efficient in your professional work. From complex formulas to data visualization, master the tools that matter.",
      author: "Michael Chen",
      category: "Technology",
      createdAt: new Date().toISOString(),
      imageUrl: "/images/course.png"
    },
    {
      _id: "3",
      title: "The Future of Online Learning: Trends and Innovations",
      content: "Explore the latest trends in online education and how technology is revolutionizing the way we learn. From AI-powered learning to virtual reality classrooms, discover what's next.",
      author: "Emily Rodriguez",
      category: "Education",
      createdAt: new Date().toISOString(),
      imageUrl: "/images/live-class.jpg"
    }
  ];

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Lightweight Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-green-100/20 to-blue-100/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-100/20 to-green-100/20 rounded-full blur-3xl animate-float-reverse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Optimized Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 animate-fade-in-up">
            Your Source For Ideas, Insights, And{" "}
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              Inspiration
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Discover the latest insights, trends, and inspiration from our expert team
          </p>
        </div>

        {/* Ultra Modern Blog Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => {
            // Generate fallback image based on blog title or use default
            const getFallbackImage = (title) => {
              const images = [
                '/images/accounting.webp',
                '/images/course.png',
                '/images/live-class.jpg',
                '/images/student.png',
                '/images/university.png',
                '/images/vr-student.jpg'
              ];
              const hash = title.split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
              }, 0);
              return images[Math.abs(hash) % images.length];
            };

            const imageUrl = blog.imageUrl?.startsWith("http")
              ? blog.imageUrl
              : blog.imageUrl
              ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8080"}/${blog.imageUrl}`
              : getFallbackImage(blog.title);

            return (
              <div
                key={blog._id}
                className="group relative bg-white rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl" />
                
                {/* Optimized Image Container */}
                <div className="relative overflow-hidden h-72 group-hover:scale-105 transition-transform duration-500">
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
                      ? new Date(blog.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Recent"}
                  </motion.div>

                  {/* Category Badge */}
                  <motion.div 
                    className="absolute top-6 right-6 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl"
                    whileHover={{ scale: 1.1, rotate: -2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Tag size={14} />
                    <span>{blog.category || 'General'}</span>
                  </motion.div>

                  {/* Reading Time Badge */}
                  <motion.div 
                    className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md text-white text-xs font-medium px-3 py-2 rounded-xl flex items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <Clock size={14} />
                    <span>{Math.ceil(blog.content.length / 500)} min read</span>
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
                      <BookOpen size={32} className="text-green-500 mx-auto" />
                      <p className="text-sm font-semibold text-gray-800 mt-2">Read Article</p>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Enhanced Content Container */}
                <div className="relative p-8 flex flex-col justify-between flex-1 min-h-[280px]">
                  {/* Author Section with Avatar */}
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {blog.author?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{blog.author || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">Content Creator</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
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
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  >
                    {blog.content.replace(/<[^>]+>/g, "").slice(0, 150)}
                    {blog.content.length > 150 && "..."}
                  </motion.p>

                  {/* Enhanced Read More Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
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
              </div>
            );
          })}
        </div>

        {/* Enhanced View All Blogs Button */}
        {blogs.length > 0 && (
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                href="/blogs"
                className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-green-500 via-green-600 to-blue-600 hover:from-green-600 hover:via-green-700 hover:to-blue-700 text-white px-10 py-5 rounded-3xl font-bold text-lg shadow-2xl transition-all duration-500 hover:shadow-green-500/30 hover:-translate-y-2 overflow-hidden"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <span className="relative z-10">Explore All Articles</span>
                <motion.div
                  className="relative z-10"
                  whileHover={{ x: 8, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight size={24} />
                </motion.div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(8px); }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(15px) translateX(-8px); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float-slow {
          animation: floatSlow 6s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: floatReverse 8s ease-in-out infinite;
        }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
        }
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </section>
  );
}
