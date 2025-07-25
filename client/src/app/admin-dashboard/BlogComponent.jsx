"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import QuillEditor from "../components/QuillEditor"; // Adjust if needed

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

const MainArea = {
  LIST: "LIST",
  CREATE: "CREATE",
  EDIT: "EDIT",
  PREVIEW: "PREVIEW",
};

const BlogComponent = () => {
  const [mainArea, setMainArea] = useState(MainArea.LIST);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Form state
  const [form, setForm] = useState({
    title: "",
    author: "",
    image: null,
    previewUrl: null,
    content: "",
    id: null,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/blogs`);
      setBlogs(res.data || []);
    } catch {
      setBlogs([]);
    }
    setLoading(false);
  };

  // Image upload for form
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({
        ...f,
        image: file,
        previewUrl: URL.createObjectURL(file),
      }));
    }
  };

  // RESET form state
  const resetForm = () => {
    setForm({
      title: "",
      author: "",
      image: null,
      previewUrl: null,
      content: "",
      id: null,
    });
    setError("");
    setSuccess("");
  };

  // Form submit (Create or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.title || !form.author || !form.content) {
      setError("Please fill all fields.");
      return;
    }
    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("content", form.content);
      if (form.image) formData.append("image", form.image);

      let res;
      if (mainArea === MainArea.EDIT && form.id) {
        res = await axios.put(`${API_BASE}/blogs/${form.id}`, formData);
      } else {
        res = await axios.post(`${API_BASE}/blogs`, formData);
      }
      if (res.status !== 201 && res.status !== 200) throw new Error("Failed.");
      setSuccess(
        mainArea === MainArea.EDIT ? "Blog updated!" : "Blog created!"
      );
      resetForm();
      setMainArea(MainArea.LIST);
      fetchBlogs();
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Something went wrong."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // SweetAlert2 Delete Confirm
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API_BASE}/blogs/${id}`);
      fetchBlogs();
      Swal.fire("Deleted!", "The blog has been deleted.", "success");
    } catch {
      Swal.fire("Error", "Failed to delete blog", "error");
    }
  };

  // Toggle blog status
  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE}/blogs/${id}/toggle-status`);
      setBlogs((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: res.data.status } : b))
      );
    } catch {
      Swal.fire("Error", "Failed to toggle status", "error");
    }
  };

  // Edit
  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      author: blog.author,
      image: null,
      previewUrl: blog.imageUrl
        ? `${API_BASE.replace("/api", "")}/${blog.imageUrl}`
        : null,
      content: blog.content,
      id: blog._id,
    });
    setMainArea(MainArea.EDIT);
    setError("");
    setSuccess("");
  };

  // Preview
  const handlePreview = (blog) => {
    setSelectedBlog(blog);
    setMainArea(MainArea.PREVIEW);
  };

  // --- Modern Excel Table with Toggle Switch ---
  const renderBlogList = () => (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-800">All Blogs</h2>
        <button
          onClick={() => {
            resetForm();
            setMainArea(MainArea.CREATE);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow font-semibold"
        >
          + Add Blog
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full bg-white border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b bg-blue-50 font-semibold">
                Title
              </th>
              <th className="py-3 px-4 border-b bg-blue-50 font-semibold">
                Author
              </th>
              <th className="py-3 px-4 border-b bg-blue-50 font-semibold">
                Image
              </th>
              <th className="py-3 px-4 border-b bg-blue-50 font-semibold">
                Status
              </th>
              <th className="py-3 px-4 border-b bg-blue-50 font-semibold text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr
                key={blog._id}
                className="border-b hover:bg-blue-50 transition"
              >
                <td className="py-2 px-4 border-b">{blog.title}</td>
                <td className="py-2 px-4 border-b">{blog.author}</td>
                <td className="py-2 px-4 border-b">
                  {blog.imageUrl && (
                    <img
                      src={`${API_BASE.replace("/api", "")}/${blog.imageUrl}`}
                      alt="Blog"
                      className="h-10 w-16 object-cover rounded border"
                    />
                  )}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={blog.status === "active"}
                      onChange={() => handleToggleStatus(blog._id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition"></div>
                    <span className="ml-2 font-semibold">{blog.status}</span>
                  </label>
                </td>
                <td className="py-2 px-4 border-b text-center space-x-1">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="p-2 rounded hover:bg-blue-100"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="p-2 rounded hover:bg-red-100"
                    title="Delete"
                  >
                    ❌
                  </button>
                  <button
                    onClick={() => handlePreview(blog)}
                    className="p-2 rounded hover:bg-green-100"
                    title="Preview"
                  >
                    👁️
                  </button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- Blog form (Create or Edit) ---
  const renderBlogForm = () => (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg  space-y-6">
      <h2 className="text-2xl font-bold text-blue-800 mb-2">
        {mainArea === MainArea.EDIT ? "Edit Blog" : "Create Blog"}
      </h2>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Blog Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog title"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Author Name</label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter author name"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Upload Banner Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
          {form.previewUrl && (
            <img
              src={form.previewUrl}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded shadow mt-2"
            />
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Blog Content
          </label>
          <QuillEditor
            value={form.content}
            onChange={(val) => setForm((f) => ({ ...f, content: val }))}
          />
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={formLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
          >
            {formLoading
              ? mainArea === MainArea.EDIT
                ? "Updating..."
                : "Submitting..."
              : mainArea === MainArea.EDIT
              ? "Update Blog"
              : "Submit Blog"}
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setMainArea(MainArea.LIST);
            }}
            className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded shadow"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  // --- Blog Preview (Show HTML) ---
  const renderPreview = () =>
    selectedBlog && (
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
        <button
          onClick={() => setMainArea(MainArea.LIST)}
          className="mb-4 bg-gray-200 text-gray-700 px-4 py-2 rounded"
        >
          ← Back to List
        </button>
        <h2 className="text-4xl font-extrabold mb-2">{selectedBlog.title}</h2>
        <div className="text-lg text-gray-700 mb-4">
          <span className="font-semibold">By: {selectedBlog.author}</span>
        </div>
        {selectedBlog.imageUrl && (
          <img
            src={`${API_BASE.replace("/api", "")}/${selectedBlog.imageUrl}`}
            className="w-full max-h-80 object-cover rounded shadow mb-4"
            alt="Blog Banner"
          />
        )}
        {/* DangerouslySetInnerHTML for Blog Content */}
        <div
          className="prose prose-blue max-w-none"
          style={{
            textAlign: "left",
          }}
          dangerouslySetInnerHTML={{
            __html: selectedBlog.content,
          }}
        />
      </div>
    );

  // --- Main render switch ---
  return (
    <div className="p-4">
      {mainArea === MainArea.LIST && renderBlogList()}
      {(mainArea === MainArea.CREATE || mainArea === MainArea.EDIT) &&
        renderBlogForm()}
      {mainArea === MainArea.PREVIEW && renderPreview()}
    </div>
  );
};

export default BlogComponent;
