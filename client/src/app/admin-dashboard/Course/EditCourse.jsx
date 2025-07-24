"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const MySwal = withReactContent(Swal);
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const CATEGORY_OPTIONS = [
  { value: "Accounting", label: "Accounting" },
  { value: "Taxation", label: "Taxation" },
  { value: "HR", label: "HR" },
  { value: "Finance", label: "Finance" },
  { value: "US CMA", label: "US CMA" },
];

const LEVEL_OPTIONS = [
  { value: "Foundation", label: "Foundation" },
  { value: "Core", label: "Core" },
  { value: "Expert", label: "Expert" },
];

export default function EditCourse({ courseId, onBack }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fix hydration issues by only rendering after mount (for image URL, etc)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Fetch course data on mount
    axios.get(`${API_BASE}/courses/${courseId}`).then((res) => {
      const c = res.data;
      setForm({
        category:
          CATEGORY_OPTIONS.find((opt) => opt.value === c.category) || null,
        title: c.title || "",
        slug: c.slug || "",
        price: c.price || "",
        level: LEVEL_OPTIONS.find((opt) => opt.value === c.level) || null,
        discount: c.discount || "",
        status: c.status || "Active",
        description: c.description || "",
        image: null,
        imageUrl: c.image || "",
      });
    });
  }, [courseId]);

  if (!form || !mounted)
    return <div className="p-8 text-lg text-gray-500">Loading...</div>;

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCategoryChange = (option) =>
    setForm((f) => ({ ...f, category: option }));
  const handleLevelChange = (option) =>
    setForm((f) => ({ ...f, level: option }));

  const getFinalPrice = () => {
    const price = parseFloat(form.price) || 0;
    const discount = parseFloat(form.discount) || 0;
    return price && discount
      ? Math.max(0, price - (price * discount) / 100)
      : price || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("category", form.category?.value || "");
      fd.append("level", form.level?.value || "");
      Object.entries(form).forEach(([k, v]) => {
        if (["category", "level", "imageUrl"].includes(k)) return;
        if (v !== null && v !== undefined) fd.append(k, v);
      });

      await axios.put(`${API_BASE}/courses/${courseId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      MySwal.fire("Updated!", "Course updated successfully!", "success");
      if (onBack) onBack();
    } catch (err) {
      MySwal.fire("Error!", "Failed to update course", "error");
    } finally {
      setLoading(false);
    }
  };

  console.log(courseId);

  return (
    <div className="w-full bg-white shadow rounded-lg p-10">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold">Edit Course</h3>
        <button
          type="button"
          onClick={onBack}
          className="bg-blue-700 text-white px-5 py-2 rounded flex items-center gap-2"
        >
          <FaArrowLeft /> View Courses
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-8 w-full">
          {/* Left column */}
          <div className="space-y-5">
            <div>
              <label className="block mb-1 font-semibold">
                Select Category
              </label>
              <Select
                options={CATEGORY_OPTIONS}
                value={form.category}
                onChange={handleCategoryChange}
                placeholder="Select Category"
                required
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: "40px",
                  }),
                }}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Course Name</label>
              <input
                name="title"
                placeholder="Enter course name"
                className="w-full border p-2 rounded"
                value={form.title}
                onChange={handleInputChange}
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Course Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                className="w-full"
              />
              {form.imageUrl && (
                <div className="mt-2">
                  <img
                    src={process.env.NEXT_PUBLIC_API_URL + form.imageUrl}
                    alt="Current"
                    className="h-24 rounded shadow border"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-semibold">Discount (%)</label>
              <input
                name="discount"
                placeholder="Enter the Discount"
                type="number"
                className="w-full border p-2 rounded"
                value={form.discount}
                onChange={handleInputChange}
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Description</label>
              <textarea
                name="description"
                placeholder="Enter course description"
                className="w-full border p-2 rounded min-h-[80px]"
                value={form.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Right column */}
          <div className="space-y-5">
            <div>
              <label className="block mb-1 font-semibold">
                Select course level
              </label>
              <Select
                options={LEVEL_OPTIONS}
                value={form.level}
                onChange={handleLevelChange}
                placeholder="Select course level"
                required
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: "40px",
                  }),
                }}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Course Slug</label>
              <input
                name="slug"
                placeholder="Enter course slug"
                className="w-full border p-2 rounded"
                value={form.slug || ""}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Actual Price</label>
              <input
                name="price"
                placeholder="Enter actual price"
                type="number"
                className="w-full border p-2 rounded"
                value={form.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">
                Price After Discount
              </label>
              <input
                name="finalPrice"
                placeholder="Final Price"
                type="number"
                className="w-full border p-2 rounded bg-gray-100"
                value={getFinalPrice()}
                readOnly
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Status</label>
              <select
                name="status"
                className="w-full border p-2 rounded"
                value={form.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-10">
          <button
            type="submit"
            className="bg-blue-600 text-white px-7 py-2 rounded flex items-center gap-2 text-lg"
            disabled={loading}
          >
            <FaSave /> {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
