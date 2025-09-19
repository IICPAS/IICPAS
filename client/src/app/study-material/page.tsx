import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StudyMaterialHero from "./StudyMaterialHero";
import StudyMaterialSection from "./StudyMaterialSection";
import NewsletterSection from "../components/Newsletter";

const page = () => {
  return (
    <div>
      <Header />
      <StudyMaterialHero />
      <StudyMaterialSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default page;
