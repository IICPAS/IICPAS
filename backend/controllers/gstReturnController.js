import GSTReturn from "../models/GSTReturn.js";
import GSTSimulation from "../models/GSTSimulation.js";

// Create new GST Return simulation
export const createGSTReturn = async (req, res) => {
  try {
    const {
      returnType,
      financialYear,
      quarter,
      period,
      gstin,
      chapterId,
      assignmentId,
      caseStudyId,
      simulationConfig,
    } = req.body;

    const gstReturn = new GSTReturn({
      returnType,
      financialYear,
      quarter,
      period,
      gstin,
      chapterId,
      assignmentId,
      caseStudyId,
      simulationConfig: {
        isSimulation: true,
        difficulty: simulationConfig?.difficulty || "INTERMEDIATE",
        hints: simulationConfig?.hints || [],
        validationRules: {
          requiredFields:
            simulationConfig?.validationRules?.requiredFields || [],
          autoCalculate: true,
          showErrors: true,
        },
      },
      learningProgress: {
        completedSteps: [],
        currentStep: "record-details",
        score: 0,
        timeSpent: 0,
        attempts: 0,
      },
      createdBy: req.user.id,
    });

    await gstReturn.save();

    res.status(201).json({
      success: true,
      data: gstReturn,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all GST Returns with filtering
export const getGSTReturns = async (req, res) => {
  try {
    const {
      returnType,
      financialYear,
      quarter,
      period,
      chapterId,
      difficulty,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {
      createdBy: req.user.id,
      isActive: true,
    };

    if (returnType) filter.returnType = returnType;
    if (financialYear) filter.financialYear = financialYear;
    if (quarter) filter.quarter = quarter;
    if (period) filter.period = period;
    if (chapterId) filter.chapterId = chapterId;
    if (difficulty) filter["simulationConfig.difficulty"] = difficulty;

    const skip = (page - 1) * limit;

    const gstReturns = await GSTReturn.find(filter)
      .populate("chapterId", "title")
      .populate("assignmentId", "title")
      .populate("caseStudyId", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await GSTReturn.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: gstReturns,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single GST Return
export const getGSTReturn = async (req, res) => {
  try {
    const gstReturn = await GSTReturn.findById(req.params.id)
      .populate("chapterId", "title")
      .populate("assignmentId", "title")
      .populate("caseStudyId", "title")
      .populate("createdBy", "name email");

    if (!gstReturn) {
      return res.status(404).json({
        success: false,
        error: "GST Return not found",
      });
    }

    res.status(200).json({
      success: true,
      data: gstReturn,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update GST Return
export const updateGSTReturn = async (req, res) => {
  try {
    const { recordDetails, taxSummary, returnStatus, learningProgress } =
      req.body;

    const updateData = {};
    if (recordDetails) updateData.recordDetails = recordDetails;
    if (taxSummary) updateData.taxSummary = taxSummary;
    if (returnStatus) updateData.returnStatus = returnStatus;
    if (learningProgress) updateData.learningProgress = learningProgress;

    const gstReturn = await GSTReturn.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!gstReturn) {
      return res.status(404).json({
        success: false,
        error: "GST Return not found",
      });
    }

    res.status(200).json({
      success: true,
      data: gstReturn,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update learning progress
export const updateLearningProgress = async (req, res) => {
  try {
    const { completedSteps, currentStep, score, timeSpent, attempts } =
      req.body;

    const gstReturn = await GSTReturn.findById(req.params.id);

    if (!gstReturn) {
      return res.status(404).json({
        success: false,
        error: "GST Return not found",
      });
    }

    // Update learning progress
    if (completedSteps) {
      gstReturn.learningProgress.completedSteps = [
        ...new Set([
          ...gstReturn.learningProgress.completedSteps,
          ...completedSteps,
        ]),
      ];
    }
    if (currentStep) gstReturn.learningProgress.currentStep = currentStep;
    if (score !== undefined) gstReturn.learningProgress.score = score;
    if (timeSpent !== undefined)
      gstReturn.learningProgress.timeSpent += timeSpent;
    if (attempts !== undefined) gstReturn.learningProgress.attempts += attempts;

    await gstReturn.save();

    res.status(200).json({
      success: true,
      data: gstReturn.learningProgress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Validate GST Return
export const validateGSTReturn = async (req, res) => {
  try {
    const { field, value } = req.body;

    const gstReturn = await GSTReturn.findById(req.params.id);

    if (!gstReturn) {
      return res.status(404).json({
        success: false,
        error: "GST Return not found",
      });
    }

    let isValid = true;
    let errorMessage = "";

    // Field-specific validation
    switch (field) {
      case "gstin":
        const gstinRegex =
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        isValid = gstinRegex.test(value);
        errorMessage = isValid ? "" : "Invalid GSTIN format";
        break;

      case "financialYear":
        const fyRegex = /^20[0-9]{2}-[0-9]{2}$/;
        isValid = fyRegex.test(value);
        errorMessage = isValid ? "" : "Invalid financial year format (YYYY-YY)";
        break;

      case "period":
        const validPeriods = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        isValid = validPeriods.includes(value);
        errorMessage = isValid ? "" : "Invalid period";
        break;

      default:
        isValid = true;
        errorMessage = "";
    }

    res.status(200).json({
      success: true,
      data: {
        isValid,
        errorMessage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Submit GST Return
export const submitGSTReturn = async (req, res) => {
  try {
    const gstReturn = await GSTReturn.findById(req.params.id);

    if (!gstReturn) {
      return res.status(404).json({
        success: false,
        error: "GST Return not found",
      });
    }

    // Simulate return submission
    gstReturn.returnStatus = "SUBMITTED";
    gstReturn.filingDate = new Date();
    gstReturn.acknowledgmentNumber = `ACK${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    // Update learning progress
    gstReturn.learningProgress.completedSteps.push("return-submitted");
    gstReturn.learningProgress.currentStep = "completed";
    gstReturn.learningProgress.score = Math.min(
      100,
      gstReturn.learningProgress.score + 20
    );

    await gstReturn.save();

    res.status(200).json({
      success: true,
      data: {
        returnStatus: gstReturn.returnStatus,
        filingDate: gstReturn.filingDate,
        acknowledgmentNumber: gstReturn.acknowledgmentNumber,
        score: gstReturn.learningProgress.score,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get GST simulation statistics
export const getGSTSimulationStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await GSTReturn.aggregate([
      { $match: { createdBy: userId, isActive: true } },
      {
        $group: {
          _id: "$returnType",
          count: { $sum: 1 },
          avgScore: { $avg: "$learningProgress.score" },
          avgTimeSpent: { $avg: "$learningProgress.timeSpent" },
          totalAttempts: { $sum: "$learningProgress.attempts" },
        },
      },
    ]);

    const totalSimulations = await GSTReturn.countDocuments({
      createdBy: userId,
      isActive: true,
    });

    const completedSimulations = await GSTReturn.countDocuments({
      createdBy: userId,
      isActive: true,
      "learningProgress.currentStep": "completed",
    });

    res.status(200).json({
      success: true,
      data: {
        totalSimulations,
        completedSimulations,
        completionRate:
          totalSimulations > 0
            ? (completedSimulations / totalSimulations) * 100
            : 0,
        returnTypeStats: stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete GST Return
export const deleteGSTReturn = async (req, res) => {
  try {
    const gstReturn = await GSTReturn.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!gstReturn) {
      return res.status(404).json({
        success: false,
        error: "GST Return not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "GST Return deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
