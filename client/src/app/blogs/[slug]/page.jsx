// app/blogs/[slug]/page.js

import BlogHero from "./BlogHero";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AccountingQuiz from "./AccountingQuiz";
import BlogDetailClient from "./BlogDetailClient";
import axios from "axios";
import { Metadata } from "next";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const slug = params.slug;

  try {
    const res = await axios.get(`${API_BASE}/blogs`);
    const foundBlog = res.data.find(
      (b) =>
        b.title &&
        b.title.replace(/\s+/g, "-").toLowerCase() === slug.toLowerCase()
    );

    if (!foundBlog || foundBlog.status !== "active") {
      return {
        title: "Blog Post Not Found - IICPA Institute",
        description: "The requested blog post could not be found.",
      };
    }

    // Create dynamic SEO title based on blog heading
    const seoTitle = `${foundBlog.title} - IICPA Institute`;

    // Generate description from content (first 160 characters)
    const description = foundBlog.content
      ? foundBlog.content.replace(/<[^>]*>/g, "").substring(0, 160) + "..."
      : `Learn about ${foundBlog.title} at IICPA Institute. Professional accounting and finance training.`;

    return {
      title: seoTitle,
      description: description,
      keywords: foundBlog.category
        ? `${foundBlog.category}, accounting, finance, IICPA`
        : "accounting, finance, IICPA",
      openGraph: {
        title: seoTitle,
        description: description,
        type: "article",
        url: `https://iicpa.in/blogs/${slug}`,
        images: foundBlog.imageUrl
          ? [
              {
                url: foundBlog.imageUrl.startsWith("http")
                  ? foundBlog.imageUrl
                  : `https://iicpa.in${foundBlog.imageUrl}`,
                width: 1200,
                height: 630,
                alt: foundBlog.title,
              },
            ]
          : [
              {
                url: "https://iicpa.in/images/blog-default.jpg",
                width: 1200,
                height: 630,
                alt: "IICPA Institute Blog",
              },
            ],
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: description,
        images: foundBlog.imageUrl
          ? [
              foundBlog.imageUrl.startsWith("http")
                ? foundBlog.imageUrl
                : `https://iicpa.in${foundBlog.imageUrl}`,
            ]
          : ["https://iicpa.in/images/blog-default.jpg"],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post - IICPA Institute",
      description: "Professional accounting and finance training blog post.",
    };
  }
}

export default async function BlogDetail({ params }) {
  const slug = params.slug;

  try {
    const res = await axios.get(`${API_BASE}/blogs`);
    const foundBlog = res.data.find(
      (b) =>
        b.title &&
        b.title.replace(/\s+/g, "-").toLowerCase() === slug.toLowerCase()
    );

    // Store all active blogs for related articles
    const activeBlogs = (res.data || []).filter((b) => b.status === "active");

    return (
      <BlogDetailClient blog={foundBlog} allBlogs={activeBlogs} slug={slug} />
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    return <BlogDetailClient blog={null} allBlogs={[]} slug={slug} />;
  }
}
