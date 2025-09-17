import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import React from "react";
import IndividualAuth from "./IndividualAuth";

const page = () => {
  return (
    <div>
      <Header />
      <IndividualAuth />
      <Footer />
    </div>
  );
};

export default page;
