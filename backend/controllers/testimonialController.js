import Testimonial from "../models/Testimonials.js";

// Submit a new testimonial
export const submitTestimonial = async (req, res) => {
  try {
    const { name, designation, message, image } = req.body;
    const studentId = req.user.id;

    const testimonial = new Testimonial({
      name,
      designation,
      message,
      image,
      studentId,
      status: false, // Pending approval
    });

    await testimonial.save();
    res.status(201).json({ message: "Testimonial submitted successfully", testimonial });
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    res.status(500).json({ error: "Failed to submit testimonial" });
  }
};

// Get testimonials submitted by a specific student
export const getStudentTestimonials = async (req, res) => {
  try {
    const studentId = req.user.id;
    const testimonials = await Testimonial.find({ studentId }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching student testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
};

// Get all testimonials (admin only)
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching all testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
};

// Get approved testimonials for public display
export const getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching approved testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
};

// Approve a testimonial (admin only)
export const approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { status: true },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.json({ message: "Testimonial approved successfully", testimonial });
  } catch (error) {
    console.error("Error approving testimonial:", error);
    res.status(500).json({ error: "Failed to approve testimonial" });
  }
};

// Reject a testimonial (admin only)
export const rejectTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.json({ message: "Testimonial rejected successfully", testimonial });
  } catch (error) {
    console.error("Error rejecting testimonial:", error);
    res.status(500).json({ error: "Failed to reject testimonial" });
  }
};

// Toggle featured status (admin only)
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    testimonial.featured = !testimonial.featured;
    await testimonial.save();

    res.json({ message: "Featured status toggled successfully", testimonial });
  } catch (error) {
    console.error("Error toggling featured status:", error);
    res.status(500).json({ error: "Failed to toggle featured status" });
  }
};

// Delete a testimonial (admin only)
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
};

// Get testimonial statistics (admin only)
export const getTestimonialStats = async (req, res) => {
  try {
    const total = await Testimonial.countDocuments();
    const approved = await Testimonial.countDocuments({ status: true });
    const pending = await Testimonial.countDocuments({ status: false });
    const featured = await Testimonial.countDocuments({ featured: true });

    res.json({
      total,
      approved,
      pending,
      featured,
    });
  } catch (error) {
    console.error("Error fetching testimonial stats:", error);
    res.status(500).json({ error: "Failed to fetch testimonial statistics" });
  }
};
