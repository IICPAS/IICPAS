"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import Link from "next/link";
import axios from "axios";

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
    <section className="px-6 md:px-20 py-8 bg-white text-[#0b1224]">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
        Your Source For Ideas, Insights, And{" "}
        <span className="bg-[#3cd664] text-white px-2 py-1 rounded-md">
          Inspiration
        </span>
      </h2>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="rounded-2xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition duration-300 bg-white overflow-hidden flex flex-col"
          >
            <div className="relative">
              <img
                src={
                  blog.imageUrl?.startsWith("http")
                    ? blog.imageUrl
                    : `${API_BASE.replace("/api", "")}/${blog.imageUrl}`
                }
                alt={blog.title}
                className="w-full h-60 object-cover rounded-t-2xl"
              />
              <div className="absolute top-4 left-4 bg-[#3cd664] text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <Calendar size={14} />
                {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
              </div>
            </div>

            <div className="p-5 flex flex-col justify-between flex-1">
              <p className="text-sm text-gray-500 mb-2 border border-[#3cd664]/40 px-3 py-1 rounded-full w-fit">
                Publisher Name :{" "}
                <span className="font-medium text-[#0b1224]">
                  {blog.author}
                </span>
              </p>
              <Link
                href={`/blogs/${encodeURIComponent(
                  blog.title.replace(/\s+/g, "-").toLowerCase()
                )}`}
                className="text-lg font-semibold leading-snug mb-2 text-blue-700 hover:underline flex items-center gap-2"
              >
                {blog.title}
                <span className="ml-2 text-xs text-[#3cd664] underline font-bold">
                  Read More &rarr;
                </span>
              </Link>
              <p className="text-sm text-gray-600 line-clamp-3">
                {blog.content.replace(/<[^>]+>/g, "").slice(0, 150)}
                {blog.content.length > 150 && "..."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
