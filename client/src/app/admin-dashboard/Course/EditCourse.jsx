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

export default function EditCourse({ courseId, onBack }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [simulations, setSimulations] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

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
    defaultActionOnPaste: "insert_clear_html",
    enterMode: "BR",
    useSearch: false,
    showXPathInStatusbar: false,
  };

  // Debounced change handler to prevent typing interruption
  const debouncedJoditChange = useCallback(
    (field) => (value) => {
      setForm((f) => ({ ...f, [field]: value }));
    },
    []
  );

  useEffect(() => {
    setMounted(true);

    // Load course data
    axios.get(`${API_BASE}/courses/${courseId}`).then((res) => {
      const c = res.data;
      setForm({
        category:
          CATEGORY_OPTIONS.find((opt) => opt.value === c.category) || null,
        title: c.title || "",
        slug: c.slug || "",
        price: c.price || "",
        discount: c.discount || "",
        status: c.status || "Active",
        video: c.video || "",
        description: c.description || "",
        examCert: c.examCert || "",
        caseStudy: c.caseStudy || "",
        assignment: c.assignment || "",
        seoTitle: c.seoTitle || "",
        seoKeywords: c.seoKeywords || "",
        seoDescription: c.seoDescription || "",
        metaTitle: c.metaTitle || "",
        metaKeywords: c.metaKeywords || "",
        metaDescription: c.metaDescription || "",
        image: null,
        imageUrl: c.image || "",
        // Pricing fields for both live and recorded sessions
        recordedSessionPrice: c.pricing?.recordedSession?.price || "",
        recordedSessionDiscount: c.pricing?.recordedSession?.discount || "",
        liveSessionPrice: c.pricing?.liveSession?.price || "",
        liveSessionDiscount: c.pricing?.liveSession?.discount || "",
        // Center pricing fields
        recordedSessionCenterPrice:
          c.pricing?.recordedSessionCenter?.price || "",
        recordedSessionCenterDiscount:
          c.pricing?.recordedSessionCenter?.discount || "",
        liveSessionCenterPrice: c.pricing?.liveSessionCenter?.price || "",
        liveSessionCenterDiscount: c.pricing?.liveSessionCenter?.discount || "",
      });

      // Load simulations
      setSimulations(c.simulations || []);
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

  const handleJoditChange = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleCategoryChange = (option) =>
    setForm((f) => ({ ...f, category: option }));

  // Simulation image upload handler
  const handleSimulationImageUpload = async (file) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `${API_BASE}/courses/upload-simulation-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading simulation image:", error);
      MySwal.fire("Error", "Failed to upload simulation image", "error");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Add new simulation
  const addSimulation = async () => {
    const title = prompt("Enter simulation title:");
    if (!title) return;

    const description = prompt("Enter simulation description:");
    if (!description) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const imageUrl = await handleSimulationImageUpload(file);
      if (imageUrl) {
        const newSimulation = {
          title,
          description,
          imageUrl,
          order: simulations.length,
        };
        setSimulations([...simulations, newSimulation]);
      }
    };
    fileInput.click();
  };

  // Remove simulation
  const removeSimulation = (index) => {
    setSimulations(simulations.filter((_, i) => i !== index));
  };

  // Update simulation order
  const updateSimulationOrder = (index, newOrder) => {
    const updatedSimulations = [...simulations];
    updatedSimulations[index].order = newOrder;
    setSimulations(updatedSimulations);
  };

  const getFinalPrice = () => {
    const price = parseFloat(form.price) || 0;
    const discount = parseFloat(form.discount) || 0;
    return price && discount
      ? Math.max(0, price - (price * discount) / 100)
      : price || "";
  };

  const getRecordedSessionFinalPrice = () => {
    const price = parseFloat(form.recordedSessionPrice) || 0;
    const discount = parseFloat(form.recordedSessionDiscount) || 0;
    return price && discount
      ? Math.max(0, price - (price * discount) / 100)
      : price || "";
  };

  const getLiveSessionFinalPrice = () => {
    const price = parseFloat(form.liveSessionPrice) || 0;
    const discount = parseFloat(form.liveSessionDiscount) || 0;
    return price && discount
      ? Math.max(0, price - (price * discount) / 100)
      : price || "";
  };

  const getRecordedSessionCenterFinalPrice = () => {
    const price = parseFloat(form.recordedSessionCenterPrice) || 0;
    const discount = parseFloat(form.recordedSessionCenterDiscount) || 0;
    return price && discount
      ? Math.max(0, price - (price * discount) / 100)
      : price || "";
  };

  const getLiveSessionCenterFinalPrice = () => {
    const price = parseFloat(form.liveSessionCenterPrice) || 0;
    const discount = parseFloat(form.liveSessionCenterDiscount) || 0;
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

      // Add pricing structure
      const pricing = {
        recordedSession: {
          title: "DIGITAL HUB RECORDED SESSION",
          buttonText: "Add Digital Hub",
          price: parseFloat(form.recordedSessionPrice) || 0,
          discount: parseFloat(form.recordedSessionDiscount) || 0,
          finalPrice: getRecordedSessionFinalPrice(),
        },
        liveSession: {
          title: "DIGITAL HUB LIVE SESSION",
          buttonText: "Add Digital Hub+",
          price: parseFloat(form.liveSessionPrice) || 0,
          discount: parseFloat(form.liveSessionDiscount) || 0,
          finalPrice: getLiveSessionFinalPrice(),
        },
        recordedSessionCenter: {
          title: "DIGITAL HUB+ RECORDED SESSION+ CENTER",
          buttonText: "Add Digital Hub+ Center",
          price: parseFloat(form.recordedSessionCenterPrice) || 0,
          discount: parseFloat(form.recordedSessionCenterDiscount) || 0,
          finalPrice: getRecordedSessionCenterFinalPrice(),
        },
        liveSessionCenter: {
          title: "DIGITAL HUB+ LIVE SESSION+ CENTER",
          buttonText: "Add Digital Hub+ Center",
          price: parseFloat(form.liveSessionCenterPrice) || 0,
          discount: parseFloat(form.liveSessionCenterDiscount) || 0,
          finalPrice: getLiveSessionCenterFinalPrice(),
        },
      };
      fd.append("pricing", JSON.stringify(pricing));

      Object.entries(form).forEach(([k, v]) => {
        if (
          [
            "category",
            "imageUrl",
            "recordedSessionPrice",
            "recordedSessionDiscount",
            "liveSessionPrice",
            "liveSessionDiscount",
            "recordedSessionCenterPrice",
            "recordedSessionCenterDiscount",
            "liveSessionCenterPrice",
            "liveSessionCenterDiscount",
          ].includes(k)
        )
          return;
        if (v !== null && v !== undefined) fd.append(k, v);
      });

      // Add simulations data
      fd.append("simulations", JSON.stringify(simulations));

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
                  src={
                    form.imageUrl.startsWith("http")
                      ? form.imageUrl
                      : `${
                          process.env.NEXT_PUBLIC_API_URL ||
                          "http://localhost:8080"
                        }${form.imageUrl}`
                  }
                  alt="Current Course"
                  className="h-24 rounded shadow border"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <p className="text-xs text-red-500" style={{ display: "none" }}>
                  Image not found
                </p>
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
            {/* Recorded Session Pricing */}
            <div className="border p-4 rounded-lg bg-green-50">
              <h4 className="font-semibold text-green-800 mb-3">
                Recorded Session Pricing
              </h4>
              <div className="space-y-3">
                <div>
                  <label>Recorded Session Price</label>
                  <input
                    name="recordedSessionPrice"
                    type="number"
                    value={form.recordedSessionPrice}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label>Recorded Session Discount (%)</label>
                  <input
                    name="recordedSessionDiscount"
                    type="number"
                    value={form.recordedSessionDiscount}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label>Recorded Session Final Price</label>
                  <input
                    value={getRecordedSessionFinalPrice()}
                    readOnly
                    className="w-full border p-2 rounded bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Live Session Pricing */}
            <div className="border p-4 rounded-lg bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-3">
                Live Session Pricing
              </h4>
              <div className="space-y-3">
                <div>
                  <label>Live Session Price</label>
                  <input
                    name="liveSessionPrice"
                    type="number"
                    value={form.liveSessionPrice}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label>Live Session Discount (%)</label>
                  <input
                    name="liveSessionDiscount"
                    type="number"
                    value={form.liveSessionDiscount}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label>Live Session Final Price</label>
                  <input
                    value={getLiveSessionFinalPrice()}
                    readOnly
                    className="w-full border p-2 rounded bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Recorded Session + Center Pricing */}
            <div className="border p-4 rounded-lg bg-green-50">
              <h4 className="font-semibold text-green-800 mb-3">
                Recorded Session + Center Pricing
              </h4>
              <div className="space-y-3">
                <div>
                  <label>Recorded Session + Center Price</label>
                  <input
                    name="recordedSessionCenterPrice"
                    type="number"
                    value={form.recordedSessionCenterPrice}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label>Recorded Session + Center Discount (%)</label>
                  <input
                    name="recordedSessionCenterDiscount"
                    type="number"
                    value={form.recordedSessionCenterDiscount}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label>Recorded Session + Center Final Price</label>
                  <input
                    value={getRecordedSessionCenterFinalPrice()}
                    readOnly
                    className="w-full border p-2 rounded bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Live Session + Center Pricing */}
            <div className="border p-4 rounded-lg bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-3">
                Live Session + Center Pricing
              </h4>
              <div className="space-y-3">
                <div>
                  <label>Live Session + Center Price</label>
                  <input
                    name="liveSessionCenterPrice"
                    type="number"
                    value={form.liveSessionCenterPrice}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label>Live Session + Center Discount (%)</label>
                  <input
                    name="liveSessionCenterDiscount"
                    type="number"
                    value={form.liveSessionCenterDiscount}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label>Live Session + Center Final Price</label>
                  <input
                    value={getLiveSessionCenterFinalPrice()}
                    readOnly
                    className="w-full border p-2 rounded bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Legacy Price Fields (for backward compatibility) */}
            <div className="border p-4 rounded-lg bg-gray-50">
              <h4 className="font-semibold text-gray-800 mb-3">
                Legacy Price (Optional)
              </h4>
              <div className="space-y-3">
                <div>
                  <label>Price</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label>Discount (%)</label>
                  <input
                    name="discount"
                    type="number"
                    value={form.discount}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label>Final Price</label>
                  <input
                    value={getFinalPrice()}
                    readOnly
                    className="w-full border p-2 rounded bg-gray-100"
                  />
                </div>
              </div>
            </div>

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

        <div>
          <label className="block font-semibold mb-1">Assignment</label>
          <JoditEditor
            value={form.assignment}
            config={joditConfig}
            onChange={debouncedJoditChange("assignment")}
            onBlur={handleJoditChange("assignment")}
          />
        </div>

        {/* Simulations Section */}
        <div className="pt-8 border-t mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Simulations</h2>
            <button
              type="button"
              onClick={addSimulation}
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
              disabled={uploadingImage}
            >
              {uploadingImage ? "Uploading..." : "+ Add Simulation"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {simulations.map((simulation, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm">{simulation.title}</h3>
                  <button
                    type="button"
                    onClick={() => removeSimulation(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {simulation.description}
                </p>
                {simulation.imageUrl && (
                  <img
                    src={
                      simulation.imageUrl.startsWith("http")
                        ? simulation.imageUrl
                        : `${
                            process.env.NEXT_PUBLIC_API_URL ||
                            "http://localhost:8080"
                          }${simulation.imageUrl}`
                    }
                    alt={simulation.title}
                    className="w-full h-32 object-cover rounded"
                  />
                )}
                <div className="mt-2">
                  <label className="text-xs text-gray-500">Order:</label>
                  <input
                    type="number"
                    value={simulation.order}
                    onChange={(e) =>
                      updateSimulationOrder(index, parseInt(e.target.value))
                    }
                    className="w-full text-xs border rounded px-2 py-1"
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>

          {simulations.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No simulations added yet. Click "Add Simulation" to get started.
            </p>
          )}
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

        {/* Meta Tags Section */}
        <div className="pt-8 border-t mt-8">
          <h2 className="text-xl font-semibold mb-3">Meta Tags</h2>
          <label>Meta Title</label>
          <input
            name="metaTitle"
            value={form.metaTitle}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Enter meta title for additional SEO"
          />
          <label>Meta Description</label>
          <JoditEditor
            value={form.metaDescription}
            config={joditConfig}
            onChange={debouncedJoditChange("metaDescription")}
            onBlur={handleJoditChange("metaDescription")}
          />
          <label>Meta Keywords</label>
          <textarea
            name="metaKeywords"
            value={form.metaKeywords}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Enter meta keywords separated by commas"
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
