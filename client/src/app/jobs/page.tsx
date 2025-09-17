import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
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
      <Footer />
    </div>
  );
};

export default page;
