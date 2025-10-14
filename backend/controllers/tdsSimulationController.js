import TDSSimulation from "../models/TDSSimulation.js";
import mongoose from "mongoose";

// Create TDS Simulation
const createTDSSimulation = async (req, res) => {
  try {
    const {
      simulationType,
      financialYear,
      quarter,
      period,
      tan,
      deductor,
      deductees,
      simulationConfig,
      assignmentId,
      caseStudyId,
    } = req.body;

    // Validate required fields
    if (!simulationType || !financialYear || !quarter || !period || !tan) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Create new TDS simulation
    const tdsSimulation = new TDSSimulation({
      simulationType,
      financialYear,
      quarter,
      period,
      tan,
      deductor,
      deductees: deductees || [],
      simulationConfig: {
        isSimulation: true,
        difficulty: simulationConfig?.difficulty || "BEGINNER",
        hints: simulationConfig?.hints || [],
        validationRules: {
          requiredFields:
            simulationConfig?.validationRules?.requiredFields || [],
          autoCalculate:
            simulationConfig?.validationRules?.autoCalculate ?? true,
          showErrors: simulationConfig?.validationRules?.showErrors ?? true,
        },
      },
      learningProgress: {
        completedSteps: [],
        currentStep: "deductor",
        score: 0,
        timeSpent: 0,
        attempts: 0,
      },
      assignmentId,
      caseStudyId,
      createdBy: req.user.id,
    });

    await tdsSimulation.save();

    res.status(201).json({
      success: true,
      message: "TDS simulation created successfully",
      data: tdsSimulation,
    });
  } catch (error) {
    console.error("Error creating TDS simulation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all TDS Simulations
const getTDSSimulations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      simulationType,
      financialYear,
      quarter,
      difficulty,
      isActive = true,
    } = req.query;

    // Build filter object
    const filter = { isActive };
    if (simulationType) filter.simulationType = simulationType;
    if (financialYear) filter.financialYear = financialYear;
    if (quarter) filter.quarter = quarter;
    if (difficulty) filter["simulationConfig.difficulty"] = difficulty;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get simulations with pagination
    const simulations = await TDSSimulation.find(filter)
      .populate("createdBy", "name email")
      .populate("assignmentId", "title")
      .populate("caseStudyId", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await TDSSimulation.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: simulations,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching TDS simulations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get single TDS Simulation
const getTDSSimulation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid simulation ID",
      });
    }

    const simulation = await TDSSimulation.findById(id)
      .populate("createdBy", "name email")
      .populate("assignmentId", "title")
      .populate("caseStudyId", "title");

    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: "TDS simulation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: simulation,
    });
  } catch (error) {
    console.error("Error fetching TDS simulation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update TDS Simulation
const updateTDSSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid simulation ID",
      });
    }

    const simulation = await TDSSimulation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "name email")
      .populate("assignmentId", "title")
      .populate("caseStudyId", "title");

    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: "TDS simulation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "TDS simulation updated successfully",
      data: simulation,
    });
  } catch (error) {
    console.error("Error updating TDS simulation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete TDS Simulation
const deleteTDSSimulation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid simulation ID",
      });
    }

    const simulation = await TDSSimulation.findByIdAndDelete(id);

    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: "TDS simulation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "TDS simulation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting TDS simulation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update Learning Progress
const updateLearningProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { completedSteps, currentStep, score, timeSpent, attempts } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid simulation ID",
      });
    }

    const updateData = {};
    if (completedSteps)
      updateData["learningProgress.completedSteps"] = completedSteps;
    if (currentStep) updateData["learningProgress.currentStep"] = currentStep;
    if (score !== undefined) updateData["learningProgress.score"] = score;
    if (timeSpent !== undefined)
      updateData["learningProgress.timeSpent"] = timeSpent;
    if (attempts !== undefined)
      updateData["learningProgress.attempts"] = attempts;

    const simulation = await TDSSimulation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: "TDS simulation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Learning progress updated successfully",
      data: simulation.learningProgress,
    });
  } catch (error) {
    console.error("Error updating learning progress:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Validate TDS Simulation
const validateTDSSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const { field, value } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid simulation ID",
      });
    }

    const simulation = await TDSSimulation.findById(id);
    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: "TDS simulation not found",
      });
    }

    let isValid = true;
    let errorMessage = "";

    // Field-specific validation
    switch (field) {
      case "tan":
        isValid = /^[A-Z]{4}[0-9]{5}[A-Z]$/.test(value);
        errorMessage = isValid ? "" : "Invalid TAN format";
        break;
      case "pan":
        isValid = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value);
        errorMessage = isValid ? "" : "Invalid PAN format";
        break;
      case "pincode":
        isValid = /^[1-9][0-9]{5}$/.test(value);
        errorMessage = isValid ? "" : "Invalid pincode format";
        break;
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        errorMessage = isValid ? "" : "Invalid email format";
        break;
      case "phone":
        isValid = /^[6-9]\d{9}$/.test(value);
        errorMessage = isValid ? "" : "Invalid phone number format";
        break;
      default:
        isValid = true;
    }

    res.status(200).json({
      success: true,
      data: {
        isValid,
        errorMessage,
        field,
        value,
      },
    });
  } catch (error) {
    console.error("Error validating TDS simulation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Generate TDS Certificate
const generateTDSCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid simulation ID",
      });
    }

    const simulation = await TDSSimulation.findById(id);
    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: "TDS simulation not found",
      });
    }

    // Generate certificate number
    const certificateNumber = `TDS${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    // Update certificate details
    simulation.certificateDetails = {
      certificateNumber,
      certificateDate: new Date(),
      periodFrom: new Date(simulation.financialYear.split("-")[0], 3, 1), // April 1st
      periodTo: new Date(simulation.financialYear.split("-")[1], 2, 31), // March 31st
      totalTdsAmount: simulation.tdsSummary?.totalTdsAmount || 0,
      totalIncome: simulation.tdsSummary?.totalGrossAmount || 0,
      status: "GENERATED",
    };

    await simulation.save();

    res.status(200).json({
      success: true,
      message: "TDS certificate generated successfully",
      data: simulation.certificateDetails,
    });
  } catch (error) {
    console.error("Error generating TDS certificate:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Generate TDS Challan
const generateTDSChallan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid simulation ID",
      });
    }

    const simulation = await TDSSimulation.findById(id);
    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: "TDS simulation not found",
      });
    }

    // Generate challan number
    const challanNumber = `CHL${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    // Update challan details
    simulation.challanDetails = {
      challanNumber,
      challanDate: new Date(),
      bankCode: "SBIN",
      branchCode: "001",
      amount: simulation.tdsSummary?.totalTdsAmount || 0,
      status: "GENERATED",
    };

    await simulation.save();

    res.status(200).json({
      success: true,
      message: "TDS challan generated successfully",
      data: simulation.challanDetails,
    });
  } catch (error) {
    console.error("Error generating TDS challan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get TDS Simulation Statistics
const getTDSSimulationStats = async (req, res) => {
  try {
    const stats = await TDSSimulation.aggregate([
      {
        $group: {
          _id: null,
          totalSimulations: { $sum: 1 },
          averageScore: { $avg: "$learningProgress.score" },
          totalTimeSpent: { $sum: "$learningProgress.timeSpent" },
          totalAttempts: { $sum: "$learningProgress.attempts" },
        },
      },
    ]);

    const typeStats = await TDSSimulation.aggregate([
      {
        $group: {
          _id: "$simulationType",
          count: { $sum: 1 },
          averageScore: { $avg: "$learningProgress.score" },
        },
      },
    ]);

    const difficultyStats = await TDSSimulation.aggregate([
      {
        $group: {
          _id: "$simulationConfig.difficulty",
          count: { $sum: 1 },
          averageScore: { $avg: "$learningProgress.score" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overall: stats[0] || {
          totalSimulations: 0,
          averageScore: 0,
          totalTimeSpent: 0,
          totalAttempts: 0,
        },
        byType: typeStats,
        byDifficulty: difficultyStats,
      },
    });
  } catch (error) {
    console.error("Error fetching TDS simulation stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export {
  createTDSSimulation,
  getTDSSimulations,
  getTDSSimulation,
  updateTDSSimulation,
  deleteTDSSimulation,
  updateLearningProgress,
  validateTDSSimulation,
  generateTDSCertificate,
  generateTDSChallan,
  getTDSSimulationStats,
};
