import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQHero from "./FAQHero";
import FAQSection from "./FAQSection";

const page = () => {
  return (
    <div>
      <Header />
      <FAQHero />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default page;