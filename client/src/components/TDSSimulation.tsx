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
  FaMoneyBillWave,
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

interface TDSFormData {
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

interface TDSSimulationProps {
  simulationType:
    | "TDS_RETURN_24Q"
    | "TDS_RETURN_26Q"
    | "TDS_CERTIFICATE"
    | "TDS_CHALLAN";
  title: string;
  description: string;
  steps: Array<{ id: string; title: string; completed: boolean }>;
  onSave?: (data: TDSFormData) => void;
  onSubmit?: (data: TDSFormData) => void;
}

const TDSSimulation: React.FC<TDSSimulationProps> = ({
  simulationType,
  title,
  description,
  steps,
  onSave,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState("deductor");
  const [isRunning, setIsRunning] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showHints, setShowHints] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [simulationData, setSimulationData] = useState<TDSFormData>({
    simulationType,
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
    simulationConfig: {
      difficulty: "BEGINNER",
      hints: [],
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

  const tdsSections = [
    {
      code: "194A",
      description: "Interest other than interest on securities",
      rate: 10,
    },
    {
      code: "194B",
      description: "Winnings from lottery or crossword puzzle",
      rate: 30,
    },
    { code: "194C", description: "Payment to contractors", rate: 1 },
    { code: "194D", description: "Insurance commission", rate: 10 },
    {
      code: "194E",
      description: "Payment to non-resident sportsmen",
      rate: 20,
    },
    {
      code: "194F",
      description: "Payment on account of repurchase of units",
      rate: 20,
    },
    {
      code: "194G",
      description: "Commission on sale of lottery tickets",
      rate: 5,
    },
    { code: "194H", description: "Commission or brokerage", rate: 5 },
    { code: "194I", description: "Rent", rate: 10 },
    {
      code: "194J",
      description: "Fees for professional or technical services",
      rate: 10,
    },
    { code: "194K", description: "Income in respect of units", rate: 10 },
    {
      code: "194L",
      description: "Compensation on acquisition of capital asset",
      rate: 10,
    },
    {
      code: "194LA",
      description:
        "Payment of compensation on acquisition of certain immovable property",
      rate: 10,
    },
    {
      code: "194LB",
      description: "Interest on infrastructure debt fund",
      rate: 5,
    },
    {
      code: "194LC",
      description: "Interest on loan in foreign currency",
      rate: 5,
    },
    {
      code: "194LD",
      description: "Interest on rupee denominated bond",
      rate: 5,
    },
    {
      code: "194M",
      description: "Payment of certain sum by individual or HUF",
      rate: 5,
    },
    {
      code: "194N",
      description: "Payment of certain amounts in cash",
      rate: 2,
    },
    {
      code: "194O",
      description: "Payment of certain sums by e-commerce operator",
      rate: 1,
    },
    {
      code: "194P",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194Q",
      description: "Payment of certain sums for purchase of goods",
      rate: 0.1,
    },
    {
      code: "194R",
      description: "Benefit or perquisite in respect of business or profession",
      rate: 10,
    },
    {
      code: "194S",
      description: "Payment for transfer of virtual digital asset",
      rate: 1,
    },
    {
      code: "194T",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194U",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194V",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194W",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194X",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194Y",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194Z",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194ZA",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194ZB",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194ZC",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194ZD",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194ZE",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194ZF",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194ZG",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194ZH",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194ZI",
      description: "Payment of certain sums by specified person",
      rate: 10,
    },
    {
      code: "194ZJ",
      description: "Payment of certain sums by specified person",
      rate: 10,
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

          // Auto-set TDS rate based on section
          if (field === "section") {
            const selectedSection = tdsSections.find((s) => s.code === value);
            if (selectedSection) {
              updatedDeductee.tdsRate = selectedSection.rate;
              updatedDeductee.tdsAmount =
                (updatedDeductee.grossAmount * selectedSection.rate) / 100;
              updatedDeductee.netAmount =
                updatedDeductee.grossAmount - updatedDeductee.tdsAmount;
            }
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

  const saveProgress = () => {
    if (onSave) {
      onSave(simulationData);
    }
  };

  const submitForm = () => {
    if (onSubmit) {
      onSubmit(simulationData);
    }

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
          Enter the details of the person/entity deducting tax at source
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
          Add details of persons from whom tax has been deducted
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
                <select
                  value={deductee.section}
                  onChange={(e) =>
                    updateDeductee(deductee.id, "section", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {tdsSections.map((section) => (
                    <option key={section.code} value={section.code}>
                      {section.code} - {section.description}
                    </option>
                  ))}
                </select>
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

  const renderTDSSummaryStep = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          TDS Calculation Summary
        </h3>
        <p className="text-purple-700 text-sm">
          Review the calculated TDS amounts and totals
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Summary</h4>
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

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Deductee Details
        </h4>
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
                  TDS Rate
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
                    {deductee.tdsRate}%
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
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "deductor":
        return renderDeductorStep();
      case "deductees":
        return renderDeducteesStep();
      case "tds-calculation":
        return renderTDSSummaryStep();
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
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600">{description}</p>
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
                  <button
                    onClick={saveProgress}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <FaSave className="mr-2" />
                    Save Progress
                  </button>
                </div>

                <button
                  onClick={nextStep}
                  disabled={currentStep === "tds-calculation"}
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

export default TDSSimulation;
