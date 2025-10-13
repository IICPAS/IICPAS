const mongoose = require("mongoose");

// TDS Simulation Schema
const tdsSimulationSchema = new mongoose.Schema(
  {
    // Basic Details
    simulationType: {
      type: String,
      enum: [
        "TDS_RETURN_24Q",
        "TDS_RETURN_26Q",
        "TDS_CERTIFICATE",
        "TDS_CHALLAN",
      ],
      required: true,
    },
    financialYear: {
      type: String,
      required: true,
      default: "2024-25",
    },
    quarter: {
      type: String,
      enum: ["Q1", "Q2", "Q3", "Q4"],
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    tan: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // TAN format: AAAA12345A
          return /^[A-Z]{4}[0-9]{5}[A-Z]$/.test(v);
        },
        message: "Invalid TAN format",
      },
    },

    // Deductor Details
    deductor: {
      name: {
        type: String,
        required: true,
      },
      tan: {
        type: String,
        required: true,
      },
      address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: {
          type: String,
          default: "India",
        },
      },
      contact: {
        phone: String,
        email: String,
      },
      pan: {
        type: String,
        validate: {
          validator: function (v) {
            return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v);
          },
          message: "Invalid PAN format",
        },
      },
    },

    // Deductee Details (for returns)
    deductees: [
      {
        pan: {
          type: String,
          required: true,
          validate: {
            validator: function (v) {
              return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v);
            },
            message: "Invalid PAN format",
          },
        },
        name: {
          type: String,
          required: true,
        },
        address: {
          street: String,
          city: String,
          state: String,
          pincode: String,
        },
        contact: {
          phone: String,
          email: String,
        },
        section: {
          type: String,
          required: true,
          enum: [
            "194A",
            "194B",
            "194C",
            "194D",
            "194E",
            "194F",
            "194G",
            "194H",
            "194I",
            "194J",
            "194K",
            "194L",
            "194LA",
            "194LB",
            "194LC",
            "194LD",
            "194M",
            "194N",
            "194O",
            "194P",
            "194Q",
            "194R",
            "194S",
            "194T",
            "194U",
            "194V",
            "194W",
            "194X",
            "194Y",
            "194Z",
            "194ZA",
            "194ZB",
            "194ZC",
            "194ZD",
            "194ZE",
            "194ZF",
            "194ZG",
            "194ZH",
            "194ZI",
            "194ZJ",
          ],
        },
        grossAmount: {
          type: Number,
          required: true,
          min: 0,
        },
        tdsRate: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        tdsAmount: {
          type: Number,
          required: true,
          min: 0,
        },
        netAmount: {
          type: Number,
          required: true,
          min: 0,
        },
        paymentDate: {
          type: Date,
          required: true,
        },
        challanNumber: String,
        challanDate: Date,
        challanAmount: Number,
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // TDS Summary
    tdsSummary: {
      totalGrossAmount: Number,
      totalTdsAmount: Number,
      totalNetAmount: Number,
      totalChallanAmount: Number,
      totalDeductees: Number,
      sections: [
        {
          section: String,
          count: Number,
          grossAmount: Number,
          tdsAmount: Number,
        },
      ],
    },

    // Return Status
    returnStatus: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "FILED", "REJECTED", "CORRECTED"],
      default: "DRAFT",
    },
    filingDate: Date,
    acknowledgmentNumber: String,
    receiptNumber: String,

    // Certificate Details (for TDS certificates)
    certificateDetails: {
      certificateNumber: String,
      certificateDate: Date,
      periodFrom: Date,
      periodTo: Date,
      totalTdsAmount: Number,
      totalIncome: Number,
      status: {
        type: String,
        enum: ["DRAFT", "GENERATED", "CANCELLED"],
        default: "DRAFT",
      },
    },

    // Challan Details
    challanDetails: {
      challanNumber: String,
      challanDate: Date,
      bankCode: String,
      branchCode: String,
      amount: Number,
      status: {
        type: String,
        enum: ["DRAFT", "GENERATED", "PAID"],
        default: "DRAFT",
      },
    },

    // Simulation Configuration
    simulationConfig: {
      isSimulation: {
        type: Boolean,
        default: true,
      },
      difficulty: {
        type: String,
        enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
        default: "BEGINNER",
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
        autoCalculate: {
          type: Boolean,
          default: true,
        },
        showErrors: {
          type: Boolean,
          default: true,
        },
      },
    },

    // Learning Progress
    learningProgress: {
      completedSteps: [String],
      currentStep: String,
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      timeSpent: {
        type: Number,
        default: 0,
      },
      attempts: {
        type: Number,
        default: 0,
      },
    },

    // Integration with existing system
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
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate TDS amounts
tdsSimulationSchema.pre("save", function (next) {
  if (this.deductees && this.deductees.length > 0) {
    let totalGrossAmount = 0;
    let totalTdsAmount = 0;
    let totalNetAmount = 0;
    let totalChallanAmount = 0;
    const sectionSummary = {};

    this.deductees.forEach((deductee) => {
      // Calculate TDS amount
      deductee.tdsAmount = (deductee.grossAmount * deductee.tdsRate) / 100;
      deductee.netAmount = deductee.grossAmount - deductee.tdsAmount;

      // Add to totals
      totalGrossAmount += deductee.grossAmount;
      totalTdsAmount += deductee.tdsAmount;
      totalNetAmount += deductee.netAmount;
      totalChallanAmount += deductee.challanAmount || 0;

      // Section-wise summary
      if (!sectionSummary[deductee.section]) {
        sectionSummary[deductee.section] = {
          count: 0,
          grossAmount: 0,
          tdsAmount: 0,
        };
      }
      sectionSummary[deductee.section].count += 1;
      sectionSummary[deductee.section].grossAmount += deductee.grossAmount;
      sectionSummary[deductee.section].tdsAmount += deductee.tdsAmount;
    });

    // Update TDS summary
    this.tdsSummary = {
      totalGrossAmount,
      totalTdsAmount,
      totalNetAmount,
      totalChallanAmount,
      totalDeductees: this.deductees.length,
      sections: Object.keys(sectionSummary).map((section) => ({
        section,
        ...sectionSummary[section],
      })),
    };
  }

  next();
});

// Virtual for determining return type
tdsSimulationSchema.virtual("returnType").get(function () {
  return this.simulationType;
});

// Virtual for determining if it's a return filing
tdsSimulationSchema.virtual("isReturnFiling").get(function () {
  return this.simulationType.includes("RETURN");
});

// Virtual for determining if it's certificate generation
tdsSimulationSchema.virtual("isCertificateGeneration").get(function () {
  return this.simulationType === "TDS_CERTIFICATE";
});

// Virtual for determining if it's challan generation
tdsSimulationSchema.virtual("isChallanGeneration").get(function () {
  return this.simulationType === "TDS_CHALLAN";
});

// Indexes for better performance
tdsSimulationSchema.index({ tan: 1 });
tdsSimulationSchema.index({ simulationType: 1 });
tdsSimulationSchema.index({ financialYear: 1, quarter: 1 });
tdsSimulationSchema.index({ createdBy: 1 });
tdsSimulationSchema.index({ isActive: 1 });

module.exports = mongoose.model("TDSSimulation", tdsSimulationSchema);
