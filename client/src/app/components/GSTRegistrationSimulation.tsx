"use client";

import React, { useState } from "react";
import {
  FaHome,
  FaBars,
  FaSync,
  FaCog,
  FaMoon,
  FaInfoCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaCheckCircle,
  FaPlay,
  FaBuilding,
  FaSearch,
  FaQuestionCircle,
  FaGlobe,
  FaFileAlt,
  FaUpload,
} from "react-icons/fa";

interface RegistrationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isCompleted: boolean;
}

interface FormData {
  businessDetails: {
    businessName: string;
    panNumber: string;
    businessType: string;
    constitutionOfBusiness: string;
    taxpayerType: string;
  };
  addressDetails: {
    businessAddress: {
      street: string;
      city: string;
      state: string;
      pincode: string;
    };
    correspondenceAddress: {
      street: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  businessActivities: {
    primaryActivity: string;
    secondaryActivities: string[];
    hsnCode: string;
    turnover: string;
  };
  authorizedSignatory: {
    name: string;
    designation: string;
    panNumber: string;
    email: string;
    mobile: string;
  };
  documents: {
    panCard: File | null;
    aadharCard: File | null;
    bankStatement: File | null;
    businessProof: File | null;
  };
}

const GSTRegistrationSimulation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState("overview");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    businessDetails: {
      businessName: "",
      panNumber: "",
      businessType: "",
      constitutionOfBusiness: "",
      taxpayerType: "",
    },
    addressDetails: {
      businessAddress: {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
      correspondenceAddress: {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
    },
    bankDetails: {
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
    },
    businessActivities: {
      primaryActivity: "",
      secondaryActivities: [],
      hsnCode: "",
      turnover: "",
    },
    authorizedSignatory: {
      name: "",
      designation: "",
      panNumber: "",
      email: "",
      mobile: "",
    },
    documents: {
      panCard: null,
      aadharCard: null,
      bankStatement: null,
      businessProof: null,
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registrationSteps: RegistrationStep[] = [
    {
      id: "business-details",
      title: "Business Details",
      description: "Enter business information and PAN details",
      icon: <FaBuilding className="text-2xl text-blue-600" />,
      isCompleted: false,
    },
    {
      id: "address-details",
      title: "Address Details",
      description: "Provide business and correspondence address",
      icon: <FaGlobe className="text-2xl text-green-600" />,
      isCompleted: false,
    },
    {
      id: "bank-details",
      title: "Bank Details",
      description: "Enter bank account information",
      icon: <FaFileAlt className="text-2xl text-purple-600" />,
      isCompleted: false,
    },
    {
      id: "business-activities",
      title: "Business Activities",
      description: "Specify business activities and HSN codes",
      icon: <FaSearch className="text-2xl text-orange-600" />,
      isCompleted: false,
    },
    {
      id: "authorized-signatory",
      title: "Authorized Signatory",
      description: "Add authorized signatory details",
      icon: <FaCheckCircle className="text-2xl text-teal-600" />,
      isCompleted: false,
    },
    {
      id: "document-upload",
      title: "Document Upload",
      description: "Upload required documents and certificates",
      icon: <FaUpload className="text-2xl text-red-600" />,
      isCompleted: false,
    },
    {
      id: "verification",
      title: "Verification",
      description: "Verify details and submit application",
      icon: <FaCheckCircle className="text-2xl text-indigo-600" />,
      isCompleted: false,
    },
    {
      id: "gstin-generation",
      title: "GSTIN Generation",
      description: "Generate GSTIN and download certificate",
      icon: <FaFileAlt className="text-2xl text-pink-600" />,
      isCompleted: false,
    },
  ];

  const handleStartSimulation = () => {
    setCurrentStep("steps");
    setActiveStepIndex(0);
  };

  const handleStepClick = (stepId: string) => {
    const stepIndex = registrationSteps.findIndex((step) => step.id === stepId);
    setActiveStepIndex(stepIndex);
    setCurrentStep("steps");
  };

  const handleNextStep = () => {
    if (activeStepIndex < registrationSteps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  const handleInputChange = (
    section: string,
    field: string,
    value: string | object
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof FormData],
        [field]: value,
      },
    }));
  };

  const handleFileUpload = (documentType: string, file: File) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file,
      },
    }));
  };

  const validateCurrentStep = () => {
    const currentStepId = registrationSteps[activeStepIndex].id;
    const newErrors: Record<string, string> = {};

    switch (currentStepId) {
      case "business-details":
        if (!formData.businessDetails.businessName)
          newErrors.businessName = "Business name is required";
        if (!formData.businessDetails.panNumber)
          newErrors.panNumber = "PAN number is required";
        break;
      case "address-details":
        if (!formData.addressDetails.businessAddress.street)
          newErrors.street = "Street address is required";
        if (!formData.addressDetails.businessAddress.city)
          newErrors.city = "City is required";
        break;
      case "bank-details":
        if (!formData.bankDetails.bankName)
          newErrors.bankName = "Bank name is required";
        if (!formData.bankDetails.accountNumber)
          newErrors.accountNumber = "Account number is required";
        break;
      case "business-activities":
        if (!formData.businessActivities.primaryActivity)
          newErrors.primaryActivity = "Primary activity is required";
        if (!formData.businessActivities.hsnCode)
          newErrors.hsnCode = "HSN code is required";
        break;
      case "authorized-signatory":
        if (!formData.authorizedSignatory.name)
          newErrors.name = "Name is required";
        if (!formData.authorizedSignatory.email)
          newErrors.email = "Email is required";
        break;
      case "document-upload":
        if (!formData.documents.panCard)
          newErrors.panCard = "PAN card is required";
        if (!formData.documents.aadharCard)
          newErrors.aadharCard = "Aadhar card is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStepSubmit = () => {
    if (validateCurrentStep()) {
      handleNextStep();
    }
  };

  const generateCertificate = () => {
    // Create a canvas to generate the certificate
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    if (!ctx) return;

    // Background
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = "#28a745";
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Inner border
    ctx.strokeStyle = "#6c757d";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Header
    ctx.fillStyle = "#28a745";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GST REGISTRATION CERTIFICATE", canvas.width / 2, 100);

    // Subtitle
    ctx.fillStyle = "#6c757d";
    ctx.font = "18px Arial";
    ctx.fillText("Government of India", canvas.width / 2, 130);

    // Certificate details
    ctx.fillStyle = "#212529";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";

    const details = [
      `Business Name: ${formData.businessDetails.businessName}`,
      `PAN Number: ${formData.businessDetails.panNumber}`,
      `GSTIN: 22ABCDE1234F1Z5`,
      `Business Type: ${formData.businessDetails.businessType}`,
      `Registration Date: ${new Date().toLocaleDateString("en-IN")}`,
      `Address: ${formData.addressDetails.businessAddress.street}, ${formData.addressDetails.businessAddress.city}`,
      `State: ${formData.addressDetails.businessAddress.state}`,
      `Pincode: ${formData.addressDetails.businessAddress.pincode}`,
    ];

    let y = 200;
    details.forEach((detail) => {
      ctx.fillText(detail, 100, y);
      y += 30;
    });

    // Footer
    ctx.textAlign = "center";
    ctx.fillStyle = "#6c757d";
    ctx.font = "14px Arial";
    ctx.fillText(
      "This certificate is valid for GST registration purposes",
      canvas.width / 2,
      canvas.height - 80
    );
    ctx.fillText(
      "Issued by GST Portal, Government of India",
      canvas.width / 2,
      canvas.height - 50
    );

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `GST_Certificate_${formData.businessDetails.businessName.replace(
          /\s+/g,
          "_"
        )}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, "image/png");
  };

  const renderStepContent = () => {
    const currentStepId = registrationSteps[activeStepIndex].id;

    switch (currentStepId) {
      case "business-details":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.businessDetails.businessName}
                onChange={(e) =>
                  handleInputChange(
                    "businessDetails",
                    "businessName",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter business name"
              />
              {errors.businessName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.businessName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Number *
              </label>
              <input
                type="text"
                value={formData.businessDetails.panNumber}
                onChange={(e) =>
                  handleInputChange(
                    "businessDetails",
                    "panNumber",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter PAN number"
              />
              {errors.panNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type
              </label>
              <select
                value={formData.businessDetails.businessType}
                onChange={(e) =>
                  handleInputChange(
                    "businessDetails",
                    "businessType",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select business type</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="trading">Trading</option>
                <option value="services">Services</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Constitution of Business
              </label>
              <select
                value={formData.businessDetails.constitutionOfBusiness}
                onChange={(e) =>
                  handleInputChange(
                    "businessDetails",
                    "constitutionOfBusiness",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select constitution</option>
                <option value="individual">Individual</option>
                <option value="partnership">Partnership</option>
                <option value="company">Company</option>
                <option value="llp">LLP</option>
                <option value="huf">HUF</option>
              </select>
            </div>
          </div>
        );

      case "address-details":
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Business Address
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.addressDetails.businessAddress.street}
                  onChange={(e) =>
                    handleInputChange("addressDetails", "businessAddress", {
                      ...formData.addressDetails.businessAddress,
                      street: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter street address"
                />
                {errors.street && (
                  <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.addressDetails.businessAddress.city}
                  onChange={(e) =>
                    handleInputChange("addressDetails", "businessAddress", {
                      ...formData.addressDetails.businessAddress,
                      city: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  value={formData.addressDetails.businessAddress.state}
                  onChange={(e) =>
                    handleInputChange("addressDetails", "businessAddress", {
                      ...formData.addressDetails.businessAddress,
                      state: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select state</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="gujarat">Gujarat</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="tamil-nadu">Tamil Nadu</option>
                  <option value="delhi">Delhi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  value={formData.addressDetails.businessAddress.pincode}
                  onChange={(e) =>
                    handleInputChange("addressDetails", "businessAddress", {
                      ...formData.addressDetails.businessAddress,
                      pincode: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter pincode"
                />
              </div>
            </div>
          </div>
        );

      case "bank-details":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              <input
                type="text"
                value={formData.bankDetails.bankName}
                onChange={(e) =>
                  handleInputChange("bankDetails", "bankName", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter bank name"
              />
              {errors.bankName && (
                <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                value={formData.bankDetails.accountNumber}
                onChange={(e) =>
                  handleInputChange(
                    "bankDetails",
                    "accountNumber",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter account number"
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.accountNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code
              </label>
              <input
                type="text"
                value={formData.bankDetails.ifscCode}
                onChange={(e) =>
                  handleInputChange("bankDetails", "ifscCode", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter IFSC code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name
              </label>
              <input
                type="text"
                value={formData.bankDetails.accountHolderName}
                onChange={(e) =>
                  handleInputChange(
                    "bankDetails",
                    "accountHolderName",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter account holder name"
              />
            </div>
          </div>
        );

      case "business-activities":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Activity *
              </label>
              <input
                type="text"
                value={formData.businessActivities.primaryActivity}
                onChange={(e) =>
                  handleInputChange(
                    "businessActivities",
                    "primaryActivity",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter primary business activity"
              />
              {errors.primaryActivity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.primaryActivity}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HSN Code *
              </label>
              <input
                type="text"
                value={formData.businessActivities.hsnCode}
                onChange={(e) =>
                  handleInputChange(
                    "businessActivities",
                    "hsnCode",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter HSN code"
              />
              {errors.hsnCode && (
                <p className="text-red-500 text-sm mt-1">{errors.hsnCode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Annual Turnover
              </label>
              <select
                value={formData.businessActivities.turnover}
                onChange={(e) =>
                  handleInputChange(
                    "businessActivities",
                    "turnover",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select turnover range</option>
                <option value="0-20lakhs">0 - 20 Lakhs</option>
                <option value="20lakhs-1crore">20 Lakhs - 1 Crore</option>
                <option value="1crore-5crore">1 Crore - 5 Crore</option>
                <option value="5crore-above">5 Crore and above</option>
              </select>
            </div>
          </div>
        );

      case "authorized-signatory":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.authorizedSignatory.name}
                onChange={(e) =>
                  handleInputChange(
                    "authorizedSignatory",
                    "name",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation
              </label>
              <input
                type="text"
                value={formData.authorizedSignatory.designation}
                onChange={(e) =>
                  handleInputChange(
                    "authorizedSignatory",
                    "designation",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter designation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.authorizedSignatory.email}
                onChange={(e) =>
                  handleInputChange(
                    "authorizedSignatory",
                    "email",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                value={formData.authorizedSignatory.mobile}
                onChange={(e) =>
                  handleInputChange(
                    "authorizedSignatory",
                    "mobile",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter mobile number"
              />
            </div>
          </div>
        );

      case "document-upload":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Card *
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    e.target.files &&
                    handleFileUpload("panCard", e.target.files[0])
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {errors.panCard && (
                  <p className="text-red-500 text-sm mt-1">{errors.panCard}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhar Card *
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    e.target.files &&
                    handleFileUpload("aadharCard", e.target.files[0])
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {errors.aadharCard && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.aadharCard}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Statement
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    e.target.files &&
                    handleFileUpload("bankStatement", e.target.files[0])
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Proof
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    e.target.files &&
                    handleFileUpload("businessProof", e.target.files[0])
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            </div>
          </div>
        );

      case "verification":
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-green-800 mb-4">
                Review Your Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Name:</span>
                  <span className="font-medium">
                    {formData.businessDetails.businessName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PAN Number:</span>
                  <span className="font-medium">
                    {formData.businessDetails.panNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Type:</span>
                  <span className="font-medium">
                    {formData.businessDetails.businessType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Primary Activity:</span>
                  <span className="font-medium">
                    {formData.businessActivities.primaryActivity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">HSN Code:</span>
                  <span className="font-medium">
                    {formData.businessActivities.hsnCode}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                Please review all the information above. Once you proceed, your
                GST registration application will be submitted for processing.
              </p>
            </div>
          </div>
        );

      case "gstin-generation":
        return (
          <div className="space-y-6 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-green-800 mb-4">
                Registration Successful!
              </h4>
              <p className="text-green-700 mb-6">
                Your GST registration has been processed successfully. Your
                GSTIN will be generated shortly.
              </p>
              <div className="bg-white border border-green-300 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Your GSTIN:</p>
                <p className="text-xl font-bold text-green-600">
                  22ABCDE1234F1Z5
                </p>
              </div>
              <button
                onClick={generateCertificate}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Download Certificate
              </button>
            </div>
          </div>
        );

      default:
        return <div>Step content not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header Bar */}
      <div className="bg-blue-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-900 font-bold text-sm">GST</span>
              </div>
              <h1 className="text-lg font-semibold">GST Registration Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Progress: 50%</span>
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: "50%" }}
                  ></div>
                </div>
              </div>
              <select className="bg-blue-800 text-white border-none rounded px-2 py-1 text-sm">
                <option>Language</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold text-lg">GST</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  GST Registration Portal
                </h2>
                <p className="text-sm text-gray-600">
                  Complete GST registration process
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">
                  New Business Registration
                </p>
                <p className="text-xs text-gray-600">Step-by-step process</p>
              </div>
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-yellow-800 font-bold text-sm">150</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-6 py-3">
            <a href="#" className="hover:text-blue-200 text-sm font-medium">
              Dashboard
            </a>
            <a href="#" className="hover:text-blue-200 text-sm font-medium">
              Registration
            </a>
            <a href="#" className="hover:text-blue-200 text-sm font-medium">
              Amendment
            </a>
            <a href="#" className="hover:text-blue-200 text-sm font-medium">
              Cancellation
            </a>
            <a href="#" className="hover:text-blue-200 text-sm font-medium">
              Help
            </a>
          </nav>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-full w-16 bg-gray-800 text-white z-10">
        <div className="flex flex-col items-center py-4 space-y-6">
          <FaHome className="text-xl hover:text-blue-400 cursor-pointer" />
          <FaBars className="text-xl hover:text-blue-400 cursor-pointer" />
          <FaSync className="text-xl hover:text-blue-400 cursor-pointer" />
          <FaCog className="text-xl hover:text-blue-400 cursor-pointer" />
          <FaMoon className="text-xl hover:text-blue-400 cursor-pointer" />
          <FaInfoCircle className="text-xl hover:text-blue-400 cursor-pointer" />
          <FaExclamationTriangle className="text-xl hover:text-blue-400 cursor-pointer" />
          <FaArrowRight className="text-xl hover:text-blue-400 cursor-pointer" />
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <nav className="text-sm text-gray-600">
              <span>Dashboard</span>
              <span className="mx-2">&gt;</span>
              <span>Registration</span>
              <span className="mx-2">&gt;</span>
              <span className="text-gray-800 font-medium">
                New Registration
              </span>
            </nav>
          </div>

          {/* Experiment Instructions */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-teal-800 mb-2">
                  GST Registration Process
                </h3>
                <p className="text-teal-700 mb-4">
                  Complete GST registration step by step.
                </p>
                <p className="text-teal-600 font-medium">
                  Experiment 5 - Learn GST registration process.
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center">
                  <FaQuestionCircle className="mr-2" />
                  HELP
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
                  <FaSync />
                </button>
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Registration Overview
            </h3>
            <p className="text-gray-600 mb-6">
              Follow these steps to complete your GST registration process.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Required Documents
                </h4>
                <div className="text-3xl font-bold text-blue-600">6</div>
                <p className="text-sm text-blue-600">Documents needed</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">
                  Processing Time
                </h4>
                <div className="text-3xl font-bold text-green-600">3-7</div>
                <p className="text-sm text-green-600">Working days</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">
                  Registration Fee
                </h4>
                <div className="text-3xl font-bold text-purple-600">₹0</div>
                <p className="text-sm text-purple-600">No fee required</p>
              </div>
            </div>
          </div>

          {/* Start Simulation Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleStartSimulation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center mx-auto"
            >
              <FaPlay className="mr-2" />
              Start Registration Simulation
            </button>
          </div>

          {/* Registration Steps */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FaBuilding className="mr-2 text-blue-600" />
              Registration Steps
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrationSteps.map((step, index) => (
                <div
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className={`bg-white border-2 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer group ${
                    activeStepIndex === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="mb-4">{step.icon}</div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 ${
                        activeStepIndex === index
                          ? "bg-blue-500"
                          : "bg-blue-100"
                      }`}
                    >
                      <span
                        className={`font-bold text-sm ${
                          activeStepIndex === index
                            ? "text-white"
                            : "text-blue-600"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </div>
                    <h4
                      className={`text-lg font-bold mb-2 group-hover:text-blue-600 ${
                        activeStepIndex === index
                          ? "text-blue-600"
                          : "text-gray-800"
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {step.description}
                    </p>
                    <div className="flex items-center justify-center">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Ready</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Step Forms */}
          {currentStep === "steps" && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  {registrationSteps[activeStepIndex].icon}
                  <span className="ml-2">
                    {registrationSteps[activeStepIndex].title}
                  </span>
                </h3>
                <div className="text-sm text-gray-600">
                  Step {activeStepIndex + 1} of {registrationSteps.length}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((activeStepIndex + 1) / registrationSteps.length) * 100
                    }%`,
                  }}
                ></div>
              </div>

              {/* Step Content */}
              <div className="mb-6">{renderStepContent()}</div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevStep}
                  disabled={activeStepIndex === 0}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    activeStepIndex === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-600 text-white hover:bg-gray-700"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleStepSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {activeStepIndex === registrationSteps.length - 1
                    ? "Complete"
                    : "Next"}
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200">
              <FaBuilding className="text-3xl text-blue-600 mx-auto mb-3" />
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                Business Details
              </h4>
              <p className="text-gray-600">Enter business information</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200">
              <FaUpload className="text-3xl text-green-600 mx-auto mb-3" />
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                Document Upload
              </h4>
              <p className="text-gray-600">Upload required documents</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200">
              <FaCheckCircle className="text-3xl text-purple-600 mx-auto mb-3" />
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                Verification
              </h4>
              <p className="text-gray-600">Verify and submit application</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200">
              <FaFileAlt className="text-3xl text-orange-600 mx-auto mb-3" />
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                GSTIN Generation
              </h4>
              <p className="text-gray-600">Get your GSTIN certificate</p>
            </div>
          </div>

          {/* Accessibility Options */}
          <div className="fixed top-4 right-4 flex items-center space-x-2 bg-white rounded-lg shadow-md p-2">
            <a
              href="#main-content"
              className="text-sm text-blue-600 hover:underline"
            >
              Skip to Main Content
            </a>
            <div className="flex items-center space-x-1">
              <button className="text-sm font-bold text-gray-600 hover:text-gray-800">
                A+
              </button>
              <button className="text-sm font-bold text-gray-600 hover:text-gray-800">
                A-
              </button>
            </div>
            <select className="text-sm border-none bg-transparent">
              <option>English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSTRegistrationSimulation;
