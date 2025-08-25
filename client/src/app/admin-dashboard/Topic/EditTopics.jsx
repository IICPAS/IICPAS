"use client";
import React from "react";
import { X } from "lucide-react";

const EditTopic = ({ formData, onChange, onSubmit, onCancel }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 shadow-xl rounded-2xl space-y-6 max-w-3xl mx-auto"
    >
      <h3 className="text-xl font-semibold text-gray-800">Edit Training</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="Enter training title"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Price per Hour (₹)
          </label>
          <input
            type="number"
            name="pricePerHour"
            value={formData.pricePerHour}
            onChange={onChange}
            placeholder="Enter price per hour"
            min="0"
            step="0.01"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Enter description"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 pt-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Update Training
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditTopic;
