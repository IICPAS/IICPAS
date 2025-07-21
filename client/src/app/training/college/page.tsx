import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import React from "react";
import TrainingHero from "./TrainingHero";
import CollegeTrainingPanel from "./CollegeTrainingPanel";

const page = () => {
  return (
    <>
      <Header />
      <TrainingHero />
      <CollegeTrainingPanel />
    </>
  );
};

export default page;
