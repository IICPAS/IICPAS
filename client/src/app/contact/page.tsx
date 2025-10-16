import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactHero from "./ContactHero";
import ContactBoxes from "./ContactBoxes";
import ContactSection from "./ContactSection";
import ContactMap from "./ContactMap";
import NewsletterSection from "../components/Newsletter";

const page = () => {
  return (
    <div>
      <Header />
      <ContactHero />
      <ContactBoxes />
      <ContactSection />
      <ContactMap />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default page;
