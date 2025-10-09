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

      {/* Professional Blog Header */}
      <section className="relative pt-32 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-0">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
            <div className="flex-1 lg:max-w-none">
              {/* Breadcrumb */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <nav className="flex items-center space-x-2 text-sm text-gray-500">
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

              {/* Article Meta */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200">
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
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4 max-w-4xl mx-auto text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {blog.title}
              </motion.h1>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image Section */}
      <section className="pb-6 bg-white">
        <div className="max-w-4xl mx-auto px-0">
          <motion.div
            className="relative overflow-hidden rounded-2xl shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img
              src={imageUrl}
              alt={blog.title}
              className="w-full h-64 sm:h-80 md:h-96 object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-0">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Article Content */}
            <article className="flex-1 lg:max-w-none">
              <motion.div
                className="prose prose-lg max-w-none"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Article Actions */}
              <motion.div
                className="mt-12 pt-8 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
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
            </article>

            {/* Sidebar */}
            <aside className="lg:w-80">
              {/* Related Articles */}
              <motion.div
                className="bg-gray-50 rounded-2xl p-6"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Related Articles
                </h3>
                <div className="space-y-4">
                  {getRelatedArticles().map((relatedBlog, index) => (
                    <Link
                      key={relatedBlog._id}
                      href={`/blogs/${relatedBlog.title
                        .replace(/\s+/g, "-")
                        .toLowerCase()}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
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
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                            {relatedBlog.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
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
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Accounting Quiz */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <AccountingQuiz />
              </motion.div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
