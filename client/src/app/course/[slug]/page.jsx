// src/app/course/[slug]/page.tsx
/* eslint-disable @next/next/no-img-element */
import Header from "@/app/components/Header";
import { notFound } from "next/navigation";

const courses = [
  {
    slug: "basic-accounting-&-tally-foundation",
    title: "Basic Accounting & Tally Foundation",
    price: 5000,
    discount: 5,
    image: "/images/accounting.webp",
    includes: {
      chapters: 12,
      topics: 38,
    },
  },
  {
    slug: "microsoft-excel",
    title: "Microsoft Excel",
    price: 5000,
    discount: 0,
    image: "/images/excel.jpg",
    includes: {
      chapters: 10,
      topics: 25,
    },
  },
];

export default function CourseDetail() {
  const course = courses.find(
    (c) => c.slug === decodeURIComponent(params.slug)
  );
  if (!course) return notFound();

  const discountedPrice = course.price - (course.price * course.discount) / 100;

  return (
    <>
      <Header />
      <div className="bg-gradient-to-br mt-20 from-[#f5fcfa] via-white to-[#eef7fc] min-h-screen text-[#0b1224]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-sm text-green-600 mb-6">Home // {course.title}</p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Tabs Left Side */}
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-4 mb-6">
                <button className="bg-green-500 text-white px-4 py-2 rounded-full font-medium shadow">
                  Case Study
                </button>
                <button className="border px-4 py-2 rounded-full text-[#0b1224] font-medium">
                  Curriculum
                </button>
                <button className="border px-4 py-2 rounded-full text-[#0b1224] font-medium">
                  Exam & Certification
                </button>
                <button className="border px-4 py-2 rounded-full text-[#0b1224] font-medium">
                  Simulation & Experiments
                </button>
              </div>
            </div>

            {/* Course Box Right Side */}
            <div className="bg-white border rounded-2xl shadow p-6">
              {/* Image */}
              <div className="relative w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden group">
                <img
                  src={course.image}
                  alt={course.title}
                  className="object-cover w-full h-full transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full bg-white opacity-30 animate-ping" />
                    <div className="absolute inset-0 rounded-full bg-white opacity-50 animate-pulse" />
                    <div className="z-10 flex items-center justify-center w-full h-full rounded-full bg-white text-[#0b1224]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <p className="text-green-600 text-xl font-bold mb-1">
                ₹{discountedPrice.toLocaleString()}
              </p>
              {course.discount > 0 && (
                <p className="text-sm text-gray-500 line-through mb-4">
                  ₹{course.price.toLocaleString()}
                </p>
              )}

              <button className="bg-[#0b1224] text-white px-4 py-2 w-full rounded-full hover:bg-green-600 transition mb-6">
                Add to Cart
              </button>

              <h4 className="font-semibold text-lg mb-2">
                This Course Included
              </h4>
              <ul className="text-sm space-y-1">
                <li>📘 Chapters: {course.includes.chapters}</li>
                <li>📑 Topics: {course.includes.topics}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
