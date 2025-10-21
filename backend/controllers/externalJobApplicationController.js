import ExternalJobApplication from "../models/ExternalJobApplication.js";
import JobsCompany from "../models/jobsCompany.js";
import Job from "../models/Job.js";

// CREATE external job application
export const applyToExternalJob = async (req, res) => {
  try {
    const { jobId, name, email, phone, resumeLink, companyEmail } = req.body;
    
    console.log("Received application data:", req.body);
    
    // Try to find the job in both collections
    let job = await JobsCompany.findById(jobId);
    let jobSource = 'external';
    
    if (!job) {
      job = await Job.findById(jobId);
      jobSource = 'internal';
    }
    
    if (!job) {
      console.error("Job not found in either collection:", jobId);
      return res.status(404).json({ error: "Job not found" });
    }

    console.log("Found job:", job.title, "Source:", jobSource);
    console.log("Job email:", job.email);

    // Use provided companyEmail or fallback to job email or default
    const finalCompanyEmail = companyEmail || job.email || 'admin@iicpa.com';
    
    console.log("Final company email:", finalCompanyEmail);

    const application = await ExternalJobApplication.create({
      jobId,
      name,
      email,
      phone,
      resumeLink,
      companyEmail: finalCompanyEmail,
    });
    
    console.log("Application created successfully:", application);
    res.json(application);
  } catch (err) {
    console.error("Error creating external job application:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET all external job applications
export const getAllExternalApplications = async (req, res) => {
  try {
    const applications = await ExternalJobApplication.find()
      .populate("jobId")
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error("Error fetching external applications:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET applications by company email
export const getApplicationsByCompany = async (req, res) => {
  try {
    const { companyEmail } = req.params;
    const applications = await ExternalJobApplication.find({ companyEmail })
      .populate("jobId")
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error("Error fetching company applications:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const application = await ExternalJobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("jobId");
    
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    res.json(application);
  } catch (err) {
    console.error("Error updating application status:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE application
export const deleteExternalApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await ExternalJobApplication.findByIdAndDelete(id);
    
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error("Error deleting application:", err);
    res.status(500).json({ error: err.message });
  }
};
