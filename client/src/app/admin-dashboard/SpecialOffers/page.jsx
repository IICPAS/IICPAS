import React from "react";
import SpecialOffersTab from "./SpecialOffersTab";

const SpecialOffersPage = () => {
  const handleBack = () => {
    // Navigate back to admin dashboard
    window.history.back();
  };

  return <SpecialOffersTab onBack={handleBack} />;
};

export default SpecialOffersPage;
