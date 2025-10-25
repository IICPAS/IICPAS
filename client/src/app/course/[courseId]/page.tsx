import React from "react";
import { Metadata } from "next";
import CourseDetailClient from "./CourseDetailClient";

export const metadata: Metadata = {
  title: "Course Details - IICPA Institute",
  description:
    "Explore detailed course information, syllabus, pricing, and enrollment options. Join our comprehensive accounting and finance courses.",
  keywords:
    "course details, accounting courses, finance training, course syllabus, course pricing, course enrollment",
  openGraph: {
    title: "Course Details - IICPA Institute",
    description:
      "Explore detailed course information, syllabus, pricing, and enrollment options. Join our comprehensive accounting and finance courses.",
    url: "https://iicpa.in/course",
    siteName: "IICPA Institute",
    images: [
      {
        url: "https://iicpa.in/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Course Details - IICPA Institute",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Course Details - IICPA Institute",
    description:
      "Explore detailed course information, syllabus, pricing, and enrollment options. Join our comprehensive accounting and finance courses.",
    images: ["https://iicpa.in/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  return <CourseDetailClient params={params} />;
}
