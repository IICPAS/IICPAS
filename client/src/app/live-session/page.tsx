import React from "react";
import Header from "../components/Header";
import LiveClassSection from "../components/LiveClassSection";
import AboutUsSection from "../components/AboutUsSection";
import NewsletterSection from "../components/Newsletter";
import LiveHero from "./LiveHero";
import YellowStatsStrip from "../components/YellowStrip";
const page = () => {
  return (
    <div className="pb-20">
      <Header />
      <LiveHero />
      <AboutUsSection />
      <YellowStatsStrip />
      <LiveClassSection />
      <NewsletterSection />
    </div>
  );
};

export default page;
