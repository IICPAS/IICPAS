import JobsCompany from "../models/jobsCompany.js";

// CREATE job
export const createJob = async (req, res) => {
  try {
    const job = await JobsCompany.create(req.body);
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VIEW all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await JobsCompany.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await JobsCompany.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE job by ID
export const updateJob = async (req, res) => {
  try {
    const job = await JobsCompany.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE job by ID
export const deleteJob = async (req, res) => {
  try {
    const job = await JobsCompany.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
