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
  Typography,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function JobsAdminPanel() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [mode, setMode] = useState("list");
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "",
    location: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await axios.get(`${API_BASE}/jobs-internal`);
    setJobs(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API_BASE}/jobs-internal/${editId}`, form);
    } else {
      await axios.post(`${API_BASE}/jobs-internal`, form);
    }
    resetForm();
    fetchJobs();
    setMode("list");
  };

  const resetForm = () => {
    setForm({ title: "", type: "", location: "", description: "" });
    setEditId(null);
  };

  const handleDelete = async (jobId) => {
    const confirm = await Swal.fire({
      title: "Delete job?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (confirm.isConfirmed) {
      await axios.delete(`${API_BASE}/jobs-internal/${jobId}`);
      fetchJobs();
      Swal.fire("Deleted!", "The job has been removed.", "success");
    }
  };

  const handleDeleteApplication = async (applicant) => {
    const confirm = await Swal.fire({
      title: `Delete application for ${applicant.name}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (confirm.isConfirmed) {
      await axios.delete(
        `${API_BASE}/jobs-internal/applications/${applicant._id}`
      );
      fetchApplications(selectedJob);
      Swal.fire("Deleted!", "The application has been removed.", "success");
    }
  };

  // Utility to refresh applications
  const fetchApplications = async (job) => {
    const res = await axios.get(
      `${API_BASE}/jobs-internal/${job._id}/applications`
    );
    setApplications(res.data);
  };

  const handleEdit = (job) => {
    setForm(job);
    setEditId(job._id);
    setMode("edit");
  };

  const viewApplications = async (job) => {
    setSelectedJob(job);
    const res = await axios.get(
      `${API_BASE}/jobs-internal/${job._id}/applications`
    );
    setApplications(res.data);
    setMode("applications");
  };

  const handleShortlist = async (applicant) => {
    const confirm = await Swal.fire({
      title: `Shortlist ${applicant.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, shortlist",
    });

    if (confirm.isConfirmed) {
      await axios.post(
        `${API_BASE}/jobs-internal/applications/${applicant._id}/shortlist`
      );
      fetchApplications(selectedJob); // Refresh the list
      Swal.fire(
        "Shortlisted!",
        `${applicant.name} has been shortlisted.`,
        "success"
      );
    }
  };

  const exportToExcel = () => {
    const data = applications.map((a) => ({
      Name: a.name,
      Email: a.email,
      Phone: a.phone,
      Status: a.shortlisted ? "Shortlisted" : "Pending",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applications");
    XLSX.writeFile(wb, `${selectedJob.title}_applications.xlsx`);
  };

  return (
    <div className="p-6">
      {mode === "list" && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Jobs</h2>
            {hasPermission("jobs", "add") && (
              <Button variant="contained" onClick={() => setMode("add")}>
                Add Job
              </Button>
            )}
          </div>

          <Table className="bg-white shadow rounded-md w-full">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell align="center">
                    {hasPermission("edit_job") && (
                      <IconButton onClick={() => handleEdit(job)}>
                        <EditIcon />
                      </IconButton>
                    )}
                    {hasPermission("delete_job") && (
                      <IconButton onClick={() => handleDelete(job._id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    )}
                    <IconButton onClick={() => viewApplications(job)}>
                      <VisibilityIcon />
                    </IconButton>
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
          className="bg-white p-6 rounded  w-full max-w-6xl mx-auto"
        >
          <h2 className="text-xl font-semibold mb-6">
            {mode === "add" ? "Add New Job" : "Edit Job"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Job Title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Job Type"
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              fullWidth
            />
            <TextField
              label="Location"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              fullWidth
            />
          </div>

          <div className="mt-6">
            <TextField
              label="Job Description"
              required
              multiline
              rows={4}
              fullWidth
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="submit" variant="contained">
              {mode === "edit" ? "Update" : "Submit"}
            </Button>
            <Button variant="outlined" onClick={() => setMode("list")}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {mode === "applications" && (
        <div className="bg-white rounded shadow p-6 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Applications for: {selectedJob.title}
            </h2>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportToExcel}
            >
              Export to Excel
            </Button>
          </div>

          <Table className="bg-white">
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Shortlisted</TableCell>
                <TableCell>Resume</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((applicant) => (
                <TableRow key={applicant._id}>
                  <TableCell>{applicant.name}</TableCell>
                  <TableCell>{applicant.email}</TableCell>
                  <TableCell>{applicant.phone}</TableCell>
                  <TableCell>
                    <a href={applicant.resumeLink} target="_blank">
                      View Resume
                    </a>
                  </TableCell>
                  <TableCell>
                    {applicant.shortlisted ? "Shortlisted" : "Pending"}
                  </TableCell>
                  <TableCell>
                    {!applicant.shortlisted && (
                      <IconButton
                        color="primary"
                        onClick={() => handleShortlist(applicant)}
                      >
                        <CheckIcon />
                      </IconButton>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteApplication(applicant)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end mt-4">
            <Button variant="outlined" onClick={() => setMode("list")}>
              Back to Jobs
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
