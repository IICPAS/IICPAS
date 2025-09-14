import React from "react";
import BlogSection from "../components/BlogsSection";
import BlogHero from "./BlogHero";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollbarController from "../components/ScrollbarController";

const page = () => {
  return (
    <div>
      <ScrollbarController />
      <Header />
      <BlogHero />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default page;
