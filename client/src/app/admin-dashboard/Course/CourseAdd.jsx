import React, { useState } from "react";
import Select from "react-select";
import { useEffect } from "react";
import axios from "axios";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
  toolbar: [
    [{ font: [] }, { size: [] }],
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "align",
  "link",
  "image",
  "video",
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
// const CATEGORY_OPTIONS = [
//   { value: "Accounting", label: "Accounting" },
//   { value: "Taxation", label: "Taxation" },
//   { value: "HR", label: "HR" },
//   { value: "Finance", label: "Finance" },
//   { value: "US CMA", label: "US CMA" },
// ];
const LEVEL_OPTIONS = [
  { value: "Foundation", label: "Foundation" },
  { value: "Core", label: "Core" },
  { value: "Expert", label: "Expert" },
];
const initialForm = {
  category: null,
  title: "",
  slug: "",
  price: "",
  level: null,
  discount: "",
  status: "Active",
  video: "",
  description: "",
  examCert: "",
  caseStudy: "",
  seoTitle: "",
  seoKeywords: "",
  seoDescription: "",
  image: null,
};

export default function CourseAddTab({ onBack }) {
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch available categories for select dropdown
    axios
      .get(`${API_BASE}/categories`)
      .then((res) => {
        // If your API returns array of objects with a "category" field:
        setCategoryOptions(
          res.data.map((c) => ({
            value: c.category,
            label: c.category,
          }))
        );
      })
      .catch(() => setCategoryOptions([]));
  }, []);

  const handleCategoryChange = (option) =>
    setForm((f) => ({ ...f, category: option }));
  const handleLevelChange = (option) =>
    setForm((f) => ({ ...f, level: option }));

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  // This function updates each quill field by key
  const handleQuillChange = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

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
    setError("");

    try {
      const fd = new FormData();

      // Add category and level from select inputs
      fd.append("category", form.category?.value || "");
      fd.append("level", form.level?.value || "");

      // Add the rest of the fields
      Object.entries(form).forEach(([k, v]) => {
        if (["category", "level"].includes(k)) return;
        if (v === null || v === undefined) return;

        // Handle File input
        if (v instanceof File) {
          fd.append(k, v);
        }
        // Handle FileList (e.g., multiple files)
        else if (v instanceof FileList) {
          Array.from(v).forEach((file) => fd.append(k, file));
        }
        // Handle Array (could be text, numbers, etc.)
        else if (Array.isArray(v)) {
          v.forEach((item, idx) =>
            fd.append(
              `${k}[${idx}]`,
              typeof item === "object" ? JSON.stringify(item) : item
            )
          );
        }
        // Handle Object (not File)
        else if (typeof v === "object") {
          fd.append(k, JSON.stringify(v));
        }
        // Handle primitive values
        else {
          fd.append(k, v);
        }
      });

      // Send the request WITHOUT setting Content-Type
      await axios.post(`${API_BASE}/courses`, fd);

      setForm(initialForm);
      if (onBack) onBack();
    } catch (err) {
      setError(err?.response?.data?.message || "Error adding course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[2400px] mx-auto bg-white rounded-2xl p-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold">Create Course</h3>
        <button
          type="button"
          onClick={onBack}
          className="bg-blue-700 text-white px-5 py-2 rounded flex items-center gap-2"
        >
          <FaArrowLeft /> View Courses
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Top Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block mb-1 font-semibold">
                Select Category
              </label>
              <Select
                options={categoryOptions}
                value={form.category}
                onChange={handleCategoryChange}
                placeholder="Select Category"
                required
                styles={{ control: (base) => ({ ...base, minHeight: "40px" }) }}
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
              <label className="block mb-1 font-semibold">
                Course Video Link
              </label>
              <input
                name="video"
                placeholder="Enter the course video link"
                className="w-full border p-2 rounded"
                value={form.video}
                onChange={handleInputChange}
              />
            </div>
          </div>
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
                styles={{ control: (base) => ({ ...base, minHeight: "40px" }) }}
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

        {/* Quill Editors */}
        <div>
          <label className="block mb-1 font-semibold text-lg">
            Course Description
          </label>
          <ReactQuill
            value={form.description}
            onChange={handleQuillChange("description")}
            modules={modules}
            formats={formats}
            theme="snow"
            placeholder="Start typing..."
            style={{ minHeight: 180, marginBottom: 16 }}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold border-b mb-3 pb-1">
            Exam and Certification
          </h2>
          <label className="block mb-1 font-semibold">Description</label>
          <ReactQuill
            value={form.examCert}
            onChange={handleQuillChange("examCert")}
            modules={modules}
            formats={formats}
            theme="snow"
            placeholder="Start typing..."
            style={{ minHeight: 150, marginBottom: 16 }}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold border-b mb-3 pb-1">
            Case Study
          </h2>
          <label className="block mb-1 font-semibold">Description</label>
          <ReactQuill
            value={form.caseStudy}
            onChange={handleQuillChange("caseStudy")}
            modules={modules}
            formats={formats}
            theme="snow"
            placeholder="Start typing..."
            style={{ minHeight: 150, marginBottom: 16 }}
          />
        </div>

        {/* SEO Section */}
        <div className="border-t pt-8 mt-8">
          <h2 className="text-xl font-semibold mb-3">SEO Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block mb-1 font-semibold">Title</label>
              <input
                name="seoTitle"
                placeholder="Enter title"
                className="w-full border p-2 rounded"
                value={form.seoTitle}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Description</label>
              <ReactQuill
                value={form.seoDescription}
                onChange={handleQuillChange("seoDescription")}
                modules={modules}
                formats={formats}
                theme="snow"
                placeholder="Enter SEO description"
                style={{ minHeight: 100, marginBottom: 16 }}
              />
            </div>
          </div>
          <div className="mt-5">
            <label className="block mb-1 font-semibold">Keywords</label>
            <textarea
              name="seoKeywords"
              placeholder="Enter keywords"
              className="w-full border p-2 rounded min-h-[48px]"
              value={form.seoKeywords}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {error && <div className="text-red-600 mt-4">{error}</div>}
        <div className="flex justify-end mt-10">
          <button
            type="submit"
            className="bg-blue-600 text-white px-7 py-2 rounded flex items-center gap-2 text-lg"
            disabled={loading}
          >
            <FaPlus /> {loading ? "Saving..." : "Add Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
