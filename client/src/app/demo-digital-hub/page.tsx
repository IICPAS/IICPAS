import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DemoDigitalHubHero from "./DemoDigitalHubHero";
import DemoDigitalHubSection from "./DemoDigitalHubSection";
import NewsletterSection from "../components/Newsletter";

const page = () => {
  return (
    <div>
      <Header />
      <DemoDigitalHubHero />
      <DemoDigitalHubSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default page;
