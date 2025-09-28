import GroupPricing from "../models/GroupPricing.js";
import Course from "../models/Content/Course.js";

// Get all group pricing configurations
export const getAllGroupPricing = async (req, res) => {
  try {
    const groupPricing = await GroupPricing.find({ status: "Active" })
      .populate("courseIds", "title category level price")
      .sort({ level: 1, createdAt: -1 });

    res.json(groupPricing);
  } catch (error) {
    console.error("Error fetching group pricing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch group pricing",
      error: error.message,
    });
  }
};

// Get group pricing by ID
export const getGroupPricingById = async (req, res) => {
  try {
    const { id } = req.params;
    const groupPricing = await GroupPricing.findById(id).populate(
      "courseIds",
      "title category level price"
    );

    if (!groupPricing) {
      return res.status(404).json({
        success: false,
        message: "Group pricing not found",
      });
    }

    res.json(groupPricing);
  } catch (error) {
    console.error("Error fetching group pricing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch group pricing",
      error: error.message,
    });
  }
};

// Create new group pricing configuration
export const createGroupPricing = async (req, res) => {
  try {
    const { level, courseIds, groupPrice, description } = req.body;

    // Validate required fields
    if (
      !level ||
      !courseIds ||
      !Array.isArray(courseIds) ||
      courseIds.length === 0 ||
      !groupPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "Level, courseIds, and groupPrice are required",
      });
    }

    // Validate that all courses exist and belong to the specified level
    const courses = await Course.find({
      _id: { $in: courseIds },
      level: level,
      status: "Active",
    });

    if (courses.length !== courseIds.length) {
      return res.status(400).json({
        success: false,
        message:
          "Some courses not found or don't belong to the specified level",
      });
    }

    // Check if group pricing already exists for this level
    const existingGroupPricing = await GroupPricing.findOne({
      level: level,
      status: "Active",
    });

    if (existingGroupPricing) {
      return res.status(400).json({
        success: false,
        message:
          "Group pricing already exists for this level. Please update the existing one.",
      });
    }

    const newGroupPricing = new GroupPricing({
      level,
      courseIds,
      groupPrice: parseFloat(groupPrice),
      description: description || "",
    });

    const savedGroupPricing = await newGroupPricing.save();
    await savedGroupPricing.populate("courseIds", "title category level price");

    res.status(201).json({
      success: true,
      message: "Group pricing created successfully",
      data: savedGroupPricing,
    });
  } catch (error) {
    console.error("Error creating group pricing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create group pricing",
      error: error.message,
    });
  }
};

// Update group pricing configuration
export const updateGroupPricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { level, courseIds, groupPrice, description, status } = req.body;

    const groupPricing = await GroupPricing.findById(id);
    if (!groupPricing) {
      return res.status(404).json({
        success: false,
        message: "Group pricing not found",
      });
    }

    // Validate required fields if provided
    if (courseIds && (!Array.isArray(courseIds) || courseIds.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "courseIds must be a non-empty array",
      });
    }

    // If level or courseIds are being updated, validate courses
    if (level || courseIds) {
      const targetLevel = level || groupPricing.level;
      const targetCourseIds = courseIds || groupPricing.courseIds;

      const courses = await Course.find({
        _id: { $in: targetCourseIds },
        level: targetLevel,
        status: "Active",
      });

      if (courses.length !== targetCourseIds.length) {
        return res.status(400).json({
          success: false,
          message:
            "Some courses not found or don't belong to the specified level",
        });
      }
    }

    // Update fields
    if (level) groupPricing.level = level;
    if (courseIds) groupPricing.courseIds = courseIds;
    if (groupPrice) groupPricing.groupPrice = parseFloat(groupPrice);
    if (description !== undefined) groupPricing.description = description;
    if (status) groupPricing.status = status;

    const updatedGroupPricing = await groupPricing.save();
    await updatedGroupPricing.populate(
      "courseIds",
      "title category level price"
    );

    res.json({
      success: true,
      message: "Group pricing updated successfully",
      data: updatedGroupPricing,
    });
  } catch (error) {
    console.error("Error updating group pricing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update group pricing",
      error: error.message,
    });
  }
};

// Delete group pricing configuration
export const deleteGroupPricing = async (req, res) => {
  try {
    const { id } = req.params;

    const groupPricing = await GroupPricing.findById(id);
    if (!groupPricing) {
      return res.status(404).json({
        success: false,
        message: "Group pricing not found",
      });
    }

    await GroupPricing.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Group pricing deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting group pricing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete group pricing",
      error: error.message,
    });
  }
};

// Get group pricing by level
export const getGroupPricingByLevel = async (req, res) => {
  try {
    const { level } = req.params;

    const groupPricing = await GroupPricing.findOne({
      level: level,
      status: "Active",
    }).populate("courseIds", "title category level price");

    if (!groupPricing) {
      return res.status(404).json({
        success: false,
        message: "Group pricing not found for this level",
      });
    }

    res.json(groupPricing);
  } catch (error) {
    console.error("Error fetching group pricing by level:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch group pricing",
      error: error.message,
    });
  }
};

// Get available courses for a specific level
export const getCoursesByLevel = async (req, res) => {
  try {
    const { level } = req.params;

    const courses = await Course.find({
      level: level,
      status: "Active",
    }).select("_id title category level price");

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses by level:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};
