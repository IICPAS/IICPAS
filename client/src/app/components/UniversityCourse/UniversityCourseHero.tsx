"use client";

import ThinHeroSection from "../../components/ThinHeroSection";

interface UniversityCourseHeroProps {
  courseName: string;
  category: string;
}

export default function UniversityCourseHero({
  courseName,
  category,
}: UniversityCourseHeroProps) {
  const breadcrumb = `Home / ${courseName}`;

  return <ThinHeroSection title={courseName} breadcrumb={breadcrumb} />;
}
