"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";

export default function CourseDetailPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("syllabus");

  useEffect(() => {
    const title = slug.replace(/_/g, " ");
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`).then((res) => {
      const courses = res.data.courses || res.data;
      const match = courses.find((c) => c.title === title);
      setCourse(match);
    });
  }, [slug]);

  if (!course) return <div className="p-10 text-center">Loading...</div>;

  const discountedPrice =
    course.price - (course.price * (course.discount || 0)) / 100;

  return (
    <>
      <Header />
      <section className="bg-white mt-20 text-[#0b1224]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 px-6 py-12">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <p className="text-sm bg-blue-100 text-blue-700 inline-block px-3 py-1 rounded-full mb-4">
              Individual Course
            </p>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-600 text-lg mb-8">
              {course.seoDescription?.replace(/<[^>]+>/g, "")}
            </p>

            {/* Tabs */}
            <div className="border-b border-gray-200 flex space-x-8 text-lg font-medium">
              {["syllabus", "caseStudy", "examCert", "live"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {
                    {
                      syllabus: "Syllabus",
                      caseStudy: "Case Studies",
                      examCert: "Exam & Certification",
                      live: "Live Schedule +",
                    }[tab]
                  }
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6 prose max-w-none">
              {activeTab === "syllabus" && (
                <div dangerouslySetInnerHTML={{ __html: course.description }} />
              )}
              {activeTab === "caseStudy" && (
                <div dangerouslySetInnerHTML={{ __html: course.caseStudy }} />
              )}
              {activeTab === "examCert" && (
                <div dangerouslySetInnerHTML={{ __html: course.examCert }} />
              )}
              {activeTab === "live" && <p>Live schedule coming soon.</p>}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="aspect-video rounded-xl overflow-hidden shadow-md">
              <Image
                className="w-full h-full"
                src={process.env.NEXT_PUBLIC_API_URL + course.image}
                height={80}
                width={80}
                title="Course Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="text-sm text-gray-600">
              Get access to this course in <strong>Lab+</strong> &{" "}
              <strong>Lab+ Live</strong>
            </div>

            <div className="space-y-4">
              {/* Live */}
              <div className="border border-orange-600 rounded-lg p-4">
                <h3 className="text-orange-700 font-bold text-lg mb-1">
                  Price:
                </h3>
                <p className="text-xl font-semibold text-orange-900 mb-2">
                  ₹{course.price}
                </p>
                <button className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition">
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
