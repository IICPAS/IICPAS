"use client";

import { Calendar } from "lucide-react";

const blogData = [
  {
    date: "16 May 2025",
    author: "Rahul Gupta",
    title: "How to Succeed in Online Learning: Tips for Students",
    description:
      "This discusses the advantages of using LMS for upskilling employees, managers, and students.",
    image: "/images/s.jpg",
  },
  {
    date: "12 June 2025",
    author: "Rahul Mehra",
    title: "The Future of Education: Why Online Learning is Here to Stay",
    description:
      "The discusses the advantages of using LMS for upskilling employees, managers, and institutions.",
    image: "/images/s2.jpg",
  },
  {
    date: "05 June 2025",
    author: "Ajay",
    title: "Creating a Productive Study Space for Online Learning",
    description:
      "Creating a productive study space for online learning is essential for better outcomes.",
    image: "/images/s3.jpg",
  },
];

export default function BlogSection() {
  return (
    <section className="px-6 md:px-20 py-8 bg-white text-[#0b1224]">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
        Your Source For Ideas, Insights, And{" "}
        <span className="bg-[#3cd664] text-white px-2 py-1 rounded-md">
          Inspiration
        </span>
      </h2>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {blogData.map((blog, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition duration-300 bg-white overflow-hidden flex flex-col"
          >
            <div className="relative">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-60 object-cover rounded-t-2xl"
              />
              <div className="absolute top-4 left-4 bg-[#3cd664] text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <Calendar size={14} />
                {blog.date}
              </div>
            </div>

            <div className="p-5 flex flex-col justify-between flex-1">
              <p className="text-sm text-gray-500 mb-2 border border-[#3cd664]/40 px-3 py-1 rounded-full w-fit">
                PublisherName :{" "}
                <span className="font-medium text-[#0b1224]">
                  {blog.author}
                </span>
              </p>
              <h3 className="text-lg font-semibold leading-snug mb-2">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {blog.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
