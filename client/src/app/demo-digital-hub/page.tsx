import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DemoDigitalHubHero from "./DemoDigitalHubHero";
import DemoDigitalHubSection from "./DemoDigitalHubSection";

const page = () => {
  return (
    <div>
      <Header />
      <DemoDigitalHubHero />
      <DemoDigitalHubSection />
      <Footer />
    </div>
  );
};

export default page;
