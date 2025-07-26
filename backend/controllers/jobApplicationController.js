import JobApplication from "../models/JobApplications.js";

// CREATE application
export const applyToJob = async (req, res) => {
  try {
    const application = await JobApplication.create(req.body);
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VIEW all applications
export const getAllApplications = async (req, res) => {
  try {
    const apps = await JobApplication.find()
      .populate("jobId")
      .populate("studentId");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET application by ID
export const getApplicationById = async (req, res) => {
  try {
    const app = await JobApplication.findById(req.params.id)
      .populate("jobId")
      .populate("studentId");
    if (!app) return res.status(404).json({ message: "Application not found" });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE application by ID
export const updateApplication = async (req, res) => {
  try {
    const app = await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!app) return res.status(404).json({ message: "Application not found" });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE application by ID
export const deleteApplication = async (req, res) => {
  try {
    const app = await JobApplication.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
