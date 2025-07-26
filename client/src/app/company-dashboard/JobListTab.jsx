"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  TextField,
  Grid,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const emptyJob = {
  title: "",
  role: "",
  location: "",
  salary: "",
  jd: "",
};

const JobManagerTab = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyJob);
  const [loading, setLoading] = useState(false);
  const [mainTab, setMainTab] = useState("list");
  const [editJobId, setEditJobId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    if (mainTab === "list") fetchJobs();
    // eslint-disable-next-line
  }, [mainTab]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/api/jobs-external`);
      setJobs(res.data || []);
    } catch {
      toast.error("Failed to load jobs");
    }
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mainTab === "add") {
        await axios.post(`${API}/api/jobs-external`, form);
        toast.success("Job posted!");
      } else if (mainTab === "edit" && editJobId) {
        await axios.put(`${API}/api/jobs-external/${editJobId}`, form);
        toast.success("Job updated!");
      }
      setForm(emptyJob);
      setMainTab("list");
      fetchJobs();
    } catch {
      toast.error("Operation failed");
    }
    setLoading(false);
  };

  const handleEdit = (job) => {
    setForm({
      title: job.title,
      role: job.role,
      location: job.location,
      salary: job.salary,
      jd: job.jd,
    });
    setEditJobId(job._id);
    setMainTab("edit");
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This job will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API}/api/jobs-external/${id}`);
        toast.success("Job deleted");
        fetchJobs();
      } catch {
        toast.error("Delete failed");
      }
    }
  };

  const handleViewApplications = (job) => {
    setSelectedJob(job);
    setMainTab("applications");
  };

  const renderMainContent = () => {
    if (mainTab === "add" || mainTab === "edit")
      return (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 6,
            maxWidth: 1100,
            mx: "auto",
            border: "1px solid #bdbdbd",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            {mainTab === "add" ? "Add Job" : "Edit Job"}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmitJob}
            sx={{ width: "100%" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label="Salary"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  required
                  variant="outlined"
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Description"
                  value={form.jd}
                  onChange={(e) => setForm({ ...form, jd: e.target.value })}
                  required
                  multiline
                  minRows={3}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : mainTab === "add"
                  ? "Post Job"
                  : "Update Job"}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  setMainTab("list");
                  setForm(emptyJob);
                  setEditJobId(null);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      );
    if (mainTab === "applications")
      return (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 6,
            maxWidth: 1100,
            mx: "auto",
            border: "1px solid #bdbdbd",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <GroupIcon color="primary" /> Applications for{" "}
            <span style={{ fontWeight: 600, marginLeft: 4 }}>
              {selectedJob?.title}
            </span>
          </Typography>
          <Button sx={{ mb: 3 }} onClick={() => setMainTab("list")}>
            ← Back to Jobs
          </Button>
          <Box sx={{ color: "gray" }}>[Applications list placeholder]</Box>
        </Paper>
      );
    // Excel-like Table
    return (
      <TableContainer
        component={Paper}
        sx={{ mt: 7, maxWidth: 1100, mx: "auto", border: "1px solid #bdbdbd" }}
      >
        <Table sx={{ minWidth: 700, borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f4f4f4" }}>
              <TableCell
                sx={{
                  border: "1px solid #bdbdbd",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                Title
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #bdbdbd",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                Role
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #bdbdbd",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                Location
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #bdbdbd",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                Salary
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #bdbdbd",
                  fontWeight: 700,
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{
                    textAlign: "center",
                    fontSize: 18,
                    color: "#999",
                    border: "1px solid #bdbdbd",
                    py: 2,
                  }}
                >
                  No jobs posted yet.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow
                  key={job._id}
                  hover
                  sx={{
                    borderBottom: "2px solid #bdbdbd",
                    "&:last-child td, &:last-child th": { borderBottom: 0 },
                  }}
                >
                  <TableCell sx={{ border: "1px solid #bdbdbd", fontSize: 17 }}>
                    {job.title}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #bdbdbd", fontSize: 17 }}>
                    {job.role}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #bdbdbd", fontSize: 17 }}>
                    {job.location}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #bdbdbd", fontSize: 17 }}>
                    {job.salary}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #bdbdbd", textAlign: "center" }}
                  >
                    <IconButton color="primary" onClick={() => handleEdit(job)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(job._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      color="success"
                      onClick={() => handleViewApplications(job)}
                    >
                      <GroupIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: "green" }}>
          Jobs
        </Typography>
        {mainTab === "list" && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            size="large"
            onClick={() => setMainTab("add")}
            sx={{ fontWeight: 600 }}
          >
            Add Job
          </Button>
        )}
      </Box>
      {renderMainContent()}
    </Box>
  );
};

export default JobManagerTab;
