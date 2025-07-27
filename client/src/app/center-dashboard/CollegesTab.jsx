import React from "react";

export default function CollegesTab() {
  return (
    <main className="flex-1 px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-blue-700 flex items-center">
          College Collaborations{" "}
          <i className="fa fa-share-alt ml-2 text-blue-600 cursor-pointer"></i>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-sm">
            Add new
          </button>
          <span className="font-bold text-blue-700 cursor-pointer">
            GNAAGBN
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="text-xl font-semibold mb-4">No Colleges Added</div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold text-base">
            Add New
          </button>
        </div>
      </div>
    </main>
  );
}
