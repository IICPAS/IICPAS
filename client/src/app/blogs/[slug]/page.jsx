// app/blogs/[slug]/page.js

import BlogHero from "@/app/blog/BlogHero";
import Header from "../../components/Header";
import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

export default async function BlogDetail({ params }) {
  const slug = params.slug;
  let blog = null;

  try {
    // Fetch all blogs (better: create an endpoint for get-by-slug for scale)
    const res = await axios.get(`${API_BASE}/blogs`);
    // Slugify to match URL (e.g., erp-development)
    blog = res.data.find(
      (b) =>
        b.title &&
        b.title.replace(/\s+/g, "-").toLowerCase() === slug.toLowerCase()
    );
  } catch (e) {
    blog = null;
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">Blog not found</h1>
      </div>
    );
  }

  return (
    <>
      <Header />
      <BlogHero />
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <div className="mb-3 text-sm text-gray-500">
          By {blog.author} •{" "}
          {blog.createdAt &&
            new Date(blog.createdAt).toLocaleDateString("en-GB")}
        </div>
        {blog.imageUrl && (
          <img
            src={
              blog.imageUrl.startsWith("http")
                ? blog.imageUrl
                : `${API_BASE.replace("/api", "")}/${blog.imageUrl}`
            }
            alt={blog.title}
            className="w-full h-64 object-cover rounded mb-6"
          />
        )}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </>
  );
}
