"use client";

// app/blogs/[slug]/page.js

import BlogHero from "./BlogHero";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
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
import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

export default function BlogDetail({ params }) {
  const slug = params.slug;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await axios.get(`${API_BASE}/blogs`);
        const foundBlog = res.data.find(
          (b) =>
            b.title &&
            b.title.replace(/\s+/g, "-").toLowerCase() === slug.toLowerCase()
        );
        setBlog(foundBlog);
        setLoading(false);
      } catch (e) {
        setBlog(null);
        setLoading(false);
      }
    }
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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

  const arrayUrl = blog.imageUrl?.startsWith("http")
    ? blog.imageUrl
    : blog.imageUrl
    ? `${API_BASE.replace("/api", "")}/${blog.imageUrl}`
    : getFallbackImage(blog.title);

  return (
    <>
      <Header />

      {/* Enhanced Hero Section */}
      <section className="relative pt-24 pb-12 bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-green-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-100/20 to-green-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Breadcrumb */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                href="/blogs"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Blog
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{blog.title}</span>
            </nav>
          </motion.div>

          {/* Article Meta */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl">
                <Tag className="w-3 h-3" />
                <span>{blog.category || "General"}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl border border-gray-200">
                <Calendar className="w-3 h-3 text-green-500" />
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
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md text-gray-700 text-xs font-semibold px-4 py-rigger>rounded-xl border border-gray-200">
                <Clock className="w-3 h-3 text-blue-500" />
                <span>{Math.ceil(blog.content.length / 500)} min read</span>
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {blog.title}
          </motion.h1>

          {/* Author Info */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {blog.author?.charAt(0) || "A"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {blog.author || "Anonymous Author"}
              </p>
              <p className="text-sm text-gray-600">
                Content Creator at IICPA Institute
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button className="p-2 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-200">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-200">
                <Bookmark className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Featured Image */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={imageUrl}
                alt={blog.title}
                className="w-full h-80 md:h-96 object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.target.src = getFallbackImage(blog.title);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            className="article-content prose prose-lg prose-green max-w-none mx-auto"
            dangerouslySetInnerHTML={{ __html: blog.content }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />

          {/* Article Footer */}
          <motion.div
            className="mt-12 pt-8 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {blog.author?.charAt(0) || "A"}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {blog.author || "Anonymous Author"}
                  </h4>
                  <p className="text-sm text-gray-600">Content Creator</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <Share2 className="w-5 h-5" />
                  Share Article
                </button>
                <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg">
                  <Bookmark className="w-5 h-5" />
                  Save
                </button>
              </div>
            </div>
          </motion.div>

          {/* Back to Blogs Button */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <ArrowLeft className="w-6 h-6" />
              Explore More Articles
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .article-content {
          line-height: 1.8;
        }

        .article-content h1,
        .article-content h2,
        .article-content h3,
        .article-content h4,
        .article-content h5,
        .article-content h6 {
          color: #1f2937;
          font-family: "Inter", system-ui, sans-serif;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .article-content h1 {
          font-size: 2.25rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }

        .article-content h2 {
          font-size: 1.875rem;
          color: #059669;
        }

        .article-content h3 {
          font-size: 1.5rem;
          color: #059669;
        }

        .article-content p {
          color: #374151;
          margin-bottom: 1.5rem;
          font-size: 1.125rem;
        }

        .article-content a {
          color: #059669;
          text-decoration: none;
          font-weight: 600;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .article-content a:hover {
          color: #047857;
          border-bottom-color: #059669;
        }

        .article-content ul,
        .article-content ol {
          color: #374151;
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .article-content li {
          margin-bottom: 0.5rem;
        }

        .article-content blockquote {
          border-left: 4px solid #059669;
          background: #f0fdf4;
          padding: 1rem 1.5rem;
          margin: 2rem 0;
          border-radius: 0.5rem;
          font-style: italic;
          color: #166534;
        }

        .article-content code {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: "Monaco", "Consolas", monospace;
          font-size: 0.875rem;
          color: #dc2626;
        }

        .article-content pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .article-content pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }

        .article-content img {
          border-radius: 0.75rem;
          margin: 2rem 0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .article-content img:hover {
          transform: scale(1.02);
        }

        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.875rem;
        }

        .article-content th,
        .article-content td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: left;
        }

        .article-content th {
          background: #f9fafb;
          font-weight: 600;
          color: #1f2937;
        }

        .article-content tr:nth-child(even) {
          background: #f9fafb;
        }

        .article-content hr {
          border: none;
          height: 2px;
          background: linear-gradient(
            to right,
            transparent,
            #e5e7eb,
            transparent
          );
          margin: 3rem 0;
        }

        @media (max-width: 768px) {
          .article-content {
            font-size: 1rem;
          }

          .article-content h1 {
            font-size: 1.875rem;
          }

          .article-content h2 {
            font-size: 1.5rem;
          }

          .article-content h3 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </>
  );
}
