"use client";

import ContactSection from "../ContactSection";

interface CourseContactSectionProps {
  courseName: string;
}

export default function CourseContactSection({
  courseName,
}: CourseContactSectionProps) {
  return (
    <div id="course-contact">
      <ContactSection />
    </div>
  );
}
