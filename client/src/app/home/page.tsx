import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import WhyIICPA from "../components/WhyIICPA";
import AboutUsSection from "../components/AboutUsSection";
import CoursesSection from "../components/CourseSection";
import BlogSection from "../components/BlogsSection";
import YellowStatsStrip from "../components/YellowStrip";
import LiveClassSection from "../components/LiveClassSection";
import TestimonialCarousel from "../components/TestimonialSection";
import NewsletterSection from "../components/Newsletter";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import ScrollbarController from "../components/ScrollbarController";

const page = () => {
  return (
    <div>
      <ScrollbarController />
      <Header />
      <HeroSection />
      <WhyIICPA />
      <AboutUsSection />
      <CoursesSection />
      <BlogSection />
      <YellowStatsStrip />
      <LiveClassSection />
      <TestimonialCarousel />
      <NewsletterSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default page;
