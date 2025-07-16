import React from "react";
import Header from "../components/Header";
import ContactHero from "./ContactHero";
import ContactBoxes from "./ContactBoxes";
import ContactSection from "./ContactSection";
import NewsletterSection from "../components/Newsletter";

const page = () => {
  return (
    <div className="pb-20">
      <Header />
      <ContactHero />
      <ContactBoxes />
      <ContactSection />
      <NewsletterSection />
    </div>
  );
};

export default page;
