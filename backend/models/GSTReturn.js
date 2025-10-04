import mongoose from "mongoose";

// GST Return Filing Schema
const gstReturnSchema = new mongoose.Schema(
  {
    // Basic Return Details
    returnType: {
      type: String,
      required: true,
      enum: ["GSTR-1A", "GSTR-3B", "GSTR-1", "GSTR-2", "GSTR-3"],
    },
    financialYear: {
      type: String,
      required: true,
    },
    quarter: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    gstin: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
            v
          );
        },
        message: "Invalid GSTIN format",
      },
    },

    // Record Details for GSTR-1A
    recordDetails: {
      b2bInvoices: {
        count: { type: Number, default: 0 },
        taxableValue: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
      },
      b2cLargeInvoices: {
        count: { type: Number, default: 0 },
        taxableValue: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
      },
      exportInvoices: {
        count: { type: Number, default: 0 },
        taxableValue: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
      },
      b2cOthers: {
        count: { type: Number, default: 0 },
        taxableValue: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
      },
      nilRatedSupplies: {
        count: { type: Number, default: 0 },
        taxableValue: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
      },
      creditDebitNotesRegistered: {
        count: { type: Number, default: 0 },
        taxableValue: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
      },
      creditDebitNotesUnregistered: {
        count: { type: Number, default: 0 },
        taxableValue: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
      },
      taxLiabilityAdvances: {
        count: { type: Number, default: 0 },
        taxableValue: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
      },
      adjustmentAdvances: {
        count: { type: Number, default: 0 },
        taxableValue: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
      },
      hsnSummary: {
        count: { type: Number, default: 0 },
        taxableValue: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
      },
      documentsIssued: {
        count: { type: Number, default: 0 },
        taxableValue: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
      },
      ecoSupplies: {
        count: { type: Number, default: 0 },
        taxableValue: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
      },
    },

    // Tax Summary
    taxSummary: {
      totalTaxableValue: { type: Number, default: 0 },
      totalCgstAmount: { type: Number, default: 0 },
      totalSgstAmount: { type: Number, default: 0 },
      totalIgstAmount: { type: Number, default: 0 },
      totalCessAmount: { type: Number, default: 0 },
      totalTaxAmount: { type: Number, default: 0 },
      grandTotal: { type: Number, default: 0 },
    },

    // Return Status
    returnStatus: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "FILED", "REJECTED", "CANCELLED"],
      default: "DRAFT",
    },
    filingDate: Date,
    acknowledgmentNumber: String,

    // Simulation Configuration
    simulationConfig: {
      isSimulation: { type: Boolean, default: true },
      difficulty: {
        type: String,
        enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
        default: "INTERMEDIATE",
      },
      hints: [
        {
          field: String,
          hint: String,
          order: Number,
        },
      ],
      validationRules: {
        requiredFields: [String],
        autoCalculate: { type: Boolean, default: true },
        showErrors: { type: Boolean, default: true },
      },
    },

    // Learning Progress
    learningProgress: {
      completedSteps: [String],
      currentStep: String,
      score: { type: Number, min: 0, max: 100, default: 0 },
      timeSpent: { type: Number, default: 0 }, // in minutes
      attempts: { type: Number, default: 0 },
    },

    // Metadata
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
    },
    caseStudyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CaseStudy",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
gstReturnSchema.index({ gstin: 1, returnType: 1, financialYear: 1, period: 1 });
gstReturnSchema.index({ chapterId: 1 });
gstReturnSchema.index({ createdBy: 1 });

// Prevent OverwriteModelError
const GSTReturn =
  mongoose.models.GSTReturn || mongoose.model("GSTReturn", gstReturnSchema);

export default GSTReturn;
