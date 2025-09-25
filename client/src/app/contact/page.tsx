import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactHero from "./ContactHero";
import ContactBoxes from "./ContactBoxes";
import ContactSection from "./ContactSection";
import MapsSection from "./MapsSection";
import NewsletterSection from "../components/Newsletter";

const page = () => {
  return (
    <div>
      <Header />
      <ContactHero />
      <ContactBoxes />
      <ContactSection />
      <NewsletterSection />
      <MapsSection />
      <Footer />
    </div>
  );
};

export default page;
