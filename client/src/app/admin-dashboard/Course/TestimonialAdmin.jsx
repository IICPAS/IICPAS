"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function TestimonialAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [mode, setMode] = useState("list");
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [form, setForm] = useState({
    name: "",
    designation: "",
    message: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(
      `${API_BASE}/testimonials`,
      { 
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    setTestimonials(res.data);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This testimonial will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `${API_BASE}/testimonials/${id}`,
        { 
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      fetchTestimonials();
      Swal.fire("Deleted!", "Testimonial has been deleted.", "success");
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(`${API_BASE}/testimonials/approve/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      fetchTestimonials();
      Swal.fire("Approved!", "Testimonial has been approved.", "success");
    } catch (error) {
      console.error("Error approving testimonial:", error);
      Swal.fire("Error!", "Failed to approve testimonial", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(`${API_BASE}/testimonials/reject/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      fetchTestimonials();
      Swal.fire("Rejected!", "Testimonial has been rejected.", "success");
    } catch (error) {
      console.error("Error rejecting testimonial:", error);
      Swal.fire("Error!", "Failed to reject testimonial", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('designation', form.designation);
      formData.append('message', form.message);
      
      if (form.image) {
        formData.append('image', form.image);
      }

      const token = localStorage.getItem("adminToken");
      
      if (editingTestimonial) {
        await axios.put(
          `${API_BASE}/testimonials/${editingTestimonial}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        await axios.post(
          `${API_BASE}/testimonials`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }
      
      resetForm();
      fetchTestimonials();
      setMode("list");
      Swal.fire("Success!", "Testimonial saved successfully!", "success");
    } catch (error) {
      console.error("Error saving testimonial:", error);
      Swal.fire("Error!", "Failed to save testimonial", "error");
    }
  };

  const handleEdit = (data) => {
    setForm({
      name: data.name,
      designation: data.designation,
      message: data.message,
      image: null, // Don't pre-populate image for editing
    });
    setImagePreview(data.image ? `${API_BASE.replace('/api', '')}/${data.image}` : null);
    setEditingTestimonial(data._id);
    setMode("edit");
  };

  const resetForm = () => {
    setForm({ name: "", designation: "", message: "", image: null });
    setImagePreview(null);
    setEditingTestimonial(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setForm({ ...form, image: null });
    setImagePreview(null);
  };

  return (
    <div className="p-6">
      {mode === "list" && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Testimonials</h2>
            {hasPermission("testimonials", "add") && (
              <Button variant="contained" onClick={() => setMode("add")}>
                Add Testimonial
              </Button>
            )}
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testimonials.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {item.image ? (
                      <img
                        src={`${API_BASE.replace('/api', '')}/${item.image}`}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-xs">
                          {item.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.designation}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.message}</TableCell>
                  <TableCell>
                    {item.status ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <CancelIcon className="w-3 h-3 mr-1" />
                        Pending
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex items-center justify-center space-x-1">
                      {!item.status && (
                        <>
                          <IconButton
                            onClick={() => handleApprove(item._id)}
                            className="text-green-600 hover:bg-green-50"
                            title="Approve"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleReject(item._id)}
                            className="text-red-600 hover:bg-red-50"
                            title="Reject"
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      )}
                      {hasPermission("edit_testimonial") && (
                        <IconButton onClick={() => handleEdit(item)}>
                          <EditIcon />
                        </IconButton>
                      )}
                      {hasPermission("delete_testimonial") && (
                        <IconButton onClick={() => handleDelete(item._id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {(mode === "add" || mode === "edit") && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-6 max-w-full"
        >
          <h2 className="text-xl font-semibold mb-6">
            {mode === "add" ? "Add New" : "Edit"} Testimonial
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Name"
              required
              fullWidth
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <TextField
              label="Designation"
              required
              fullWidth
              value={form.designation}
              onChange={(e) =>
                setForm({ ...form, designation: e.target.value })
              }
            />
          </div>

          <div className="mt-6">
            <TextField
              label="Message"
              multiline
              rows={4}
              required
              fullWidth
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
            />
          </div>

          {/* Image Upload Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image (Optional)
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-full mb-4"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeImage();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-600 mb-2">Click to upload image</p>
                    <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="submit" variant="contained" color="primary">
              {mode === "edit" ? "Update" : "Submit"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                resetForm();
                setMode("list");
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
