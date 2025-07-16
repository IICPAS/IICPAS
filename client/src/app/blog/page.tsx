import React from "react";
import BlogSection from "../components/BlogsSection";
import BlogHero from "./BlogHero";
import Header from "../components/Header";

const page = () => {
  return (
    <div>
      <Header />
      <BlogHero />
      <BlogSection />
    </div>
  );
};

export default page;
