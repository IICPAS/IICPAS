import React from "react";
import Header from "../components/Header";
import StudentDashboard from "../components/StudentDashboard";

const page = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <StudentDashboard />
      </div>
    </div>
  );
};

export default page;
