"use client";

import BlogHero from "./BlogHero";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AccountingQuiz from "./AccountingQuiz";
import {
  Calendar,
  Clock,
  User,
  Tag,
  ArrowLeft,
  Share2,
  Bookmark,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BlogDetailClient({ blog, allBlogs, slug }) {
  // Show 'not found' if blog does not exist or is not active
  if (!blog || blog.status !== "active") {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-6">📝</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Article Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The blog post you're looking for doesn't exist or has been
              removed.
            </p>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Blogs
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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
    ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${
        blog.imageUrl.startsWith("/") ? blog.imageUrl : "/" + blog.imageUrl
      }`
    : getFallbackImage(blog.title);

  // Get related articles (exclude current blog)
  const getRelatedArticles = () => {
    const currentBlogId = blog._id;
    const sameCategoryBlogs = allBlogs.filter(
      (b) => b._id !== currentBlogId && b.category === blog.category
    );
    const otherBlogs = allBlogs.filter(
      (b) => b._id !== currentBlogId && b.category !== blog.category
    );

    // Return up to 5 related articles: prioritize same category, then others
    const related = [...sameCategoryBlogs, ...otherBlogs].slice(0, 5);
    return related;
  };

  return (
    <>
      <Header />

      {/* Centered Reading Area */}
      <section className="relative pt-32 pb-16 bg-gray-50">
        <div className="w-[85vw] mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <nav className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Link
                href="/blogs"
                className="hover:text-green-600 transition-colors"
              >
                Blog
              </Link>
              <span>/</span>
              <span>{blog.title}</span>
            </nav>
          </motion.div>

          {/* Main Reading Container */}
          <motion.div
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Article Meta */}
            <div className="px-8 pt-8 pb-4">
              <motion.div
                className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
                  <Tag className="w-3 h-3" />
                  <span>{blog.category || "General"}</span>
                </div>
                <div className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span>
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Recent"}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span>{Math.ceil(blog.content.length / 500)} min read</span>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight text-center mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {blog.title}
              </motion.h1>
            </div>

            {/* Cover Image */}
            <motion.div
              className="relative overflow-hidden mx-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <img
                src={imageUrl}
                alt={blog.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>

            {/* Article Content */}
            <div className="px-8 py-8">
              <motion.div
                className="prose prose-lg max-w-none text-center text-gray-700 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Article Actions */}
              <motion.div
                className="mt-12 pt-8 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="flex flex-wrap items-center justify-center gap-6">
                  <div className="flex items-center gap-6">
                    <button className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors px-4 py-2 rounded-full hover:bg-green-50">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors px-4 py-2 rounded-full hover:bg-green-50">
                      <Bookmark className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>1,234 views</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Accounting Quiz Section */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <AccountingQuiz />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Moving Blogs Carousel Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Continue Reading
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover more insights and knowledge from our expert team
            </p>
          </motion.div>

          {/* Moving Cards Container */}
          <div className="relative overflow-hidden rounded-3xl bg-white/50 backdrop-blur-sm p-8">
            <motion.div
              className="flex gap-8"
              animate={{
                x: [0, -100 * getRelatedArticles().length],
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: `${getRelatedArticles().length * 360}px`,
              }}
            >
              {/* Duplicate cards for seamless loop */}
              {[...getRelatedArticles(), ...getRelatedArticles()].map(
                (relatedBlog, index) => (
                  <motion.div
                    key={`${relatedBlog._id}-${index}`}
                    className="flex-shrink-0 w-80 bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105"
                    whileHover={{ y: -8 }}
                  >
                    <Link
                      href={`/blogs/${relatedBlog.title
                        .replace(/\s+/g, "-")
                        .toLowerCase()}`}
                      className="block group"
                    >
                      <div className="h-56 overflow-hidden rounded-t-3xl">
                        <img
                          src={
                            relatedBlog.imageUrl?.startsWith("http")
                              ? relatedBlog.imageUrl
                              : relatedBlog.imageUrl
                              ? `${
                                  process.env.NEXT_PUBLIC_API_URL ||
                                  "http://localhost:8080"
                                }${
                                  relatedBlog.imageUrl.startsWith("/")
                                    ? relatedBlog.imageUrl
                                    : "/" + relatedBlog.imageUrl
                                }`
                              : getFallbackImage(relatedBlog.title)
                          }
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-8">
                        <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-4">
                          <Tag className="w-3 h-3" />
                          <span>{relatedBlog.category || "General"}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-3">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {relatedBlog.createdAt
                            ? new Date(
                                relatedBlog.createdAt
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "Recent"}
                        </p>
                        <div className="flex items-center text-green-600 text-sm font-semibold">
                          <span>Read More</span>
                          <motion.svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </motion.svg>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
