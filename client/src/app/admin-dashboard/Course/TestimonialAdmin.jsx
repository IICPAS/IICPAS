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
  });
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/testimonials`
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
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}`
      );
      fetchTestimonials();
      Swal.fire("Deleted!", "Testimonial has been deleted.", "success");
    }
  };

  const handleStatusToggle = async (id, status) => {
    await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}`, {
      status: !status,
    });
    fetchTestimonials();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTestimonial) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${editingTestimonial}`,
        form
      );
    } else {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials`,
        form
      );
    }
    resetForm();
    fetchTestimonials();
    setMode("list");
  };

  const handleEdit = (data) => {
    setForm(data);
    setEditingTestimonial(data._id);
    setMode("edit");
  };

  const resetForm = () => {
    setForm({ name: "", designation: "", message: "" });
    setEditingTestimonial(null);
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
                <TableCell>Name</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testimonials.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.designation}</TableCell>
                  <TableCell>{item.message}</TableCell>
                  <TableCell>
                    {item.status ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-gray-500">Inactive</span>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {hasPermission("edit_testimonial") && (
                      <IconButton onClick={() => handleEdit(item)}>
                        <EditIcon />
                      </IconButton>
                    )}
                    {hasPermission("toggle_testimonial_status") && (
                      <IconButton
                        onClick={() => handleStatusToggle(item._id, item.status)}
                      >
                        {item.status ? <CancelIcon /> : <CheckCircleIcon />}
                      </IconButton>
                    )}
                    {hasPermission("delete_testimonial") && (
                      <IconButton onClick={() => handleDelete(item._id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    )}
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
