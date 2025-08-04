import JobsCompany from "../models/jobsCompany.js";

// CREATE job
export const createJob = async (req, res) => {
  try {
    console.log("Creating job with data:", req.body);
    const job = await JobsCompany.create(req.body);
    console.log("Job created successfully:", job);
    res.json(job);
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({ error: err.message });
  }
};

// VIEW all jobs by email
export const getAllJobs = async (req, res) => {
  try {
    const { email } = req.query;
    console.log("getAllJobs called with email:", email);

    let jobs;

    if (email) {
      // Filter jobs by company email
      console.log("Filtering jobs by email:", email);
      jobs = await JobsCompany.find({ email: email });
      console.log("Found jobs with email filter:", jobs.length);
    } else {
      // Get all jobs (for admin purposes)
      console.log("Getting all jobs (no email filter)");
      jobs = await JobsCompany.find();
      console.log("Found all jobs:", jobs.length);
    }

    console.log("Sending jobs response:", jobs);
    res.json(jobs);
  } catch (err) {
    console.error("Error in getAllJobs:", err);
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
