"use client";

import { useEffect, useState } from "react";
import UniversityCourseHero from "../../../components/UniversityCourse/UniversityCourseHero";
import CourseAboutSection from "../../../components/UniversityCourse/CourseAboutSection";
import CourseEligibilitySection from "../../../components/UniversityCourse/CourseEligibilitySection";
import CourseDescriptionSection from "../../../components/UniversityCourse/CourseDescriptionSection";
import CourseContactSection from "../../../components/UniversityCourse/CourseContactSection";
import AdmissionModal from "../../../components/AdmissionModal";
import { UniversityCourse } from "../../../../data/universityCourses";

interface UniversityCoursePageClientProps {
  course: UniversityCourse;
}

export default function UniversityCoursePageClient({
  course,
}: UniversityCoursePageClientProps) {
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);

  // Auto-open admission modal on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAdmissionModal(true);
    }, 1000); // Small delay to ensure page is loaded

    return () => clearTimeout(timer);
  }, []);

  const handleCloseModal = () => {
    setShowAdmissionModal(false);
  };

  return (
    <>
      {/* Hero Section */}
      <UniversityCourseHero
        courseName={course.name}
        category={course.category}
      />

      {/* About Section */}
      <CourseAboutSection
        title={course.name}
        content={course.about}
        imageUrl="/images/about.jpeg"
      />

      {/* Eligibility & Highlights Section */}
      <CourseEligibilitySection
        eligibility={course.eligibility}
        duration={course.duration}
        highlights={course.highlights}
      />

      {/* Description & Career Prospects Section */}
      <CourseDescriptionSection
        description={course.description}
        careerProspects={course.careerProspects}
        highlights={course.highlights}
      />

      {/* Contact Section */}
      <CourseContactSection courseName={course.name} />

      {/* Admission Modal */}
      <AdmissionModal
        isOpen={showAdmissionModal}
        onClose={handleCloseModal}
        selectedCourse={course.name}
      />
    </>
  );
}
