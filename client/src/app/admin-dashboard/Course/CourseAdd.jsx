import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import axios from "axios";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

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

  const joditConfig = {
    readonly: false,
    height: 200,
    uploader: { insertImageAsBase64URI: true },
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    spellcheck: true,
  };

  useEffect(() => {
    axios
      .get(`${API_BASE}/categories`)
      .then((res) => {
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

  const handleJoditChange = (field) => (value) => {
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

      fd.append("category", form.category?.value || "");
      fd.append("level", form.level?.value || "");

      Object.entries(form).forEach(([k, v]) => {
        if (["category", "level"].includes(k)) return;
        if (v === null || v === undefined) return;

        if (v instanceof File) {
          fd.append(k, v);
        } else if (v instanceof FileList) {
          Array.from(v).forEach((file) => fd.append(k, file));
        } else if (Array.isArray(v)) {
          v.forEach((item, idx) =>
            fd.append(
              `${k}[${idx}]`,
              typeof item === "object" ? JSON.stringify(item) : item
            )
          );
        } else if (typeof v === "object") {
          fd.append(k, JSON.stringify(v));
        } else {
          fd.append(k, v);
        }
      });

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
              {/* Show preview of selected image */}
              {form.image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Course Preview"
                    className="h-24 rounded shadow border"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-semibold">Discount (%)</label>
              <input
                name="discount"
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

        {/* Jodit Editors */}
        <div>
          <label className="block mb-1 font-semibold text-lg">
            Course Description
          </label>
          <JoditEditor
            value={form.description}
            config={joditConfig}
            onBlur={handleJoditChange("description")}
            onChange={() => {}}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold border-b mb-3 pb-1">
            Exam and Certification
          </h2>
          <label className="block mb-1 font-semibold">Description</label>
          <JoditEditor
            value={form.examCert}
            config={joditConfig}
            onBlur={handleJoditChange("examCert")}
            onChange={() => {}}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold border-b mb-3 pb-1">
            Case Study
          </h2>
          <label className="block mb-1 font-semibold">Description</label>
          <JoditEditor
            value={form.caseStudy}
            config={joditConfig}
            onBlur={handleJoditChange("caseStudy")}
            onChange={() => {}}
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
              <JoditEditor
                value={form.seoDescription}
                config={{ ...joditConfig, height: 120 }}
                onBlur={handleJoditChange("seoDescription")}
                onChange={() => {}}
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
