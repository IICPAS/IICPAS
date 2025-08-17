import React from "react";
import StudentAuth from "../components/StudentAuth";
import Header from "../components/Header";

const page = () => {
  return (
    <>
      <Header />
      <div className="pt-10">
        <StudentAuth />
      </div>
    </>
  );
};

export default page;
