import React from "react";
import { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CourseHero from "./courseHero";
import CoursePage from "./CoursePage";

export const metadata: Metadata = {
  title: "All Courses - IICPA Institute",
  description:
    "Explore our comprehensive range of accounting, finance, and professional courses. From basic accounting to advanced certifications, find the perfect course for your career growth.",
  keywords:
    "accounting courses, finance training, professional certification, tally courses, excel training, HR certification, career development, IICPA Institute",
  openGraph: {
    title: "All Courses - IICPA Institute",
    description:
      "Explore our comprehensive range of accounting, finance, and professional courses. From basic accounting to advanced certifications, find the perfect course for your career growth.",
    url: "https://iicpa.in/course",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-courses.jpg",
        width: 1200,
        height: 630,
        alt: "All Courses - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Courses - IICPA Institute",
    description:
      "Explore our comprehensive range of accounting, finance, and professional courses. From basic accounting to advanced certifications, find the perfect course for your career growth.",
    images: ["https://iicpa.in/images/og-courses.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <div>
      <Header />
      <CourseHero />
      <CoursePage />
      <Footer />
    </div>
  );
};

export default page;
