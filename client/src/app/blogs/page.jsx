"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

// No more replacement—just render as is
const BlogReader = ({ title, author, imageUrl, createdAt, content }) => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[white] text-white px-4 py-24 lg:pt-28 lg:pb-10 md:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-green-500">[ Quick Read ]</p>
          <h1 className="text-2xl md:text-4xl font-extrabold text-center leading-tight md:leading-normal">
            {title}
          </h1>
          <p className="text-sm text-gray-400 text-center mt-2">
            By <span className="text-green-400 font-semibold">{author}</span> •{" "}
            {new Date(createdAt).toLocaleDateString()}
          </p>
          <div className="flex justify-center mt-6">
            <img
              src={"http://localhost:8080/" + imageUrl}
              alt="Main Visual"
              className="rounded-xl shadow-lg max-h-[400px] w-full max-w-2xl object-cover"
            />
          </div>
          <div
            className="mt-10 p-6 bg-white rounded-2xl shadow-lg text-gray-200 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <style jsx global>{`
            .prose img {
              display: block;
              margin-left: auto;
              margin-right: auto;
              margin-top: 1.5rem;
              margin-bottom: 1.5rem;
              max-width: 100%;
              height: auto;
              border-radius: 0.75rem;
              box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
            }
          `}</style>
        </div>
      </div>
    </>
  );
};

export default function BlogPage() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/blogs")
      .then((res) => {
        setBlog(res.data[0]);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        alert("Error loading blog: " + err.message);
      });
  }, []);

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (!blog) return <div className="text-red-500 p-10">Blog not found.</div>;

  return <BlogReader {...blog} />;
}
