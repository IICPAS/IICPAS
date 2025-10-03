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

  const imageUrl = blog.imageUrl?.startsWith("http")
    ? blog.imageUrl
    : blog.imageUrl
    ? `${API_BASE.replace("/api", "")}/${blog.imageUrl}`
    : getFallbackImage(blog.title);

  return (
    <>
      <Header />

      {/* Professional Blog Header */}
      <section className="relative pt-32 pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
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
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {blog.title}
          </motion.h1>
        </div>
      </section>

      {/* Cover Image Section */}
      <section className="pb-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-100">
              <img
                src={imageUrl}
                alt={blog.title}
                className="w-full h-80 md:h-96 object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.target.src = getFallbackImage(blog.title);
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Article Content */}
          <motion.div
            className="article-content prose prose-lg prose-green max-w-none mx-auto"
            dangerouslySetInnerHTML={{ __html: blog.content }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          {/* Professional Article Footer */}
          <motion.div
            className="mt-16 pt-8 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-300">
                  <Share2 className="w-4 h-4" />
                  Share Article
                </button>
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-300">
                  <Bookmark className="w-4 h-4" />
                  Save Article
                </button>
              </div>
            </div>
          </motion.div>

          {/* Back to Blogs Link */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Blog
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
