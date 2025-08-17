import React from "react";
import Header from "../components/Header";
import AboutPeoplePassion from "./component/AboutPeoplePassion";
import TestimonialCarousel from "../components/TestimonialSection";
import NewsletterSection from "../components/Newsletter";
import ContactSection from "../components/ContactSection";
import AboutHero from "./component/AboutHero";

const page = () => {
  return (
    <div>
      <Header />
      <div className="pt-10">
        <AboutHero />
      </div>
      <AboutPeoplePassion />
      <TestimonialCarousel />
      <NewsletterSection />
      <ContactSection />
    </div>
  );
};

export default page;
