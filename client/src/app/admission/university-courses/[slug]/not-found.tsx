import { Metadata } from "next";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export const metadata: Metadata = {
  title: "Course Not Found - IICPA Institute",
  description:
    "The requested course page could not be found. Explore our available programs.",
};

export default function NotFound() {
  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-green-600 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Course Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              The course you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/admission/university-courses"
              className="block w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse All Courses
            </Link>

            <Link
              href="/"
              className="block w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
