import Header from "@/app/components/Header";
import React from "react";
import IndividualTrainingPanel from "./IndividualTrainingPanel";
import PracticalHero from "./PracticalHero";

const page = () => {
  return (
    <div>
      <Header />
      <PracticalHero />
      <IndividualTrainingPanel />
    </div>
  );
};

export default page;
