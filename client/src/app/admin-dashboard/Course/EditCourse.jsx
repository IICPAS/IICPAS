"use client";
import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import axios from "axios";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
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
  const [mounted, setMounted] = useState(false);

  const joditConfig = {
    readonly: false,
    height: 200,
    uploader: { insertImageAsBase64URI: true },
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    spellcheck: true,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html',
    enterMode: 'BR',
    useSearch: false,
    showXPathInStatusbar: false,
  };

  useEffect(() => {
    setMounted(true);
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
        video: c.video || "",
        description: c.description || "",
        examCert: c.examCert || "",
        caseStudy: c.caseStudy || "",
        seoTitle: c.seoTitle || "",
        seoKeywords: c.seoKeywords || "",
        seoDescription: c.seoDescription || "",
        image: null,
        imageUrl: c.image || "",
      });
    });
  }, [courseId]);

  if (!form || !mounted) return <div className="p-8">Loading course...</div>;

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    const val = files ? files[0] : value;

    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setForm((f) => ({ ...f, title: value, slug }));
    } else {
      setForm((f) => ({ ...f, [name]: val }));
    }
  };

  // Debounced change handler to prevent typing interruption
  const debouncedJoditChange = useCallback(
    (field) => (value) => {
      setForm((f) => ({ ...f, [field]: value }));
    },
    []
  );

  const handleJoditChange = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }));
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

      MySwal.fire("Success", "Course updated successfully!", "success");
      if (onBack) onBack();
    } catch (err) {
      MySwal.fire("Error", "Failed to update course", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow p-10">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold">Edit Course</h3>
        <button
          onClick={onBack}
          className="bg-blue-700 text-white px-5 py-2 rounded flex items-center gap-2"
        >
          <FaArrowLeft /> View Courses
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label>Category</label>
            <Select
              options={CATEGORY_OPTIONS}
              value={form.category}
              onChange={handleCategoryChange}
            />
            <label>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
            <label>Slug</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            <label>Course Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full"
            />
            {/* Show existing image */}
            {form.imageUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Current Image:</p>
                <img
                  src={form.imageUrl.startsWith('http') ? form.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${form.imageUrl}`}
                  alt="Current Course"
                  className="h-24 rounded shadow border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <p className="text-xs text-red-500" style={{display: 'none'}}>Image not found</p>
              </div>
            )}
            {/* Show preview of newly selected image */}
            {form.image && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">New Image Preview:</p>
                <img
                  src={URL.createObjectURL(form.image)}
                  alt="New Course Preview"
                  className="h-24 rounded shadow border"
                />
              </div>
            )}
            <label>Video Link</label>
            <input
              name="video"
              value={form.video}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="space-y-4">
            <label>Level</label>
            <Select
              options={LEVEL_OPTIONS}
              value={form.level}
              onChange={handleLevelChange}
            />
            <label>Price</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
            <label>Discount (%)</label>
            <input
              name="discount"
              type="number"
              value={form.discount}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            <label>Final Price</label>
            <input
              value={getFinalPrice()}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Rich Text Sections */}
        <div>
          <label className="block font-semibold mb-1">Course Description</label>
          <JoditEditor
            value={form.description}
            config={joditConfig}
            onChange={debouncedJoditChange("description")}
            onBlur={handleJoditChange("description")}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">
            Exam & Certification
          </label>
          <JoditEditor
            value={form.examCert}
            config={joditConfig}
            onChange={debouncedJoditChange("examCert")}
            onBlur={handleJoditChange("examCert")}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Case Study</label>
          <JoditEditor
            value={form.caseStudy}
            config={joditConfig}
            onChange={debouncedJoditChange("caseStudy")}
            onBlur={handleJoditChange("caseStudy")}
          />
        </div>

        {/* SEO Section */}
        <div className="pt-8 border-t mt-8">
          <h2 className="text-xl font-semibold mb-3">SEO Section</h2>
          <label>SEO Title</label>
          <input
            name="seoTitle"
            value={form.seoTitle}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
          <label>SEO Description</label>
          <JoditEditor
            value={form.seoDescription}
            config={joditConfig}
            onChange={debouncedJoditChange("seoDescription")}
            onBlur={handleJoditChange("seoDescription")}
          />
          <label>SEO Keywords</label>
          <textarea
            name="seoKeywords"
            value={form.seoKeywords}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
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
