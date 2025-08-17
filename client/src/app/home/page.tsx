import React from "react";
import Header from "../components/Header";
import AboutHero from "../contact/ContactHero";
import HeroSection from "../components/HeroSection";
import WhyIICPA from "../components/WhyIICPA";
import AboutUsSection from "../components/AboutUsSection";
import CoursesSection from "../components/CourseSection";
import BlogSection from "../components/BlogsSection";
import YellowStatsStrip from "../components/YellowStrip";
import FinanceCourseCategorySection from "../components/CourseCategorySection";
import LiveClassSection from "../components/LiveClassSection";
import TestimonialCarousel from "../components/TestimonialSection";
import NewsletterSection from "../components/Newsletter";
import ContactSection from "../components/ContactSection";

const page = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <WhyIICPA />
      <AboutUsSection />
      <CoursesSection />
      <BlogSection />
      <YellowStatsStrip />
      <FinanceCourseCategorySection />
      <LiveClassSection />
      <TestimonialCarousel />
      <NewsletterSection />
      <ContactSection />
    </div>
  );
};

export default page;
