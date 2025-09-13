import GSTSimulation from "../models/GSTSimulation.js";
import mongoose from "mongoose";

// Generate unique invoice number
const generateInvoiceNumber = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const prefix = `INV${year}${month}${day}`;

  // Find the last invoice number for today
  const lastInvoice = await GSTSimulation.findOne({
    invoiceNumber: { $regex: `^${prefix}` },
  }).sort({ invoiceNumber: -1 });

  let sequence = 1;
  if (lastInvoice) {
    const lastSequence = parseInt(lastInvoice.invoiceNumber.slice(-4));
    sequence = lastSequence + 1;
  }

  return `${prefix}${String(sequence).padStart(4, "0")}`;
};

// Validate GSTIN
const validateGSTIN = (gstin) => {
  if (!gstin) return true; // Optional for B2C
  const gstinRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
};

// Calculate tax based on state
const calculateTax = (taxableAmount, taxRate, isInterstate) => {
  if (isInterstate) {
    return {
      igstAmount: (taxableAmount * taxRate) / 100,
      cgstAmount: 0,
      sgstAmount: 0,
    };
  } else {
    const halfRate = taxRate / 2;
    return {
      igstAmount: 0,
      cgstAmount: (taxableAmount * halfRate) / 100,
      sgstAmount: (taxableAmount * halfRate) / 100,
    };
  }
};

// Create GST Simulation
export const createGSTSimulation = async (req, res) => {
  try {
    const {
      chapterId,
      assignmentId,
      caseStudyId,
      simulationConfig,
      supplier,
      recipient,
      items,
      transportDetails,
    } = req.body;

    // Validate required fields
    if (!chapterId) {
      return res.status(400).json({
        success: false,
        message: "Chapter ID is required",
      });
    }

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Validate GSTINs
    if (supplier?.gstin && !validateGSTIN(supplier.gstin)) {
      return res.status(400).json({
        success: false,
        message: "Invalid supplier GSTIN format",
      });
    }

    if (recipient?.gstin && !validateGSTIN(recipient.gstin)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipient GSTIN format",
      });
    }

    // Determine if interstate transaction
    const isInterstate = supplier?.address?.state !== recipient?.address?.state;

    // Process items and calculate taxes
    const processedItems =
      items?.map((item) => {
        const taxableAmount = item.quantity * item.unitPrice;
        const taxRate = item.cgstRate + item.sgstRate + item.igstRate;

        let taxAmounts;
        if (isInterstate) {
          taxAmounts = {
            igstAmount: (taxableAmount * item.igstRate) / 100,
            cgstAmount: 0,
            sgstAmount: 0,
          };
        } else {
          const cgstRate = item.cgstRate;
          const sgstRate = item.sgstRate;
          taxAmounts = {
            igstAmount: 0,
            cgstAmount: (taxableAmount * cgstRate) / 100,
            sgstAmount: (taxableAmount * sgstRate) / 100,
          };
        }

        const cessAmount = (taxableAmount * (item.cessRate || 0)) / 100;
        const totalAmount =
          taxableAmount +
          taxAmounts.cgstAmount +
          taxAmounts.sgstAmount +
          taxAmounts.igstAmount +
          cessAmount;

        return {
          ...item,
          taxableAmount,
          ...taxAmounts,
          cessAmount,
          totalAmount,
        };
      }) || [];

    // Create GST simulation
    const gstSimulation = new GSTSimulation({
      invoiceNumber,
      chapterId,
      assignmentId,
      caseStudyId,
      supplier,
      recipient,
      items: processedItems,
      transportDetails,
      simulationConfig: {
        isSimulation: true,
        difficulty: simulationConfig?.difficulty || "BEGINNER",
        hints: simulationConfig?.hints || [],
        validationRules: simulationConfig?.validationRules || {
          requiredFields: [
            "supplier.name",
            "supplier.gstin",
            "recipient.name",
            "items",
          ],
          autoCalculate: true,
          showErrors: true,
        },
      },
      learningProgress: {
        completedSteps: [],
        currentStep: "supplier_details",
        score: 0,
        timeSpent: 0,
        attempts: 0,
      },
      createdBy: req.user.id,
    });

    await gstSimulation.save();

    res.status(201).json({
      success: true,
      message: "GST Simulation created successfully",
      data: gstSimulation,
    });
  } catch (error) {
    console.error("Error creating GST simulation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all GST Simulations
export const getGSTSimulations = async (req, res) => {
  try {
    const {
      chapterId,
      assignmentId,
      caseStudyId,
      difficulty,
      isActive = true,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { isActive };

    if (chapterId) filter.chapterId = chapterId;
    if (assignmentId) filter.assignmentId = assignmentId;
    if (caseStudyId) filter.caseStudyId = caseStudyId;
    if (difficulty) filter["simulationConfig.difficulty"] = difficulty;

    const skip = (page - 1) * limit;

    const simulations = await GSTSimulation.find(filter)
      .populate("chapterId", "title")
      .populate("assignmentId", "title")
      .populate("caseStudyId", "title")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await GSTSimulation.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: simulations,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching GST simulations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get single GST Simulation
export const getGSTSimulation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid simulation ID",
      });
    }

    const simulation = await GSTSimulation.findById(id)
      .populate("chapterId", "title")
      .populate("assignmentId", "title")
      .populate("caseStudyId", "title")
      .populate("createdBy", "name email");

    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: "GST Simulation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: simulation,
    });
  } catch (error) {
    console.error("Error fetching GST simulation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update GST Simulation
export const updateGSTSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid simulation ID",
      });
    }

    // Validate GSTINs if provided
    if (
      updateData.supplier?.gstin &&
      !validateGSTIN(updateData.supplier.gstin)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid supplier GSTIN format",
      });
    }

    if (
      updateData.recipient?.gstin &&
      !validateGSTIN(updateData.recipient.gstin)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipient GSTIN format",
      });
    }

    const simulation = await GSTSimulation.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate("chapterId", "title")
      .populate("assignmentId", "title")
      .populate("caseStudyId", "title")
      .populate("createdBy", "name email");

    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: "GST Simulation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "GST Simulation updated successfully",
      data: simulation,
    });
  } catch (error) {
    console.error("Error updating GST simulation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update Learning Progress
export const updateLearningProgress = async (req, res) => {
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

    const simulation = await GSTSimulation.findById(id);
    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: "GST Simulation not found",
      });
    }

    // Update learning progress
    if (completedSteps)
      simulation.learningProgress.completedSteps = completedSteps;
    if (currentStep) simulation.learningProgress.currentStep = currentStep;
    if (score !== undefined) simulation.learningProgress.score = score;
    if (timeSpent !== undefined)
      simulation.learningProgress.timeSpent = timeSpent;
    if (attempts !== undefined) simulation.learningProgress.attempts = attempts;

    await simulation.save();

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

// Validate GST Simulation
export const validateGSTSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const { field, value } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid simulation ID",
      });
    }

    const simulation = await GSTSimulation.findById(id);
    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: "GST Simulation not found",
      });
    }

    let isValid = true;
    let errorMessage = "";
    let hint = "";

    // Field-specific validation
    switch (field) {
      case "supplier.gstin":
        if (value && !validateGSTIN(value)) {
          isValid = false;
          errorMessage =
            "Invalid GSTIN format. GSTIN should be 15 characters: 2 digits (state code) + 10 characters (PAN) + 1 character (entity number) + 1 character (Z) + 1 character (checksum)";
          hint = "Example: 22AAAAA0000A1Z5";
        }
        break;

      case "recipient.gstin":
        if (value && !validateGSTIN(value)) {
          isValid = false;
          errorMessage = "Invalid GSTIN format";
          hint = "Example: 22AAAAA0000A1Z5";
        }
        break;

      case "items":
        if (!value || value.length === 0) {
          isValid = false;
          errorMessage = "At least one item is required";
          hint = "Add items with proper HSN codes and tax rates";
        }
        break;

      case "hsnCode":
        if (value && !/^\d{4,8}$/.test(value)) {
          isValid = false;
          errorMessage = "HSN code must be 4-8 digits";
          hint = "Example: 1234 or 12345678";
        }
        break;

      default:
        break;
    }

    res.status(200).json({
      success: true,
      isValid,
      errorMessage,
      hint,
    });
  } catch (error) {
    console.error("Error validating GST simulation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Generate E-Invoice (Simulation)
export const generateEInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid simulation ID",
      });
    }

    const simulation = await GSTSimulation.findById(id);
    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: "GST Simulation not found",
      });
    }

    // Simulate e-invoice generation
    const irn = `IRN${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
    const ackNo = `ACK${Date.now()}`;

    // Generate QR code data (simplified)
    const qrData = {
      irn,
      ackNo,
      ackDate: new Date(),
      invoiceNumber: simulation.invoiceNumber,
      invoiceDate: simulation.invoiceDate,
      totalAmount: simulation.taxSummary.grandTotal,
      supplierGstin: simulation.supplier.gstin,
      recipientGstin: simulation.recipient.gstin,
    };

    // Update simulation with e-invoice details
    simulation.einvoiceDetails = {
      irn,
      qrCode: JSON.stringify(qrData),
      ackNo,
      ackDate: new Date(),
      status: "GENERATED",
    };

    await simulation.save();

    res.status(200).json({
      success: true,
      message: "E-Invoice generated successfully",
      data: {
        irn,
        ackNo,
        ackDate: simulation.einvoiceDetails.ackDate,
        qrCode: qrData,
        status: "GENERATED",
      },
    });
  } catch (error) {
    console.error("Error generating e-invoice:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete GST Simulation
export const deleteGSTSimulation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid simulation ID",
      });
    }

    const simulation = await GSTSimulation.findByIdAndDelete(id);

    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: "GST Simulation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "GST Simulation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting GST simulation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get GST Simulation Statistics
export const getGSTSimulationStats = async (req, res) => {
  try {
    const { chapterId, createdBy } = req.query;

    const filter = {};
    if (chapterId) filter.chapterId = chapterId;
    if (createdBy) filter.createdBy = createdBy;

    const stats = await GSTSimulation.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalSimulations: { $sum: 1 },
          averageScore: { $avg: "$learningProgress.score" },
          totalTimeSpent: { $sum: "$learningProgress.timeSpent" },
          completedSimulations: {
            $sum: {
              $cond: [{ $gt: ["$learningProgress.score", 80] }, 1, 0],
            },
          },
        },
      },
    ]);

    const difficultyStats = await GSTSimulation.aggregate([
      { $match: filter },
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
          completedSimulations: 0,
        },
        byDifficulty: difficultyStats,
      },
    });
  } catch (error) {
    console.error("Error fetching GST simulation stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
