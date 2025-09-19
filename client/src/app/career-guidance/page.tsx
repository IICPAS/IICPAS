import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CareerGuidanceHero from "./CareerGuidanceHero";
import CareerGuidanceSection from "./CareerGuidanceSection";
import NewsletterSection from "../components/Newsletter";

const page = () => {
  return (
    <div>
      <Header />
      <CareerGuidanceHero />
      <CareerGuidanceSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default page;
