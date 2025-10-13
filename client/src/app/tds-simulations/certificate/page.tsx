"use client";

import React, { useState, useEffect } from "react";
import {
  FaSave,
  FaFileAlt,
  FaCalculator,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaPlay,
  FaPause,
  FaStop,
  FaDownload,
  FaUpload,
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaArrowRight,
  FaCertificate,
  FaPrint,
  FaEye,
} from "react-icons/fa";

interface Deductee {
  id: string;
  pan: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  section: string;
  grossAmount: number;
  tdsRate: number;
  tdsAmount: number;
  netAmount: number;
  paymentDate: string;
  challanNumber: string;
  challanDate: string;
  challanAmount: number;
  isCompleted: boolean;
}

interface TDSCertificateData {
  simulationType: string;
  financialYear: string;
  quarter: string;
  period: string;
  tan: string;
  deductor: {
    name: string;
    tan: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    contact: {
      phone: string;
      email: string;
    };
    pan: string;
  };
  deductees: Deductee[];
  tdsSummary: {
    totalGrossAmount: number;
    totalTdsAmount: number;
    totalNetAmount: number;
    totalChallanAmount: number;
    totalDeductees: number;
  };
  certificateDetails: {
    certificateNumber: string;
    certificateDate: string;
    periodFrom: string;
    periodTo: string;
    totalTdsAmount: number;
    totalIncome: number;
    status: string;
  };
  simulationConfig: {
    difficulty: string;
    hints: Array<{ field: string; hint: string; order: number }>;
    validationRules: {
      requiredFields: string[];
      autoCalculate: boolean;
      showErrors: boolean;
    };
  };
  learningProgress: {
    completedSteps: string[];
    currentStep: string;
    score: number;
    timeSpent: number;
    attempts: number;
  };
}

const TDSCertificateSimulation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState("deductor");
  const [isRunning, setIsRunning] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showHints, setShowHints] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [certificateType, setCertificateType] = useState("form16");

  const [simulationData, setSimulationData] = useState<TDSCertificateData>({
    simulationType: "TDS_CERTIFICATE",
    financialYear: "2024-25",
    quarter: "Q1",
    period: "April",
    tan: "",
    deductor: {
      name: "",
      tan: "",
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      },
      contact: {
        phone: "",
        email: "",
      },
      pan: "",
    },
    deductees: [],
    tdsSummary: {
      totalGrossAmount: 0,
      totalTdsAmount: 0,
      totalNetAmount: 0,
      totalChallanAmount: 0,
      totalDeductees: 0,
    },
    certificateDetails: {
      certificateNumber: "",
      certificateDate: "",
      periodFrom: "",
      periodTo: "",
      totalTdsAmount: 0,
      totalIncome: 0,
      status: "DRAFT",
    },
    simulationConfig: {
      difficulty: "BEGINNER",
      hints: [
        {
          field: "tan",
          hint: "TAN format: AAAA12345A (4 letters, 5 digits, 1 letter)",
          order: 1,
        },
        {
          field: "pan",
          hint: "PAN format: AAAAA1234A (5 letters, 4 digits, 1 letter)",
          order: 2,
        },
        {
          field: "certificateType",
          hint: "Form 16 for salary, Form 16A for non-salary payments",
          order: 3,
        },
        {
          field: "period",
          hint: "Certificate period should match the financial year",
          order: 4,
        },
      ],
      validationRules: {
        requiredFields: ["tan", "deductor.name", "deductor.pan"],
        autoCalculate: true,
        showErrors: true,
      },
    },
    learningProgress: {
      completedSteps: [],
      currentStep: "deductor",
      score: 0,
      timeSpent: 0,
      attempts: 0,
    },
  });

  const steps = [
    { id: "deductor", title: "Deductor Details", completed: false },
    { id: "deductees", title: "Deductee Details", completed: false },
    { id: "certificate", title: "Certificate Details", completed: false },
    { id: "preview", title: "Preview & Generate", completed: false },
  ];

  const certificateTypes = [
    {
      value: "form16",
      label: "Form 16 (Salary)",
      description: "For salary payments",
    },
    {
      value: "form16a",
      label: "Form 16A (Non-Salary)",
      description: "For non-salary payments",
    },
  ];

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const validateField = (field: string, value: string): boolean => {
    switch (field) {
      case "tan":
        return /^[A-Z]{4}[0-9]{5}[A-Z]$/.test(value);
      case "pan":
        return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value);
      case "pincode":
        return /^[1-9][0-9]{5}$/.test(value);
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "phone":
        return /^[6-9]\d{9}$/.test(value);
      default:
        return true;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const isValid = validateField(field, value);

    if (
      !isValid &&
      simulationData.simulationConfig.validationRules.showErrors
    ) {
      setErrors((prev) => ({ ...prev, [field]: `Invalid ${field} format` }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    if (field.startsWith("deductor.")) {
      const deductorField = field.split(".")[1];
      setSimulationData((prev) => ({
        ...prev,
        deductor: {
          ...prev.deductor,
          [deductorField]: value,
        },
      }));
    } else if (field.startsWith("certificateDetails.")) {
      const certField = field.split(".")[1];
      setSimulationData((prev) => ({
        ...prev,
        certificateDetails: {
          ...prev.certificateDetails,
          [certField]: value,
        },
      }));
    } else {
      setSimulationData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addDeductee = () => {
    const newDeductee: Deductee = {
      id: Date.now().toString(),
      pan: "",
      name: "",
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
      contact: {
        phone: "",
        email: "",
      },
      section: "194A",
      grossAmount: 0,
      tdsRate: 10,
      tdsAmount: 0,
      netAmount: 0,
      paymentDate: "",
      challanNumber: "",
      challanDate: "",
      challanAmount: 0,
      isCompleted: false,
    };

    setSimulationData((prev) => ({
      ...prev,
      deductees: [...prev.deductees, newDeductee],
    }));
  };

  const updateDeductee = (id: string, field: string, value: any) => {
    setSimulationData((prev) => ({
      ...prev,
      deductees: prev.deductees.map((deductee) => {
        if (deductee.id === id) {
          const updatedDeductee = { ...deductee };

          if (field.includes(".")) {
            const [parent, child] = field.split(".");
            updatedDeductee[parent as keyof Deductee] = {
              ...(updatedDeductee[parent as keyof Deductee] as any),
              [child]: value,
            };
          } else {
            updatedDeductee[field as keyof Deductee] = value;
          }

          // Auto-calculate TDS amounts
          if (field === "grossAmount" || field === "tdsRate") {
            updatedDeductee.tdsAmount =
              (updatedDeductee.grossAmount * updatedDeductee.tdsRate) / 100;
            updatedDeductee.netAmount =
              updatedDeductee.grossAmount - updatedDeductee.tdsAmount;
          }

          return updatedDeductee;
        }
        return deductee;
      }),
    }));
  };

  const removeDeductee = (id: string) => {
    setSimulationData((prev) => ({
      ...prev,
      deductees: prev.deductees.filter((deductee) => deductee.id !== id),
    }));
  };

  const calculateTDSSummary = () => {
    const summary = simulationData.deductees.reduce(
      (acc, deductee) => ({
        totalGrossAmount: acc.totalGrossAmount + deductee.grossAmount,
        totalTdsAmount: acc.totalTdsAmount + deductee.tdsAmount,
        totalNetAmount: acc.totalNetAmount + deductee.netAmount,
        totalChallanAmount: acc.totalChallanAmount + deductee.challanAmount,
        totalDeductees: acc.totalDeductees + 1,
      }),
      {
        totalGrossAmount: 0,
        totalTdsAmount: 0,
        totalNetAmount: 0,
        totalChallanAmount: 0,
        totalDeductees: 0,
      }
    );

    setSimulationData((prev) => ({
      ...prev,
      tdsSummary: summary,
      certificateDetails: {
        ...prev.certificateDetails,
        totalTdsAmount: summary.totalTdsAmount,
        totalIncome: summary.totalGrossAmount,
      },
    }));
  };

  useEffect(() => {
    calculateTDSSummary();
  }, [simulationData.deductees]);

  const nextStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const startSimulation = () => {
    setIsRunning(true);
    setSimulationData((prev) => ({
      ...prev,
      learningProgress: {
        ...prev.learningProgress,
        attempts: prev.learningProgress.attempts + 1,
      },
    }));
  };

  const pauseSimulation = () => {
    setIsRunning(false);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    setSimulationData((prev) => ({
      ...prev,
      learningProgress: {
        ...prev.learningProgress,
        timeSpent: prev.learningProgress.timeSpent + timeSpent,
      },
    }));
  };

  const generateCertificate = () => {
    const certificateNumber = `TDS${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    setSimulationData((prev) => ({
      ...prev,
      certificateDetails: {
        ...prev.certificateDetails,
        certificateNumber,
        certificateDate: new Date().toISOString().split("T")[0],
        status: "GENERATED",
      },
    }));

    // Calculate score based on completion
    const completedFields = Object.keys(simulationData.deductor).filter(
      (key) =>
        simulationData.deductor[key as keyof typeof simulationData.deductor]
    ).length;

    const score = Math.min(100, (completedFields / 8) * 100);

    setSimulationData((prev) => ({
      ...prev,
      learningProgress: {
        ...prev.learningProgress,
        score: Math.max(prev.learningProgress.score, score),
        completedSteps: [...prev.learningProgress.completedSteps, currentStep],
      },
    }));
  };

  const renderDeductorStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Deductor Details
        </h3>
        <p className="text-blue-700 text-sm">
          Enter the details of the person/entity issuing the TDS certificate
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TAN Number *
          </label>
          <input
            type="text"
            value={simulationData.tan}
            onChange={(e) => handleInputChange("tan", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.tan ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="AAAA12345A"
            maxLength={10}
          />
          {errors.tan && (
            <p className="text-red-500 text-xs mt-1">{errors.tan}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deductor Name *
          </label>
          <input
            type="text"
            value={simulationData.deductor.name}
            onChange={(e) => handleInputChange("deductor.name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter deductor name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PAN Number *
          </label>
          <input
            type="text"
            value={simulationData.deductor.pan}
            onChange={(e) => handleInputChange("deductor.pan", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors["deductor.pan"] ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="AAAAA1234A"
            maxLength={10}
          />
          {errors["deductor.pan"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["deductor.pan"]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={simulationData.deductor.contact.email}
            onChange={(e) =>
              handleInputChange("deductor.contact.email", e.target.value)
            }
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors["deductor.contact.email"]
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="email@example.com"
          />
          {errors["deductor.contact.email"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["deductor.contact.email"]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={simulationData.deductor.contact.phone}
            onChange={(e) =>
              handleInputChange("deductor.contact.phone", e.target.value)
            }
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors["deductor.contact.phone"]
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="9876543210"
            maxLength={10}
          />
          {errors["deductor.contact.phone"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["deductor.contact.phone"]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <select
            value={simulationData.deductor.address.state}
            onChange={(e) =>
              handleInputChange("deductor.address.state", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            value={simulationData.deductor.address.street}
            onChange={(e) =>
              handleInputChange("deductor.address.street", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter complete address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={simulationData.deductor.address.city}
            onChange={(e) =>
              handleInputChange("deductor.address.city", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter city"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode
          </label>
          <input
            type="text"
            value={simulationData.deductor.address.pincode}
            onChange={(e) =>
              handleInputChange("deductor.address.pincode", e.target.value)
            }
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors["deductor.address.pincode"]
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="123456"
            maxLength={6}
          />
          {errors["deductor.address.pincode"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["deductor.address.pincode"]}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderDeducteesStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Deductee Details
        </h3>
        <p className="text-green-700 text-sm">
          Add details of persons for whom TDS certificate is being generated
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-900">
          Deductees ({simulationData.deductees.length})
        </h4>
        <button
          onClick={addDeductee}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Deductee
        </button>
      </div>

      <div className="space-y-4">
        {simulationData.deductees.map((deductee, index) => (
          <div
            key={deductee.id}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-semibold text-gray-900">
                Deductee {index + 1}
              </h5>
              <button
                onClick={() => removeDeductee(deductee.id)}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Number *
                </label>
                <input
                  type="text"
                  value={deductee.pan}
                  onChange={(e) =>
                    updateDeductee(deductee.id, "pan", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="AAAAA1234A"
                  maxLength={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={deductee.name}
                  onChange={(e) =>
                    updateDeductee(deductee.id, "name", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter deductee name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section *
                </label>
                <input
                  type="text"
                  value={deductee.section}
                  onChange={(e) =>
                    updateDeductee(deductee.id, "section", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="194A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gross Amount *
                </label>
                <input
                  type="number"
                  value={deductee.grossAmount}
                  onChange={(e) =>
                    updateDeductee(
                      deductee.id,
                      "grossAmount",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TDS Rate (%)
                </label>
                <input
                  type="number"
                  value={deductee.tdsRate}
                  onChange={(e) =>
                    updateDeductee(
                      deductee.id,
                      "tdsRate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TDS Amount
                </label>
                <input
                  type="number"
                  value={deductee.tdsAmount.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Net Amount
                </label>
                <input
                  type="number"
                  value={deductee.netAmount.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date *
                </label>
                <input
                  type="date"
                  value={deductee.paymentDate}
                  onChange={(e) =>
                    updateDeductee(deductee.id, "paymentDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Challan Number
                </label>
                <input
                  type="text"
                  value={deductee.challanNumber}
                  onChange={(e) =>
                    updateDeductee(deductee.id, "challanNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter challan number"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCertificateStep = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          Certificate Details
        </h3>
        <p className="text-purple-700 text-sm">
          Configure the TDS certificate details and period
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certificate Type *
          </label>
          <select
            value={certificateType}
            onChange={(e) => setCertificateType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {certificateTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label} - {type.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Financial Year *
          </label>
          <input
            type="text"
            value={simulationData.financialYear}
            onChange={(e) => handleInputChange("financialYear", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="2024-25"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Period From *
          </label>
          <input
            type="date"
            value={simulationData.certificateDetails.periodFrom}
            onChange={(e) =>
              handleInputChange("certificateDetails.periodFrom", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Period To *
          </label>
          <input
            type="date"
            value={simulationData.certificateDetails.periodTo}
            onChange={(e) =>
              handleInputChange("certificateDetails.periodTo", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certificate Date *
          </label>
          <input
            type="date"
            value={simulationData.certificateDetails.certificateDate}
            onChange={(e) =>
              handleInputChange(
                "certificateDetails.certificateDate",
                e.target.value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={simulationData.certificateDetails.status}
            onChange={(e) =>
              handleInputChange("certificateDetails.status", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="DRAFT">Draft</option>
            <option value="GENERATED">Generated</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          TDS Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">
              Total Gross Amount
            </p>
            <p className="text-2xl font-bold text-blue-900">
              ₹{simulationData.tdsSummary.totalGrossAmount.toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">
              Total TDS Amount
            </p>
            <p className="text-2xl font-bold text-green-900">
              ₹{simulationData.tdsSummary.totalTdsAmount.toFixed(2)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">
              Total Net Amount
            </p>
            <p className="text-2xl font-bold text-purple-900">
              ₹{simulationData.tdsSummary.totalNetAmount.toFixed(2)}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-orange-600 font-medium">
              Total Deductees
            </p>
            <p className="text-2xl font-bold text-orange-900">
              {simulationData.tdsSummary.totalDeductees}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Certificate Preview
        </h3>
        <p className="text-green-700 text-sm">
          Review the TDS certificate before generation
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {certificateType === "form16" ? "FORM 16" : "FORM 16A"}
          </h2>
          <p className="text-gray-600">Certificate of Tax Deducted at Source</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Deductor Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {simulationData.deductor.name}
              </p>
              <p>
                <span className="font-medium">TAN:</span> {simulationData.tan}
              </p>
              <p>
                <span className="font-medium">PAN:</span>{" "}
                {simulationData.deductor.pan}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {simulationData.deductor.address.street}
              </p>
              <p>
                <span className="font-medium">City:</span>{" "}
                {simulationData.deductor.address.city}
              </p>
              <p>
                <span className="font-medium">State:</span>{" "}
                {simulationData.deductor.address.state}
              </p>
              <p>
                <span className="font-medium">Pincode:</span>{" "}
                {simulationData.deductor.address.pincode}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Certificate Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Certificate Number:</span>{" "}
                {simulationData.certificateDetails.certificateNumber || "TBD"}
              </p>
              <p>
                <span className="font-medium">Certificate Date:</span>{" "}
                {simulationData.certificateDetails.certificateDate}
              </p>
              <p>
                <span className="font-medium">Financial Year:</span>{" "}
                {simulationData.financialYear}
              </p>
              <p>
                <span className="font-medium">Period From:</span>{" "}
                {simulationData.certificateDetails.periodFrom}
              </p>
              <p>
                <span className="font-medium">Period To:</span>{" "}
                {simulationData.certificateDetails.periodTo}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {simulationData.certificateDetails.status}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            TDS Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">
                Total Gross Amount
              </p>
              <p className="text-xl font-bold text-blue-900">
                ₹{simulationData.tdsSummary.totalGrossAmount.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">
                Total TDS Amount
              </p>
              <p className="text-xl font-bold text-green-900">
                ₹{simulationData.tdsSummary.totalTdsAmount.toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">
                Total Net Amount
              </p>
              <p className="text-xl font-bold text-purple-900">
                ₹{simulationData.tdsSummary.totalNetAmount.toFixed(2)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-600 font-medium">
                Total Deductees
              </p>
              <p className="text-xl font-bold text-orange-900">
                {simulationData.tdsSummary.totalDeductees}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Deductee Details
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PAN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Section
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TDS Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {simulationData.deductees.map((deductee, index) => (
                  <tr key={deductee.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deductee.pan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deductee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deductee.section}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{deductee.grossAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{deductee.tdsAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{deductee.netAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={generateCertificate}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
          >
            <FaCertificate className="mr-2" />
            Generate Certificate
          </button>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
            <FaPrint className="mr-2" />
            Print Certificate
          </button>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center">
            <FaDownload className="mr-2" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "deductor":
        return renderDeductorStep();
      case "deductees":
        return renderDeducteesStep();
      case "certificate":
        return renderCertificateStep();
      case "preview":
        return renderPreviewStep();
      default:
        return renderDeductorStep();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  TDS Certificate Generation Simulation
                </h1>
                <p className="text-sm text-gray-600">
                  Practice generating Form 16/16A TDS certificates
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={startSimulation}
                    disabled={isRunning}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    <FaPlay className="mr-2" />
                    Start
                  </button>
                  <button
                    onClick={pauseSimulation}
                    disabled={!isRunning}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center"
                  >
                    <FaPause className="mr-2" />
                    Pause
                  </button>
                  <button
                    onClick={stopSimulation}
                    disabled={!isRunning}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                  >
                    <FaStop className="mr-2" />
                    Stop
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Time: {Math.floor(timeSpent / 60)}:
                  {(timeSpent % 60).toString().padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Progress
              </h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                      currentStep === step.id
                        ? "bg-blue-100 text-blue-900"
                        : step.completed
                        ? "bg-green-100 text-green-900"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div className="flex-shrink-0 mr-3">
                      {step.completed ? (
                        <FaCheck className="text-green-600" />
                      ) : currentStep === step.id ? (
                        <FaPlay className="text-blue-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{step.title}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Simulation Stats
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Score: {simulationData.learningProgress.score}/100</p>
                  <p>
                    Time: {Math.floor(timeSpent / 60)}:
                    {(timeSpent % 60).toString().padStart(2, "0")}
                  </p>
                  <p>Attempts: {simulationData.learningProgress.attempts}</p>
                </div>
              </div>

              {showHints && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Hints
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {simulationData.simulationConfig.hints.map(
                      (hint, index) => (
                        <div key={index} className="flex items-start">
                          <FaInfoCircle className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <p>{hint.hint}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {renderCurrentStep()}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  disabled={currentStep === "deductor"}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <FaArrowLeft className="mr-2" />
                  Previous
                </button>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <FaInfoCircle className="mr-2" />
                    {showHints ? "Hide" : "Show"} Hints
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
                    <FaSave className="mr-2" />
                    Save Progress
                  </button>
                </div>

                <button
                  onClick={nextStep}
                  disabled={currentStep === "preview"}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Next
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TDSCertificateSimulation;
