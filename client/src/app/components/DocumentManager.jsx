"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUpload, FiFile, FiTrash2, FiDownload } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

export default function DocumentManager({ email }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (email) {
      fetchDocument();
    } else {
      setFetching(false);
    }
  }, [email]);

  const fetchDocument = async () => {
    try {
      const response = await axios.post(`${API}/v1/individual/document`, {
        email: email,
      });
      setUploadedDocument(response.data.document);
    } catch (err) {
      if (err.response?.status !== 404) {
        toast.error("Failed to fetch document");
      }
    } finally {
      setFetching(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.toLowerCase().endsWith(".docx")
      ) {
        setSelectedFile(file);
        toast.success("Document selected successfully!");
      } else {
        toast.error("Please select a .docx file only!");
        e.target.value = null;
      }
    }
  };

  const handleDocumentUpload = async () => {
    if (!selectedFile) {
      return toast.error("Please select a document first!");
    }

    if (!email) {
      return toast.error("Email is required!");
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("document", selectedFile);
    formData.append("email", email);

    try {
      const response = await axios.post(
        `${API}/v1/individual/upload-document`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadedDocument(response.data.document);
      setSelectedFile(null);
      toast.success("Document uploaded successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Upload failed");
    }
    setLoading(false);
  };

  const handleDocumentDelete = async () => {
    if (!email) {
      return toast.error("Email is required!");
    }

    setLoading(true);
    try {
      await axios.delete(`${API}/v1/individual/document`, {
        data: { email: email },
      });
      setUploadedDocument(null);
      toast.success("Document deleted successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Delete failed");
    }
    setLoading(false);
  };

  const handleDocumentDownload = () => {
    if (uploadedDocument) {
      const link = document.createElement("a");
      link.href = `${API}/${uploadedDocument}`;
      link.download = uploadedDocument.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!email) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Document Management
        </h3>
        <p className="text-gray-500">Email is required to manage documents.</p>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Document Management
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Managing documents for: {email}
      </p>

      {!uploadedDocument ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  DOCX files only (MAX. 5MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".docx"
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <FiFile className="text-green-600" />
                <span className="text-sm text-gray-700">
                  {selectedFile.name}
                </span>
              </div>
              <button
                onClick={handleDocumentUpload}
                disabled={loading}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FiFile className="text-green-600 text-xl" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Document uploaded
                </p>
                <p className="text-xs text-gray-500">
                  {uploadedDocument.split("/").pop()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDocumentDownload}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                title="Download document"
              >
                <FiDownload />
              </button>
              <button
                onClick={handleDocumentDelete}
                disabled={loading}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded disabled:opacity-50"
                title="Delete document"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setUploadedDocument(null)}
              className="text-sm text-green-600 hover:text-green-800 hover:underline"
            >
              Upload new document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
