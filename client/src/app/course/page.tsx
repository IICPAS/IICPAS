import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CourseHero from "./courseHero";
import CoursePage from "./CoursePage";

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
