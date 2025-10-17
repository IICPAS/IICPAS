"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  Modal,
  TextField,
  Alert,
} from "@mui/material";
import axios from "axios";
import { Briefcase, MapPin } from "lucide-react";
import dayjs from "dayjs";

export default function AllJobsWithModalApply() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    resumeLink: "",
  });
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs-external`
      );
      // Filter only active jobs for public display
      const activeJobs = (res.data || []).filter(job => job.status === 'active');
      setJobs(activeJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    }
  };

  const handleOpenModal = (job) => {
    setSelectedJob(job);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedJob(null);
    setForm({ name: "", email: "", phone: "", resumeLink: "" });
    setSubmitted(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/apply/jobs-external`,
        {
          jobId: selectedJob._id,
          ...form,
        }
      );
      setSubmitted(true);
    } catch (err) {
      console.error("Error applying", err);
    }
  };

  return (
    <Box className="bg-[#f9f9f9] pt-24 pl-8 pb-10">
      <Typography
        variant="h5"
        className=" font-bold mb-8 flex items-center gap-2"
      >
        <Briefcase className="text-brown-600" />
        Available Job Openings
      </Typography>

      {jobs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No Job Openings Available
          </h3>
          <p className="text-gray-600 mb-6">
            We don't have any job openings at the moment. Please check back later for new opportunities.
          </p>
          <p className="text-sm text-gray-500">
            You can also follow us on social media to stay updated about new job postings.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                <Briefcase className="inline-block mr-2 text-blue-600" />
                {job.title}
              </h3>

              <p className="text-gray-600 text-sm mb-2">
                <strong>Role:</strong> {job.role}
              </p>

              <p className="text-gray-600 text-sm mb-3">
                {job.jd.slice(0, 100)}...
              </p>

              <p className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4 mr-1" /> {job.location}
              </p>

              <p className="text-sm text-gray-600 mb-2">
                <strong>Salary:</strong> ₹{job.salary}
              </p>

              <p className="text-xs text-gray-400">
                Posted on {dayjs(job.createdAt).format("MMM DD, YYYY")}
              </p>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => handleOpenModal(job)}
              >
                Apply Now
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={handleCloseModal}>
        <Box className="bg-white rounded-xl shadow-2xl w-[90%] max-w-lg mx-auto mt-24 p-6">
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Apply for: {selectedJob?.title}
          </Typography>

          {submitted ? (
            <Alert severity="success">
              Application submitted successfully!
            </Alert>
          ) : (
            <>
              <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Resume Link"
                name="resumeLink"
                value={form.resumeLink}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />

              <div className="flex justify-end gap-3 mt-4">
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
