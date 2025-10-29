import { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  universityCourses,
  getCoursesByCategory,
} from "../../../data/universityCourses";

export const metadata: Metadata = {
  title: "University Courses - IICPA Institute | UG, PG & Ph.D Programs",
  description:
    "Explore our comprehensive range of university courses including UG Programs (B.Tech, BBA, BCA), PG Programs (MBA, LLM), and Ph.D Programs. Industry-aligned curriculum with expert guidance.",
  keywords:
    "university courses, UG programs, PG programs, PhD programs, B.Tech, MBA, LLM, undergraduate courses, postgraduate courses",
  openGraph: {
    title: "University Courses - IICPA Institute",
    description:
      "Explore our comprehensive range of university courses including UG Programs, PG Programs, and Ph.D Programs.",
    url: "https://iicpa.in/admission/university-courses",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-university-courses.jpg",
        width: 1200,
        height: 630,
        alt: "University Courses - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function UniversityCoursesPage() {
  const ugPrograms = getCoursesByCategory("UG Programs");
  const pgPrograms = getCoursesByCategory("PG Programs");
  const phdPrograms = getCoursesByCategory("Ph.D Programs");

  return (
    <>
      <Header />

      <div className="pt-28 pb-16 bg-gradient-to-r from-green-500 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              University Courses
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Home / Admission Open
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* UG Programs */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                UG Programs
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Undergraduate programs designed to provide strong foundations
                and practical skills for career success.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ugPrograms.map((course) => (
                <Link
                  key={course.slug}
                  href={`/admission/university-courses/${course.slug}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-green-300"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.about}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-semibold">
                      {course.duration}
                    </span>
                    <span className="text-blue-600 text-sm font-medium">
                      Learn More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* PG Programs */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                PG Programs
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Postgraduate programs for advanced learning and specialized
                expertise in various fields.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pgPrograms.map((course) => (
                <Link
                  key={course.slug}
                  href={`/admission/university-courses/${course.slug}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-green-300"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.about}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-semibold">
                      {course.duration}
                    </span>
                    <span className="text-blue-600 text-sm font-medium">
                      Learn More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Ph.D Programs */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ph.D Programs
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Doctoral programs for advanced research and academic excellence
                in specialized fields.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {phdPrograms.map((course) => (
                <Link
                  key={course.slug}
                  href={`/admission/university-courses/${course.slug}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 hover:border-green-300"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.about}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-semibold">
                      {course.duration}
                    </span>
                    <span className="text-blue-600 text-sm font-medium">
                      Learn More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
