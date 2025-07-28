import React from "react";

export default function BatchesTab() {
  return (
    <main className="flex-1 px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-blue-700 flex items-center">
          Manage Batches{" "}
          <i className="fa fa-share-alt ml-2 text-blue-600 cursor-pointer"></i>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-sm">
            Add new
          </button>
          <button className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold text-sm">
            View Completed
          </button>
          <span className="font-bold text-blue-700 cursor-pointer">
            GNAAGBN
          </span>
        </div>
      </div>
      <div className="bg-white rounded shadow border p-8">
        <div className="flex items-center gap-6 text-lg">
          <label>
            <input
              type="radio"
              name="batchType"
              checked
              readOnly
              className="mr-2"
            />{" "}
            Classroom
          </label>
          <label>
            <input type="radio" name="batchType" className="mr-2" /> Online
          </label>
        </div>
      </div>
    </main>
  );
}
