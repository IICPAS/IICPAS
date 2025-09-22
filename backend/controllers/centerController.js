import Center from "../models/Center.js";
import Course from "../models/Content/Course.js";
import mongoose from "mongoose";

// Get all centers
export const getAllCenters = async (req, res) => {
  try {
    const { status, city, state, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (city) filter.city = new RegExp(city, 'i');
    if (state) filter.state = new RegExp(state, 'i');

    const centers = await Center.find(filter)
      .populate('courses', 'title category price')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Center.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: centers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total
      }
    });
  } catch (error) {
    console.error("Error fetching centers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch centers",
      error: error.message
    });
  }
};

// Get center by ID
export const getCenterById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const center = await Center.findById(id)
      .populate('courses', 'title category price description')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!center) {
      return res.status(404).json({
        success: false,
        message: "Center not found"
      });
    }

    res.status(200).json({
      success: true,
      data: center
    });
  } catch (error) {
    console.error("Error fetching center:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch center",
      error: error.message
    });
  }
};

// Create new center
export const createCenter = async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      manager,
      facilities,
      courses,
      capacity,
      coordinates,
      images,
      description,
      timings
    } = req.body;

    // Check if center with same name already exists
    const existingCenter = await Center.findOne({ 
      name: new RegExp(`^${name}$`, 'i'),
      city: new RegExp(`^${city}$`, 'i')
    });

    if (existingCenter) {
      return res.status(400).json({
        success: false,
        message: "Center with this name already exists in this city"
      });
    }

    const newCenter = new Center({
      name,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      manager,
      facilities: facilities || [],
      courses: courses || [],
      capacity: capacity || 50,
      coordinates: coordinates || {},
      images: images || [],
      description,
      timings: timings || {},
      createdBy: req.user?.id || new mongoose.Types.ObjectId(),
      status: "active"
    });

    await newCenter.save();

    // Populate the response
    await newCenter.populate('courses', 'title category');
    await newCenter.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: "Center created successfully",
      data: newCenter
    });
  } catch (error) {
    console.error("Error creating center:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create center",
      error: error.message
    });
  }
};

// Update center
export const updateCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.createdBy;
    delete updateData.createdAt;

    const center = await Center.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedBy: req.user?.id || new mongoose.Types.ObjectId(),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
      .populate('courses', 'title category')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!center) {
      return res.status(404).json({
        success: false,
        message: "Center not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Center updated successfully",
      data: center
    });
  } catch (error) {
    console.error("Error updating center:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update center",
      error: error.message
    });
  }
};

// Delete center
export const deleteCenter = async (req, res) => {
  try {
    const { id } = req.params;

    const center = await Center.findByIdAndDelete(id);

    if (!center) {
      return res.status(404).json({
        success: false,
        message: "Center not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Center deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting center:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete center",
      error: error.message
    });
  }
};

// Get centers for public (active only)
export const getPublicCenters = async (req, res) => {
  try {
    const { city, state, courseId } = req.query;
    
    let filter = { status: "active" };
    if (city) filter.city = new RegExp(city, 'i');
    if (state) filter.state = new RegExp(state, 'i');
    if (courseId) filter.courses = courseId;

    const centers = await Center.find(filter)
      .populate('courses', 'title category price')
      .select('-manager -createdBy -updatedBy -createdAt -updatedAt')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: centers
    });
  } catch (error) {
    console.error("Error fetching public centers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch centers",
      error: error.message
    });
  }
};

// Get available courses for center
export const getAvailableCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "Active" })
      .select('title category price level')
      .sort({ title: 1 });

    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message
    });
  }
};
