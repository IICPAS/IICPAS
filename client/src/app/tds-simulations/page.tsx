"use client";

import React from "react";
import Link from "next/link";
import {
  FaFileInvoice,
  FaPlay,
  FaDesktop,
  FaCalculator,
  FaGraduationCap,
  FaCog,
  FaBuilding,
  FaChartLine,
  FaFileAlt,
  FaReceipt,
  FaSearch,
  FaCertificate,
  FaMoneyBillWave,
  FaFileContract,
  FaChartBar,
} from "react-icons/fa";

export default function TDSSimulationsPage() {
  const simulations = [
    {
      id: "tds-24q",
      title: "TDS 24Q Return Filing",
      description:
        "Quarterly return for tax deducted at source on salaries and other payments",
      icon: <FaFileAlt className="text-4xl text-blue-600" />,
      route: "/tds-simulations/tds-24q",
      features: [
        "Salary TDS",
        "Professional Fees",
        "Interest Payments",
        "Rent Payments",
        "Commission",
        "Other Payments",
      ],
      difficulty: "Intermediate",
      duration: "45 mins",
    },
    {
      id: "tds-26q",
      title: "TDS 26Q Return Filing",
      description:
        "Quarterly return for tax deducted at source on non-salary payments",
      icon: <FaReceipt className="text-4xl text-green-600" />,
      route: "/tds-simulations/tds-26q",
      features: [
        "Contractor Payments",
        "Professional Services",
        "Interest on Securities",
        "Dividend Payments",
        "Rent Payments",
        "Commission",
      ],
      difficulty: "Advanced",
      duration: "60 mins",
    },
    {
      id: "tds-certificate",
      title: "TDS Certificate Generation",
      description: "Generate Form 16/16A certificates for deductees",
      icon: <FaCertificate className="text-4xl text-purple-600" />,
      route: "/tds-simulations/certificate",
      features: [
        "Form 16 Generation",
        "Form 16A Generation",
        "Certificate Validation",
        "Digital Signatures",
        "PDF Generation",
        "Email Delivery",
      ],
      difficulty: "Beginner",
      duration: "30 mins",
    },
    {
      id: "tds-challan",
      title: "TDS Challan Generation",
      description: "Generate challans for TDS payment to government",
      icon: <FaMoneyBillWave className="text-4xl text-orange-600" />,
      route: "/tds-simulations/challan",
      features: [
        "Challan 281",
        "Bank Payment",
        "Online Payment",
        "Payment Verification",
        "Receipt Generation",
        "Status Tracking",
      ],
      difficulty: "Beginner",
      duration: "25 mins",
    },
    {
      id: "tds-compliance",
      title: "TDS Compliance Portal",
      description: "Check TDS compliance status and generate reports",
      icon: <FaChartBar className="text-4xl text-indigo-600" />,
      route: "/tds-simulations/compliance",
      features: [
        "Compliance Status",
        "Due Date Tracking",
        "Penalty Calculation",
        "Report Generation",
        "Status Monitoring",
        "Alerts & Notifications",
      ],
      difficulty: "Intermediate",
      duration: "40 mins",
    },
    {
      id: "tds-search",
      title: "TDS Search Portal",
      description: "Search TDS details by PAN, TAN, and other parameters",
      icon: <FaSearch className="text-4xl text-teal-600" />,
      route: "/tds-simulations/search",
      features: [
        "PAN Search",
        "TAN Search",
        "Certificate Search",
        "Payment Search",
        "Status Verification",
        "History Tracking",
      ],
      difficulty: "Beginner",
      duration: "20 mins",
    },
  ];

  const stats = [
    {
      title: "Total Simulations",
      value: "6",
      icon: <FaDesktop className="text-2xl text-blue-600" />,
    },
    {
      title: "Active Users",
      value: "1,250+",
      icon: <FaGraduationCap className="text-2xl text-green-600" />,
    },
    {
      title: "Success Rate",
      value: "92%",
      icon: <FaChartLine className="text-2xl text-purple-600" />,
    },
    {
      title: "Avg. Score",
      value: "85/100",
      icon: <FaCalculator className="text-2xl text-orange-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  TDS Simulations Portal
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  Master Tax Deduction at Source through interactive simulations
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 px-4 py-2 rounded-lg">
                  <span className="text-blue-800 font-medium">
                    Real-time Practice
                  </span>
                </div>
                <div className="bg-green-100 px-4 py-2 rounded-lg">
                  <span className="text-green-800 font-medium">
                    Expert Guidance
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">{stat.icon}</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Simulations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulations.map((simulation) => (
            <div
              key={simulation.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-shrink-0">{simulation.icon}</div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {simulation.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {simulation.description}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {simulation.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {feature}
                      </span>
                    ))}
                    {simulation.features.length > 3 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{simulation.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaGraduationCap className="mr-1" />
                      <span>{simulation.difficulty}</span>
                    </div>
                    <div className="flex items-center">
                      <FaPlay className="mr-1" />
                      <span>{simulation.duration}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={simulation.route}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-medium"
                >
                  <FaPlay className="mr-2" />
                  Start Simulation
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Why Choose TDS Simulations?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaBuilding className="text-2xl text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Real Portal Experience
                </h3>
                <p className="text-gray-600">
                  Practice on interfaces that mirror the actual TDS portal
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaCalculator className="text-2xl text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Auto Calculations
                </h3>
                <p className="text-gray-600">
                  Automatic TDS calculations with real-time validation
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaGraduationCap className="text-2xl text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Progressive Learning
                </h3>
                <p className="text-gray-600">
                  Start with basics and advance to complex scenarios
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaChartLine className="text-2xl text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Performance Tracking
                </h3>
                <p className="text-gray-600">
                  Monitor your progress with detailed analytics
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaCog className="text-2xl text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Multiple Scenarios
                </h3>
                <p className="text-gray-600">
                  Practice with various TDS scenarios and edge cases
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaFileContract className="text-2xl text-teal-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Compliance Focus
                </h3>
                <p className="text-gray-600">
                  Learn TDS compliance requirements and best practices
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Master TDS?</h2>
          <p className="text-lg mb-6 opacity-90">
            Start your journey with our comprehensive TDS simulation platform
          </p>
          <Link
            href="/tds-simulations/tds-24q"
            className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            <FaPlay className="mr-2" />
            Start Learning Now
          </Link>
        </div>
      </div>
    </div>
  );
}
