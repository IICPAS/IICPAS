import React from "react";
import Header from "../components/Header";
import LiveClassSection from "../components/LiveClassSection";
import AboutUsSection from "../components/AboutUsSection";
import NewsletterSection from "../components/Newsletter";
import LiveHero from "./LiveHero";
import YellowStatsStrip from "../components/YellowStrip";
import Footer from "../components/Footer";
const page = () => {
  return (
    <div>
      <Header />
      <LiveHero />
      <AboutUsSection />
      <YellowStatsStrip />
      <LiveClassSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default page;
