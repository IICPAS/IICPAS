import React from "react";
import Header from "../components/Header";
import CourseJobs from "./CourseJobs";
import ApplyJobsWithModalApply from "./ AllJobsWithModalApply";
import BlogSection from "../components/BlogsSection";
import ContactSection from "../components/ContactSection";

const page = () => {
  return (
    <div>
      <Header />
      <CourseJobs />
      <ApplyJobsWithModalApply />
      <BlogSection />
      <ContactSection />
    </div>
  );
};

export default page;
