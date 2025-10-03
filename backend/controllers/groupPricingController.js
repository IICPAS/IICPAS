import GroupPricing from "../models/GroupPricing.js";
import Course from "../models/Content/Course.js";
import Student from "../models/Students.js";
import mongoose from "mongoose";

// Get all group pricing configurations
export const getAllGroupPricing = async (req, res) => {
  try {
    const groupPricing = await GroupPricing.find({ status: "Active" })
      .populate({
        path: "courseIds",
        select: "title category level price",
        populate: {
          path: "chapters",
          select: "title topics",
        },
      })
      .sort({ level: 1, createdAt: -1 });

    // Ensure center pricing structures exist for all records
    const groupPricingWithDefaults = groupPricing.map((pricing) => {
      if (!pricing.pricing.recordedSessionCenter) {
        pricing.pricing.recordedSessionCenter = {
          title: "DIGITAL HUB+ RECORDED SESSION+ CENTER",
          buttonText: "Add Digital Hub+ Center",
          price: 0,
          discount: 0,
          finalPrice: 0,
        };
      }

      if (!pricing.pricing.liveSessionCenter) {
        pricing.pricing.liveSessionCenter = {
          title: "DIGITAL HUB+ LIVE SESSION+ CENTER",
          buttonText: "Add Digital Hub+ Center",
          price: 0,
          discount: 0,
          finalPrice: 0,
        };
      }

      return pricing;
    });

    res.json(groupPricingWithDefaults);
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
    const groupPricing = await GroupPricing.findById(id).populate({
      path: "courseIds",
      select: "title category level price",
      populate: {
        path: "chapters",
        select: "title",
        populate: {
          path: "topics",
          select: "title",
        },
      },
    });

    if (!groupPricing) {
      return res.status(404).json({
        success: false,
        message: "Group pricing not found",
      });
    }

    // Ensure center pricing structures exist
    if (!groupPricing.pricing.recordedSessionCenter) {
      groupPricing.pricing.recordedSessionCenter = {
        title: "DIGITAL HUB+ RECORDED SESSION+ CENTER",
        buttonText: "Add Digital Hub+ Center",
        price: 0,
        discount: 0,
        finalPrice: 0,
      };
    }

    if (!groupPricing.pricing.liveSessionCenter) {
      groupPricing.pricing.liveSessionCenter = {
        title: "DIGITAL HUB+ LIVE SESSION+ CENTER",
        buttonText: "Add Digital Hub+ Center",
        price: 0,
        discount: 0,
        finalPrice: 0,
      };
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
    console.log("Create Group Pricing - Request body:", req.body);
    console.log("Create Group Pricing - Request file:", req.file);

    const {
      level,
      courseIds,
      groupPrice,
      description,
      recordedPrice,
      recordedFinalPrice,
      recordedDiscount,
      livePrice,
      liveFinalPrice,
      liveDiscount,
      recordedPriceCenter,
      recordedFinalPriceCenter,
      recordedDiscountCenter,
      livePriceCenter,
      liveFinalPriceCenter,
      liveDiscountCenter,
    } = req.body;
    const image = req.file
      ? `/uploads/group_pricing_images/${req.file.filename}`
      : "";

    // Parse courseIds if it's a string (from FormData)
    let parsedCourseIds = courseIds;
    if (typeof courseIds === "string") {
      try {
        parsedCourseIds = JSON.parse(courseIds);
      } catch (e) {
        console.log("Error parsing courseIds:", e);
        return res.status(400).json({
          success: false,
          message: "Invalid courseIds format",
        });
      }
    }

    console.log("Parsed courseIds:", parsedCourseIds);

    // Validate required fields
    if (
      !level ||
      !parsedCourseIds ||
      !Array.isArray(parsedCourseIds) ||
      parsedCourseIds.length === 0 ||
      !groupPrice ||
      !recordedPrice ||
      !recordedFinalPrice ||
      !livePrice ||
      !liveFinalPrice ||
      !recordedPriceCenter ||
      !recordedFinalPriceCenter ||
      !livePriceCenter ||
      !liveFinalPriceCenter
    ) {
      console.log(
        "Validation failed - level:",
        level,
        "courseIds:",
        parsedCourseIds,
        "groupPrice:",
        groupPrice
      );
      return res.status(400).json({
        success: false,
        message:
          "Level, courseIds, groupPrice, and pricing details are required",
      });
    }

    // Validate that all courses exist and belong to the specified level
    console.log(
      "Looking for courses with IDs:",
      parsedCourseIds,
      "and level:",
      level
    );
    const courses = await Course.find({
      _id: { $in: parsedCourseIds },
      level: level,
      status: "Active",
    });

    console.log(
      "Found courses:",
      courses.length,
      "out of",
      parsedCourseIds.length
    );

    if (courses.length !== parsedCourseIds.length) {
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
      courseIds: parsedCourseIds,
      groupPrice: parseFloat(groupPrice),
      description: description || "",
      image: image,
      pricing: {
        recordedSession: {
          price: parseFloat(recordedPrice),
          finalPrice: parseFloat(recordedFinalPrice),
          discount: parseFloat(recordedDiscount) || 0,
        },
        liveSession: {
          price: parseFloat(livePrice),
          finalPrice: parseFloat(liveFinalPrice),
          discount: parseFloat(liveDiscount) || 0,
        },
        recordedSessionCenter: {
          price: parseFloat(recordedPriceCenter),
          finalPrice: parseFloat(recordedFinalPriceCenter),
          discount: parseFloat(recordedDiscountCenter) || 0,
        },
        liveSessionCenter: {
          price: parseFloat(livePriceCenter),
          finalPrice: parseFloat(liveFinalPriceCenter),
          discount: parseFloat(liveDiscountCenter) || 0,
        },
      },
    });

    const savedGroupPricing = await newGroupPricing.save();
    await savedGroupPricing.populate({
      path: "courseIds",
      select: "title category level price",
      populate: {
        path: "chapters",
        select: "title",
        populate: {
          path: "topics",
          select: "title",
        },
      },
    });

    // Calculate average rating from included courses
    await savedGroupPricing.calculateAverageRating();
    await savedGroupPricing.save();

    res.status(201).json({
      success: true,
      message: "Group pricing created successfully",
      data: savedGroupPricing,
    });
  } catch (error) {
    console.error("Error creating group pricing:", error);
    console.error("Error stack:", error.stack);
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
    const {
      level,
      courseIds,
      groupPrice,
      status,
      description,
      recordedPrice,
      recordedFinalPrice,
      recordedDiscount,
      livePrice,
      liveFinalPrice,
      liveDiscount,
      recordedPriceCenter,
      recordedFinalPriceCenter,
      recordedDiscountCenter,
      livePriceCenter,
      liveFinalPriceCenter,
      liveDiscountCenter,
    } = req.body;
    const image = req.file
      ? `/uploads/group_pricing_images/${req.file.filename}`
      : undefined;

    // Parse courseIds if it's a string (from FormData)
    let parsedCourseIds = courseIds;
    if (courseIds && typeof courseIds === "string") {
      try {
        parsedCourseIds = JSON.parse(courseIds);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Invalid courseIds format",
        });
      }
    }

    const groupPricing = await GroupPricing.findById(id);
    if (!groupPricing) {
      return res.status(404).json({
        success: false,
        message: "Group pricing not found",
      });
    }

    // Validate required fields if provided
    if (
      parsedCourseIds &&
      (!Array.isArray(parsedCourseIds) || parsedCourseIds.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "courseIds must be a non-empty array",
      });
    }

    // If level or courseIds are being updated, validate courses
    if (level || parsedCourseIds) {
      const targetLevel = level || groupPricing.level;
      const targetCourseIds = parsedCourseIds || groupPricing.courseIds;

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
    if (parsedCourseIds) groupPricing.courseIds = parsedCourseIds;
    if (groupPrice) groupPricing.groupPrice = parseFloat(groupPrice);
    if (description !== undefined) groupPricing.description = description;
    if (status) groupPricing.status = status;
    if (image) groupPricing.image = image;

    // Update pricing structure
    if (recordedPrice || recordedFinalPrice || recordedDiscount !== undefined) {
      if (recordedPrice)
        groupPricing.pricing.recordedSession.price = parseFloat(recordedPrice);
      if (recordedFinalPrice)
        groupPricing.pricing.recordedSession.finalPrice =
          parseFloat(recordedFinalPrice);
      if (recordedDiscount !== undefined)
        groupPricing.pricing.recordedSession.discount =
          parseFloat(recordedDiscount);
    }

    if (livePrice || liveFinalPrice || liveDiscount !== undefined) {
      if (livePrice)
        groupPricing.pricing.liveSession.price = parseFloat(livePrice);
      if (liveFinalPrice)
        groupPricing.pricing.liveSession.finalPrice =
          parseFloat(liveFinalPrice);
      if (liveDiscount !== undefined)
        groupPricing.pricing.liveSession.discount = parseFloat(liveDiscount);
    }

    // Initialize center pricing structures if they don't exist
    if (!groupPricing.pricing.recordedSessionCenter) {
      groupPricing.pricing.recordedSessionCenter = {
        title: "DIGITAL HUB+ RECORDED SESSION+ CENTER",
        buttonText: "Add Digital Hub+ Center",
        price: 0,
        discount: 0,
        finalPrice: 0,
      };
    }

    if (!groupPricing.pricing.liveSessionCenter) {
      groupPricing.pricing.liveSessionCenter = {
        title: "DIGITAL HUB+ LIVE SESSION+ CENTER",
        buttonText: "Add Digital Hub+ Center",
        price: 0,
        discount: 0,
        finalPrice: 0,
      };
    }

    // Update recorded session center pricing
    if (
      recordedPriceCenter ||
      recordedFinalPriceCenter ||
      recordedDiscountCenter !== undefined
    ) {
      if (recordedPriceCenter)
        groupPricing.pricing.recordedSessionCenter.price =
          parseFloat(recordedPriceCenter);
      if (recordedFinalPriceCenter)
        groupPricing.pricing.recordedSessionCenter.finalPrice = parseFloat(
          recordedFinalPriceCenter
        );
      if (recordedDiscountCenter !== undefined)
        groupPricing.pricing.recordedSessionCenter.discount = parseFloat(
          recordedDiscountCenter
        );
    }

    // Update live session center pricing
    if (
      livePriceCenter ||
      liveFinalPriceCenter ||
      liveDiscountCenter !== undefined
    ) {
      if (livePriceCenter)
        groupPricing.pricing.liveSessionCenter.price =
          parseFloat(livePriceCenter);
      if (liveFinalPriceCenter)
        groupPricing.pricing.liveSessionCenter.finalPrice =
          parseFloat(liveFinalPriceCenter);
      if (liveDiscountCenter !== undefined)
        groupPricing.pricing.liveSessionCenter.discount =
          parseFloat(liveDiscountCenter);
    }

    const updatedGroupPricing = await groupPricing.save();

    // Recalculate average rating if courses changed
    if (parsedCourseIds) {
      await updatedGroupPricing.calculateAverageRating();
      await updatedGroupPricing.save();
    }
    await updatedGroupPricing.populate({
      path: "courseIds",
      select: "title category level price",
      populate: {
        path: "chapters",
        select: "title",
        populate: {
          path: "topics",
          select: "title",
        },
      },
    });

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

// Enroll student in group package
export const enrollInGroupPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, sessionType } = req.body;

    // Validate student ID format
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }

    // Validate group pricing ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group pricing ID format",
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if group pricing exists
    const groupPricing = await GroupPricing.findById(id).populate({
      path: "courseIds",
      select: "title category level price",
      populate: {
        path: "chapters",
        select: "title",
        populate: {
          path: "topics",
          select: "title",
        },
      },
    });
    if (!groupPricing) {
      return res.status(404).json({
        success: false,
        message: "Group package not found",
      });
    }

    // Validate session type
    if (!sessionType || !["recorded", "live"].includes(sessionType)) {
      return res.status(400).json({
        success: false,
        message: "Session type must be 'recorded' or 'live'",
      });
    }

    // Check if student is already enrolled in any of the courses in this package
    const enrolledCourses = groupPricing.courseIds.filter(
      (course) =>
        student.enrolledRecordedSessions.includes(course._id) ||
        student.enrolledLiveSessions.includes(course._id)
    );

    if (enrolledCourses.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Student is already enrolled in some courses from this package: ${enrolledCourses
          .map((c) => c.title)
          .join(", ")}`,
      });
    }

    // Enroll student in all courses in the package
    const courseIds = groupPricing.courseIds.map((course) => course._id);

    if (sessionType === "recorded") {
      // Add all courses to recorded sessions
      student.enrolledRecordedSessions.push(...courseIds);
    } else {
      // Add all courses to live sessions
      student.enrolledLiveSessions.push(...courseIds);
    }

    await student.save();

    res.json({
      success: true,
      message: `Successfully enrolled in ${groupPricing.level} package with ${sessionType} sessions`,
      data: {
        packageId: groupPricing._id,
        packageName: `${groupPricing.level} Course Package`,
        sessionType,
        enrolledCourses: courseIds.length,
        courseTitles: groupPricing.courseIds.map((course) => course.title),
      },
    });
  } catch (error) {
    console.error("Error enrolling in group package:", error);
    res.status(500).json({
      success: false,
      message: "Failed to enroll in group package",
      error: error.message,
    });
  }
};
