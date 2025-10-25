import React from "react";
import { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Taxation Courses - IICPA Institute",
  description:
    "Master tax laws and regulations with our comprehensive taxation courses. Learn income tax, GST, corporate tax, and tax planning strategies.",
  keywords:
    "taxation courses, income tax, GST training, corporate tax, tax planning, tax laws, tax compliance",
  openGraph: {
    title: "Taxation Courses - IICPA Institute",
    description:
      "Master tax laws and regulations with our comprehensive taxation courses. Learn income tax, GST, corporate tax, and tax planning strategies.",
    url: "https://iicpa.in/courses/taxation",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Taxation Courses - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxation Courses - IICPA Institute",
    description:
      "Master tax laws and regulations with our comprehensive taxation courses. Learn income tax, GST, corporate tax, and tax planning strategies.",
    images: ["https://iicpa.in/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const TaxationCoursesPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Taxation Courses
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master tax laws and regulations with our comprehensive taxation
              courses designed for professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Income Tax
              </h3>
              <p className="text-gray-600 mb-4">
                Learn income tax laws, deductions, exemptions, and filing
                procedures for individuals and businesses.
              </p>
              <div className="text-green-600 font-medium">
                Duration: 8 weeks
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                GST (Goods & Services Tax)
              </h3>
              <p className="text-gray-600 mb-4">
                Master GST concepts, registration, returns filing, and
                compliance requirements.
              </p>
              <div className="text-green-600 font-medium">
                Duration: 6 weeks
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Corporate Tax
              </h3>
              <p className="text-gray-600 mb-4">
                Understand corporate tax planning, transfer pricing, and
                international taxation.
              </p>
              <div className="text-green-600 font-medium">
                Duration: 10 weeks
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TaxationCoursesPage;
