"use client";

import dynamic from "next/dynamic";

const SpecialOfferFlashCard = dynamic(() => import("./SpecialOfferFlashCard"), {
  ssr: false,
});

const SpecialOfferWrapper = ({ location, maxCards }) => {
  return <SpecialOfferFlashCard location={location} maxCards={maxCards} />;
};

export default SpecialOfferWrapper;
