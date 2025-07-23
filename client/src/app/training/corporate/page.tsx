import Header from "@/app/components/Header";
import React from "react";
import CorporateHero from "./CorporateHero";
import CorporateTrainingPanel from "./CorporateTrainingPanel";

const page = () => {
  return (
    <>
      <Header />
      <CorporateHero />
      <CorporateTrainingPanel />
    </>
  );
};

export default page;
