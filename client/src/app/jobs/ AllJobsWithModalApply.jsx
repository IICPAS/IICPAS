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
      // Fetch both internal and external jobs
      const [internalJobsRes, externalJobsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs-internal`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs-external`)
      ]);
      
      // Combine both job types and normalize field names
      const internalJobs = (internalJobsRes.data || []).map(job => ({
        ...job,
        role: job.type || job.role,
        jd: job.description || job.jd,
        salary: job.salary || "0", // Ensure salary field exists
        source: 'internal',
        postedBy: 'IICPA Institute'
      }));
      
      const externalJobs = (externalJobsRes.data || []).map(job => ({
        ...job,
        source: 'external',
        postedBy: 'IICPA Institute' // Always show IICPA Institute for consistency
      }));
      
      // Combine all jobs and filter only active ones for public display
      const allJobs = [...internalJobs, ...externalJobs];
      const activeJobs = allJobs.filter(job => 
        job.status === 'active' || job.status === undefined
      );
      
      setJobs(activeJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      // Fallback to external jobs only
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs-external`);
        const activeJobs = (res.data || []).filter(job => job.status === 'active');
        setJobs(activeJobs);
      } catch (fallbackError) {
        console.error("Error fetching external jobs:", fallbackError);
        setJobs([]);
      }
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
      console.log("Submitting application for job:", selectedJob);
      console.log("Form data:", form);
      
      // Use appropriate endpoint based on job source
      const endpoint = selectedJob.source === 'internal' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/jobs-internal/${selectedJob._id}/applications`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/apply/jobs-external`;
      
      const applicationData = {
        jobId: selectedJob._id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        resumeLink: form.resumeLink,
        // Add company email from the job data
        companyEmail: selectedJob.email || 'admin@iicpa.com'
      };
      
      console.log("Sending application data:", applicationData);
      console.log("To endpoint:", endpoint);
      
      const response = await axios.post(endpoint, applicationData);
      console.log("Application response:", response.data);
      
      setSubmitted(true);
    } catch (err) {
      console.error("Error applying", err);
      console.error("Error details:", err.response?.data);
      alert("Failed to submit application. Please try again.");
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
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  <Briefcase className="inline-block mr-2 text-blue-600" />
                  {job.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  job.source === 'internal' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {job.postedBy}
                </span>
              </div>

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
