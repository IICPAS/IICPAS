"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

const modules = {
  toolbar: [
    [
      {
        font: [
          "arial",
          "roboto",
          "serif",
          "monospace",
          "comic-sans",
          "times-new-roman",
          "courier-new",
          "georgia",
        ],
      },
    ],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [{ script: "sub" }, { script: "super" }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "font",
  "size",
  "header",
  "color",
  "background",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "script",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
  "video",
];

const BlogComponent = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Font whitelist registration for Quill
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("react-quill-new").then((quillModule) => {
        const Quill = quillModule.Quill || quillModule.default?.Quill;
        if (
          Quill &&
          typeof Quill.import === "function" &&
          Quill.imports &&
          Quill.imports["formats/font"]
        ) {
          const Font = Quill.import("formats/font") as { whitelist: string[] };
          Font.whitelist = [
            "arial",
            "roboto",
            "serif",
            "monospace",
            "comic-sans",
            "times-new-roman",
            "courier-new",
            "georgia",
          ];
          Quill.register("formats/font", Font, true);
        }
      });
    }
  }, []);

  // Image handler for Quill editor
  const quillRef = useRef<any>(null);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(`${API_BASE}/blogs/upload`, {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const { url } = await res.json();
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.insertEmbed(range.index, "image", url);
        }
      }
    };
  };

  const quillModules = {
    ...modules,
    toolbar: {
      container: modules.toolbar,
      handlers: {
        image: imageHandler,
      },
    },
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    if (!title || !author || !content) {
      setError("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("content", content);
      if (image) formData.append("image", image);

      // Axios auto-sets the correct headers for FormData

      console.log(API_BASE);
      const res = await axios.post(`${API_BASE}/blogs`, formData);

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.error || "Failed to create blog.");
      }

      setSuccess("Blog submitted!");
      setTitle("");
      setAuthor("");
      setImage(null);
      setPreviewUrl(null);
      setContent("");
    } catch (err: any) {
      // Axios error messages
      const msg =
        err.response?.data?.error || err.message || "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
      <h2 className="text-3xl font-bold text-blue-800">Create Blog Post</h2>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      {loading && <div className="text-blue-600">Submitting...</div>}

      <div className="space-y-2">
        <label className="block font-medium text-gray-700">Blog Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter blog title"
        />
      </div>
      <div className="space-y-2">
        <label className="block font-medium text-gray-700">Author Name</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter author name"
        />
      </div>
      <div className="space-y-2">
        <label className="block font-medium text-gray-700">
          Upload Banner Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full"
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full max-h-64 object-cover rounded shadow"
          />
        )}
      </div>
      <div className="space-y-2">
        <label className="block font-medium text-gray-700">Blog Content</label>
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={quillModules}
          formats={formats}
          theme="snow"
          className="bg-white"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
      >
        {loading ? "Submitting..." : "Submit Blog"}
      </button>
    </div>
  );
};

export default BlogComponent;
