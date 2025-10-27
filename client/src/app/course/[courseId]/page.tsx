import React from "react";
import { Metadata } from "next";
import CourseDetailClient from "./CourseDetailClient";

// Function to fetch course data for metadata generation
async function getCourseData(courseId: string) {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const response = await fetch(`${API_BASE}/api/courses/${courseId}`, {
      cache: "no-store", // Ensure fresh data for metadata
    });

    if (!response.ok) {
      throw new Error("Course not found");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching course data for metadata:", error);
    return null;
  }
}

// Generate dynamic metadata based on course data
export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const course = await getCourseData(resolvedParams.courseId);

  // Fallback metadata if course not found
  if (!course) {
    return {
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
  }

  // Dynamic metadata based on course data
  const courseTitle = course.title || "Course";
  const courseDescription = course.description
    ? course.description.replace(/<[^>]*>/g, "").substring(0, 160) + "..."
    : "Explore detailed course information, syllabus, pricing, and enrollment options. Join our comprehensive accounting and finance courses.";

  const courseImage = course.image
    ? course.image.startsWith("/uploads")
      ? `https://iicpa.in${course.image}`
      : `https://iicpa.in${course.image}`
    : "https://iicpa.in/images/og-default.jpg";

  // Use admin meta fields with fallbacks
  const metaTitle = course.metaTitle || `${courseTitle} - IICPA Institute`;
  const metaDescription = course.metaDescription || courseDescription;
  const courseUrl = `https://iicpa.in/course/${resolvedParams.courseId}`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords:
      course.seoKeywords ||
      `${courseTitle.toLowerCase()}, ${
        course.category || "accounting"
      } course, finance training, ${
        course.level || "professional"
      } level, course syllabus, course pricing, course enrollment, IICPA Institute`,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: courseUrl,
      siteName: "IICPA Institute",
      images: [
        {
          url: courseImage,
          width: 1200,
          height: 630,
          alt: `${courseTitle} - Course Preview`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [courseImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  return <CourseDetailClient params={params} />;
}
