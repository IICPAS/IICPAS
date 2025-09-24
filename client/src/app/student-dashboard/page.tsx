import React, { Suspense } from "react";
import StudentDashboard from "../components/StudentDashboard";

const page = () => {
  return (
    <div className="h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      }>
        <StudentDashboard />
      </Suspense>
    </div>
  );
};

export default page;
