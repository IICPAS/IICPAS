import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQHero from "./FAQHero";
import FAQSection from "./FAQSection";
import NewsletterSection from "../components/Newsletter";

const page = () => {
  return (
    <div>
      <Header />
      <FAQHero />
      <FAQSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default page;