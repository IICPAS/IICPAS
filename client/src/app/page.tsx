import React from "react";
import HeroSection from "./components/HeroSection";
import NewsletterSection from "./components/Newsletter";
import Footer from "./components/Footer";
import BlogSection from "./components/BlogsSection";
import LiveClassSection from "./components/LiveClassSection";
import YellowStatsStrip from "./components/YellowStrip";
import AboutUsSection from "./components/AboutUsSection";
import CoursesSection from "./components/CourseSection";
import TestimonialSection from "./components/TestimonialSection";
import CourseCategorySection from "./components/CourseCategorySection";
import ContactSection from "./components/ContactSection";
import Header from "./components/Header";
import AlertMarquee from "./components/AlertMarquee";
import WhyIICPA from "./components/WhyIICPA";
import SearchCenter from "./components/SearchCenter";
import ScrollbarController from "./components/ScrollbarController";

const page = () => {
  return (
    <>
      <ScrollbarController />
      <AlertMarquee />
      <div className="pt-10">
        <Header />
        <HeroSection />
        <AboutUsSection />

        <CoursesSection />
        <WhyIICPA />
        <SearchCenter />
        <BlogSection />
        <YellowStatsStrip />
        <CourseCategorySection />
        <LiveClassSection />
        <TestimonialSection />
        <NewsletterSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
};

export default page;
