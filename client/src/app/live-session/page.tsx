import React from "react";
import Header from "../components/Header";
import LiveHero from "./LiveHero";
import LiveClassesDisplay from "../components/LiveClassesDisplay";
import Footer from "../components/Footer";
const page = () => {
  return (
    <div>
      <Header />
      <LiveHero />
      <LiveClassesDisplay />
      <Footer />
    </div>
  );
};

export default page;
