import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import UniversityCoursePageClient from "./UniversityCoursePageClient";
import {
  getCourseBySlug,
  getAllCourseSlugs,
} from "../../../../data/universityCourses";
import {
  getUniversityCourseBySlug,
  getAllCourseSlugs as getApiCourseSlugs,
} from "../../../../services/universityCourses";

interface UniversityCoursePageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: UniversityCoursePageProps): Promise<Metadata> {
  // Try to fetch from API first, fallback to static data
  let course = null;
  try {
    course = await getUniversityCourseBySlug(params.slug);
  } catch (error) {
    console.error("Error fetching course from API:", error);
  }

  // Fallback to static data if API fails
  if (!course) {
    course = getCourseBySlug(params.slug);
  }

  if (!course) {
    return {
      title: "Course Not Found - IICPA Institute",
      description: "The requested course page could not be found.",
    };
  }

  return {
    title: course.seo.title,
    description: course.seo.description,
    keywords: course.seo.keywords,
    openGraph: {
      title: course.seo.title,
      description: course.seo.description,
      url: `https://iicpa.in/admission/university-courses/${params.slug}`,
      siteName: "IICPA Institute",
      images: [
        {
          url: "https://iicpa.in/images/og-course-default.jpg",
          width: 1200,
          height: 630,
          alt: `${course.name} - IICPA Institute`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: course.seo.title,
      description: course.seo.description,
      images: ["https://iicpa.in/images/og-course-default.jpg"],
    },
    alternates: {
      canonical: `https://iicpa.in/admission/university-courses/${params.slug}`,
    },
  };
}

// Generate static params for all courses
export async function generateStaticParams() {
  // Try to fetch from API first, fallback to static data
  let slugs: string[] = [];
  try {
    slugs = await getApiCourseSlugs();
  } catch (error) {
    console.error("Error fetching course slugs from API:", error);
  }

  // Fallback to static data if API fails or returns empty
  if (slugs.length === 0) {
    slugs = getAllCourseSlugs();
  }

  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Main page component
export default async function UniversityCoursePage({
  params,
}: UniversityCoursePageProps) {
  // Try to fetch from API first, fallback to static data
  let course = null;
  try {
    course = await getUniversityCourseBySlug(params.slug);
  } catch (error) {
    console.error("Error fetching course from API:", error);
  }

  // Fallback to static data if API fails
  if (!course) {
    course = getCourseBySlug(params.slug);
  }

  if (!course) {
    notFound();
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: course.name,
    description: course.description,
    provider: {
      "@type": "EducationalOrganization",
      name: "IICPA Institute",
      url: "https://iicpa.in",
      logo: "https://iicpa.in/images/logo.png",
    },
    educationalLevel: course.category,
    timeRequired: course.duration || "Varies",
    occupationalCategory: course.careerProspects,
    educationalCredentialAwarded: course.name,
    url: `https://iicpa.in/admission/university-courses/${params.slug}`,
    applicationDeadline: "Rolling Admission",
    startDate: "Multiple Intakes",
    programType: "Full-time",
    offers: {
      "@type": "Offer",
      price: "Contact for pricing",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <UniversityCoursePageClient course={course} />

      {/* Footer */}
      <Footer />
    </>
  );
}
