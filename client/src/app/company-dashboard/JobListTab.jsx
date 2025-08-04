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
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  Fade,
  Slide,
  Container,
  Stack,
  Badge,
  Tooltip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
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

const JobManagerTab = ({ companyEmail }) => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyJob);
  const [loading, setLoading] = useState(false);
  const [mainTab, setMainTab] = useState("list");
  const [editJobId, setEditJobId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (mainTab === "list" && companyEmail) fetchJobs();
    // eslint-disable-next-line
  }, [mainTab, companyEmail]);

  const fetchJobs = async () => {
    try {
      console.log("Fetching jobs for email:", companyEmail);
      const res = await axios.get(
        `${API}/api/jobs-external?email=${companyEmail}`
      );
      console.log("Jobs response:", res.data);
      setJobs(res.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    }
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mainTab === "add") {
        const jobData = { ...form, email: companyEmail };
        console.log("Creating job with data:", jobData);
        await axios.post(`${API}/api/jobs-external`, jobData);
        toast.success("Job posted successfully! 🎉");
      } else if (mainTab === "edit" && editJobId) {
        const jobData = { ...form, email: companyEmail };
        console.log("Updating job with data:", jobData);
        await axios.put(`${API}/api/jobs-external/${editJobId}`, jobData);
        toast.success("Job updated successfully! ✨");
      }
      setForm(emptyJob);
      setMainTab("list");
      setOpenDialog(false);
      fetchJobs();
    } catch (error) {
      console.error("Error submitting job:", error);
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
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Delete Job?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#757575",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "modern-swal",
      },
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API}/api/jobs-external/${id}`);
        toast.success("Job deleted successfully! 🗑️");
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

  const handleAddJob = () => {
    setMainTab("add");
    setForm(emptyJob);
    setEditJobId(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setForm(emptyJob);
    setEditJobId(null);
  };

  const renderJobForm = () => (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
      TransitionComponent={Slide}
      transitionDuration={300}
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "white",
          boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 0,
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 3,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(90deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)",
          },
        }}
      >
        <Avatar
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            width: 40,
            height: 40,
          }}
        >
          <WorkIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {mainTab === "add" ? "Post New Job" : "Edit Job"}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {mainTab === "add"
              ? "Create a new job opportunity"
              : "Update job details"}
          </Typography>
        </Box>
        <IconButton
          onClick={handleCloseDialog}
          sx={{
            color: "white",
            ml: "auto",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 4, background: "#fafbfc", mt: 5 }}>
        <Box component="form" onSubmit={handleSubmitJob}>
          <Grid container spacing={3} sx={{ maxWidth: "100%" }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "#374151", fontWeight: 600 }}
                >
                  Job Title *
                </Typography>
                <TextField
                  fullWidth
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  variant="outlined"
                  placeholder="e.g. Senior Frontend Developer"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      background: "white",
                      height: "56px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 4px 16px rgba(102, 126, 234, 0.25)",
                      },
                      "& fieldset": {
                        borderColor: "#e1e5e9",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                        borderWidth: "2px",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: "16px 20px",
                      fontSize: "16px",
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "#374151", fontWeight: 600 }}
                >
                  Role *
                </Typography>
                <TextField
                  fullWidth
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                  variant="outlined"
                  placeholder="e.g. Frontend Developer"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      background: "white",
                      height: "56px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 4px 16px rgba(102, 126, 234, 0.25)",
                      },
                      "& fieldset": {
                        borderColor: "#e1e5e9",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                        borderWidth: "2px",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: "16px 20px",
                      fontSize: "16px",
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "#374151", fontWeight: 600 }}
                >
                  Location *
                </Typography>
                <TextField
                  fullWidth
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  required
                  variant="outlined"
                  placeholder="e.g. Remote, Mumbai, Delhi"
                  InputProps={{
                    startAdornment: (
                      <LocationIcon sx={{ mr: 1, color: "#667eea", ml: 1 }} />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      background: "white",
                      height: "56px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 4px 16px rgba(102, 126, 234, 0.25)",
                      },
                      "& fieldset": {
                        borderColor: "#e1e5e9",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                        borderWidth: "2px",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: "16px 20px",
                      fontSize: "16px",
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "#374151", fontWeight: 600 }}
                >
                  Salary (₹) *
                </Typography>
                <TextField
                  fullWidth
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  required
                  type="number"
                  variant="outlined"
                  placeholder="e.g. 50000"
                  InputProps={{
                    startAdornment: (
                      <MoneyIcon sx={{ mr: 1, color: "#667eea", ml: 1 }} />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      background: "white",
                      height: "56px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 4px 16px rgba(102, 126, 234, 0.25)",
                      },
                      "& fieldset": {
                        borderColor: "#e1e5e9",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                        borderWidth: "2px",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: "16px 20px",
                      fontSize: "16px",
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "#374151", fontWeight: 600 }}
                >
                  Job Description *
                </Typography>
                <TextField
                  fullWidth
                  value={form.jd}
                  onChange={(e) => setForm({ ...form, jd: e.target.value })}
                  required
                  multiline
                  minRows={4}
                  variant="outlined"
                  placeholder="Describe the job responsibilities, requirements, and benefits..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      background: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 4px 16px rgba(102, 126, 234, 0.25)",
                      },
                      "& fieldset": {
                        borderColor: "#e1e5e9",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                        borderWidth: "2px",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: "16px 20px",
                      fontSize: "16px",
                      lineHeight: "1.5",
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{ p: 4, background: "#f8fafc", borderTop: "1px solid #e1e5e9" }}
      >
        <Button
          onClick={handleCloseDialog}
          variant="outlined"
          startIcon={<CancelIcon />}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#cbd5e1",
            color: "#64748b",
            px: 3,
            py: 1.5,
            "&:hover": {
              borderColor: "#94a3b8",
              background: "#f1f5f9",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmitJob}
          variant="contained"
          startIcon={loading ? <LinearProgress /> : <SaveIcon />}
          disabled={loading}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1.5,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              background: "#cbd5e1",
              boxShadow: "none",
              transform: "none",
            },
          }}
        >
          {loading
            ? "Saving..."
            : mainTab === "add"
            ? "Post Job"
            : "Update Job"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderApplicationsView = () => (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                width: 56,
                height: 56,
              }}
            >
              <GroupIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Applications for {selectedJob?.title}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Manage and review job applications
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Button
        variant="outlined"
        onClick={() => setMainTab("list")}
        startIcon={<CloseIcon />}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          mb: 3,
        }}
      >
        Back to Jobs
      </Button>

      <Card elevation={0} sx={{ borderRadius: 3, p: 4 }}>
        <Typography variant="h6" color="text.secondary" textAlign="center">
          Applications list will be implemented here
        </Typography>
      </Card>
    </Container>
  );

  const renderJobsList = () => (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: "white",
        }}
      >
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Job Management
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Create, manage, and track your job postings
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} textAlign="right">
            <Fab
              color="primary"
              onClick={handleAddJob}
              sx={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                "&:hover": {
                  background: "rgba(255,255,255,0.3)",
                },
              }}
            >
              <AddIcon />
            </Fab>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              p: 3,
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.3)",
                  color: "white",
                }}
              >
                <WorkIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700} color="white">
                  {jobs.length}
                </Typography>
                <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                  Total Jobs
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              p: 3,
              boxShadow: "0 8px 32px rgba(240, 147, 251, 0.3)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.3)",
                  color: "white",
                }}
              >
                <TrendingIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700} color="white">
                  {jobs.filter((job) => job.status === "active").length}
                </Typography>
                <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                  Active Jobs
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              p: 3,
              boxShadow: "0 8px 32px rgba(79, 172, 254, 0.3)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.3)",
                  color: "white",
                }}
              >
                <GroupIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700} color="white">
                  0
                </Typography>
                <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                  Applications
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              p: 3,
              boxShadow: "0 8px 32px rgba(67, 233, 123, 0.3)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.3)",
                  color: "white",
                }}
              >
                <BusinessIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700} color="white">
                  {jobs.filter((job) => job.location === "Remote").length}
                </Typography>
                <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                  Remote Jobs
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Jobs Table */}
      <Card elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            p: 3,
            borderBottom: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Job Postings
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "rgba(102, 126, 234, 0.05)" }}>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "text.primary",
                    borderBottom: "2px solid rgba(102, 126, 234, 0.2)",
                  }}
                >
                  Job Title
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "text.primary",
                    borderBottom: "2px solid rgba(102, 126, 234, 0.2)",
                  }}
                >
                  Role
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "text.primary",
                    borderBottom: "2px solid rgba(102, 126, 234, 0.2)",
                  }}
                >
                  Location
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "text.primary",
                    borderBottom: "2px solid rgba(102, 126, 234, 0.2)",
                  }}
                >
                  Salary
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "text.primary",
                    borderBottom: "2px solid rgba(102, 126, 234, 0.2)",
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
                      py: 8,
                      color: "text.secondary",
                    }}
                  >
                    <Stack alignItems="center" spacing={2}>
                      <WorkIcon sx={{ fontSize: 64, opacity: 0.3 }} />
                      <Typography variant="h6" color="text.secondary">
                        No jobs posted yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Start by posting your first job opportunity
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={handleAddJob}
                        startIcon={<AddIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        }}
                      >
                        Post Your First Job
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job, index) => (
                  <TableRow
                    key={job._id}
                    hover
                    sx={{
                      "&:hover": {
                        background: "rgba(102, 126, 234, 0.02)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <TableCell sx={{ py: 3 }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {job.title}
                        </Typography>
                        <Chip
                          label="Active"
                          size="small"
                          sx={{
                            background:
                              "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                            color: "white",
                            fontWeight: 600,
                          }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        {job.role}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body1" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color="text.primary"
                        >
                          ₹{job.salary?.replace(/[^\d]/g, "")?.toLocaleString()}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 3, textAlign: "center" }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Edit Job">
                          <IconButton
                            onClick={() => handleEdit(job)}
                            sx={{
                              color: "#667eea",
                              "&:hover": {
                                background: "rgba(102, 126, 234, 0.1)",
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Applications">
                          <IconButton
                            onClick={() => handleViewApplications(job)}
                            sx={{
                              color: "#4caf50",
                              "&:hover": {
                                background: "rgba(76, 175, 80, 0.1)",
                              },
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Job">
                          <IconButton
                            onClick={() => handleDelete(job._id)}
                            sx={{
                              color: "#f44336",
                              "&:hover": {
                                background: "rgba(244, 67, 54, 0.1)",
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );

  return (
    <Box sx={{ minHeight: "100vh", background: "#f8fafc" }}>
      {mainTab === "applications" ? renderApplicationsView() : renderJobsList()}
      {renderJobForm()}
    </Box>
  );
};

export default JobManagerTab;
