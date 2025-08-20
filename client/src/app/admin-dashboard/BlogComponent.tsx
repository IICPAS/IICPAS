"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import {
  showDeleteConfirmation,
  showSuccess,
  showError,
} from "@/utils/sweetAlert";
import dynamic from "next/dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";

// Blog interface
interface Blog {
  _id: string;
  title: string;
  author: string;
  content: string;
  imageUrl?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// Form interface
interface BlogForm {
  title: string;
  author: string;
  content: string;
  image: File | null;
  previewUrl: string | null;
}

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

// Jodit editor configuration
const joditConfig = {
  readonly: false,
  height: 400,
  uploader: { insertImageAsBase64URI: true },
  toolbarAdaptive: false,
  showCharsCounter: false,
  showWordsCounter: false,
  spellcheck: true,
  theme: "default",
  placeholder: "Write your blog content here...",
  buttons: [
    "source",
    "|",
    "bold",
    "strikethrough",
    "underline",
    "italic",
    "|",
    "ul",
    "ol",
    "|",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "image",
    "link",
    "table",
    "|",
    "align",
    "undo",
    "redo",
    "|",
    "hr",
    "eraser",
    "copyformat",
    "|",
    "fullsize",
  ],
};

export default function BlogComponent() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("list"); // list, add, edit, preview
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [form, setForm] = useState<BlogForm>({
    title: "",
    author: "",
    content: "",
    image: null,
    previewUrl: null,
  });
  const [formLoading, setFormLoading] = useState(false);
  const { hasPermission } = useAuth();
  const editor = useRef(null);

  // Fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/blogs`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      showError("Error!", "Failed to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Form handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      const file = files[0];
      setForm((prev) => ({
        ...prev,
        image: file,
        previewUrl: URL.createObjectURL(file),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditorChange = (content: string) => {
    setForm((prev) => ({ ...prev, content }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      author: "",
      content: "",
      image: null,
      previewUrl: null,
    });
    setSelectedBlog(null);
    setMode("list");
  };

  const handleAdd = () => {
    resetForm();
    setMode("add");
  };

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setForm({
      title: blog.title || "",
      author: blog.author || "",
      content: blog.content || "",
      image: null,
      previewUrl: blog.imageUrl
        ? `${API_BASE.replace("/api", "")}/${blog.imageUrl}`
        : null,
    });
    setMode("edit");
  };

  const handlePreview = (blog: Blog) => {
    setSelectedBlog(blog);
    setMode("preview");
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showDeleteConfirmation("blog");

    if (confirmed) {
      try {
        await axios.delete(`${API_BASE}/blogs/${id}`);
        fetchBlogs();
        showSuccess("Deleted!", "Blog has been deleted successfully.");
      } catch (error) {
        console.error("Error deleting blog:", error);
        showError("Error!", "Failed to delete blog.");
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await axios.put(`${API_BASE}/blogs/${id}`, { status: newStatus });
      fetchBlogs();
      showSuccess("Status Updated!", `Blog is now ${newStatus}.`);
    } catch (error) {
      console.error("Error toggling status:", error);
      showError("Error!", "Failed to update status.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("content", form.content);
      if (form.image) {
        formData.append("image", form.image);
      }

      if (mode === "edit" && selectedBlog) {
        await axios.put(`${API_BASE}/blogs/${selectedBlog._id}`, formData);
        showSuccess("Updated!", "Blog updated successfully.");
      } else {
        await axios.post(`${API_BASE}/blogs`, formData);
        showSuccess("Created!", "Blog created successfully.");
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
      showError("Error!", "Failed to save blog.");
    } finally {
      setFormLoading(false);
    }
  };

  // Render blog list
  const renderBlogList = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Blogs</h2>
        {hasPermission("blogs", "add") && (
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Blog
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {blog.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {blog.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {blog.imageUrl ? (
                      <img
                        src={`${API_BASE.replace("/api", "")}/${blog.imageUrl}`}
                        alt="Blog"
                        className="h-10 w-16 object-cover rounded border"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(blog._id, blog.status)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        blog.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {blog.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex justify-center gap-2">
                      {hasPermission("blogs", "read") && (
                        <button
                          onClick={() => handlePreview(blog)}
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="Preview"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      )}
                      {hasPermission("blogs", "update") && (
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      )}
                      {hasPermission("blogs", "delete") && (
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No blogs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Render blog form
  const renderBlogForm = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {mode === "edit" ? "Edit Blog" : "Create Blog"}
        </h2>
        <button
          onClick={resetForm}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter blog title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Name *
            </label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleFormChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter author name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {form.previewUrl && (
            <div className="mt-2">
              <img
                src={form.previewUrl}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-md shadow"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blog Content *
          </label>
          <JoditEditor
            ref={editor}
            value={form.content}
            config={joditConfig}
            onBlur={handleEditorChange}
            onChange={handleEditorChange}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={formLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-6 py-2 rounded-md shadow transition-colors"
          >
            {formLoading
              ? mode === "edit"
                ? "Updating..."
                : "Submitting..."
              : mode === "edit"
              ? "Update Blog"
              : "Submit Blog"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-md shadow hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  // Render blog preview
  const renderBlogPreview = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Blog Preview</h2>
        <button
          onClick={() => setMode("list")}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Back to List
        </button>
      </div>

      {selectedBlog && (
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">
            {selectedBlog.title}
          </h1>
          <div className="text-lg text-gray-600">
            <span className="font-semibold">By: {selectedBlog.author}</span>
          </div>
          {selectedBlog.imageUrl && (
            <img
              src={`${API_BASE.replace("/api", "")}/${selectedBlog.imageUrl}`}
              alt="Blog Banner"
              className="w-full max-h-80 object-cover rounded-lg shadow"
            />
          )}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
          />
        </div>
      )}
    </div>
  );

  // Main render
  return (
    <div className="p-6">
      {mode === "list" && renderBlogList()}
      {(mode === "add" || mode === "edit") && renderBlogForm()}
      {mode === "preview" && renderBlogPreview()}
    </div>
  );
}
