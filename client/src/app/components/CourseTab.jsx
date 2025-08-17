"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CourseTab() {
  const [studentId, setStudentId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastAccessedCourse, setLastAccessedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showTopicDetail, setShowTopicDetail] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL;

  // Dummy course data matching the screenshot
  const dummyCourse = {
    _id: "dummy-course-1",
    title: "Basic Accounting & Tally Foundation",
    chapters: [
      {
        _id: "chapter-1",
        title: "Basic Accounting",
        content: {
          definition:
            "Accounting is the systematic procedure of identifying, recording, classifying, summarizing, analyzing, and reporting business transactions. The primary objective is to reveal the profits and losses of a business. It plays a crucial role in managing and maintaining financial records, making informed business decisions, and ensuring compliance with financial regulations. It therefore, safeguards the interests of stakeholders.",
          steps: [
            {
              title: "Identifying",
              description:
                "This is the initial step in accounting, where financial transactions are recognized and recorded. Accountants identify and document each transaction, ensuring they are classified correctly as income, expenses, assets, liabilities, or equity.",
            },
            {
              title: "Recording",
              description:
                "Once transactions are identified, they are systematically recorded in the books of accounts using double-entry bookkeeping system.",
            },
            {
              title: "Classifying",
              description:
                "Transactions are grouped into categories like assets, liabilities, income, and expenses for better organization and analysis.",
            },
            {
              title: "Summarizing",
              description:
                "Financial data is summarized into meaningful reports like balance sheets, income statements, and cash flow statements.",
            },
            {
              title: "Analyzing",
              description:
                "Financial statements are analyzed to understand the financial position and performance of the business.",
            },
            {
              title: "Reporting",
              description:
                "Financial information is reported to stakeholders including management, investors, and regulatory authorities.",
            },
          ],
        },
      },
      {
        _id: "chapter-2",
        title: "Company creation and data management",
        content: {
          definition:
            "Company creation involves establishing a legal business entity with proper documentation and structure. Data management ensures accurate recording and maintenance of all business transactions and information.",
          steps: [
            {
              title: "Business Registration",
              description:
                "Register the business with appropriate government authorities and obtain necessary licenses and permits.",
            },
            {
              title: "Chart of Accounts",
              description:
                "Create a structured chart of accounts to organize financial transactions into logical categories.",
            },
            {
              title: "Data Entry Standards",
              description:
                "Establish consistent data entry procedures and standards for maintaining accurate records.",
            },
          ],
        },
      },
      {
        _id: "chapter-3",
        title: "Voucher Entries in Tally",
        content: {
          definition:
            "Voucher entries are the primary method of recording financial transactions in Tally accounting software. Each voucher represents a specific type of transaction with proper debit and credit entries.",
          steps: [
            {
              title: "Receipt Voucher",
              description:
                "Used to record cash or bank receipts from customers, loans, or other sources.",
            },
            {
              title: "Payment Voucher",
              description:
                "Used to record cash or bank payments to suppliers, employees, or other parties.",
            },
            {
              title: "Journal Voucher",
              description:
                "Used for non-cash transactions like depreciation, adjustments, or transfers between accounts.",
            },
          ],
        },
      },
      {
        _id: "chapter-4",
        title: "Method of Accounting",
        content: {
          definition:
            "Accounting methods determine how and when income and expenses are recognized. The choice of method affects financial reporting and tax obligations.",
          steps: [
            {
              title: "Cash Basis",
              description:
                "Income and expenses are recognized when cash is received or paid, regardless of when the transaction occurred.",
            },
            {
              title: "Accrual Basis",
              description:
                "Income and expenses are recognized when they are earned or incurred, regardless of cash flow.",
            },
            {
              title: "Hybrid Method",
              description:
                "Combines elements of both cash and accrual methods for different types of transactions.",
            },
          ],
        },
      },
      {
        _id: "chapter-5",
        title: "Finalisation of ledger balances",
        content: {
          definition:
            "Finalization involves closing temporary accounts and preparing final financial statements that reflect the true financial position of the business.",
          steps: [
            {
              title: "Trial Balance",
              description:
                "Prepare a trial balance to ensure total debits equal total credits before finalization.",
            },
            {
              title: "Adjustments",
              description:
                "Make necessary adjustments for accruals, prepayments, depreciation, and other year-end items.",
            },
            {
              title: "Closing Entries",
              description:
                "Close temporary accounts like revenue and expense accounts to retained earnings.",
            },
          ],
        },
      },
      {
        _id: "chapter-6",
        title: "Bank Reconciliation Statement",
        content: {
          definition:
            "Bank reconciliation is the process of comparing the bank statement with the company's cash book to identify and resolve discrepancies.",
          steps: [
            {
              title: "Compare Balances",
              description:
                "Compare the bank statement balance with the cash book balance as of the same date.",
            },
            {
              title: "Identify Differences",
              description:
                "Identify items that appear in one record but not the other, such as outstanding checks or deposits in transit.",
            },
            {
              title: "Reconcile Differences",
              description:
                "Adjust the cash book for bank charges, interest, and other items not yet recorded.",
            },
          ],
        },
      },
    ],
  };

  useEffect(() => {
    const fetchStudentAndCourses = async () => {
      try {
        const res = await axios.get(`${API}/api/v1/students/isstudent`, {
          withCredentials: true,
        });
        const student = res.data.student;
        setStudentId(student._id);

        const courseRes = await axios.get(
          `${API}/api/v1/students/list-courses/${student._id}`,
          { withCredentials: true }
        );
        const fetchedCourses = courseRes.data.courses || [];

        // If no courses, use dummy data
        if (fetchedCourses.length === 0) {
          setCourses([dummyCourse]);
          setLastAccessedCourse(dummyCourse);
        } else {
          setCourses(fetchedCourses);
          setLastAccessedCourse(fetchedCourses[0]);
        }
      } catch (err) {
        console.error("Fetch error", err);
        // On error, show dummy data
        setCourses([dummyCourse]);
        setLastAccessedCourse(dummyCourse);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentAndCourses();
  }, []);

  const handleContinue = () => {
    // Handle continue functionality
    console.log("Continue from last accessed course");
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setShowTopicDetail(true);
  };

  const handleBackToCourse = () => {
    setShowTopicDetail(false);
    setSelectedTopic(null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  // Topic Detail View
  if (showTopicDetail && selectedTopic) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToCourse}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {selectedTopic.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">100%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>Language</option>
              </select>
              <div className="flex items-center gap-1 text-yellow-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium">50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex min-h-screen">
          {/* Left Sidebar - Topic Navigation */}
          <div className="w-80 bg-gray-900 text-white p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-sm">F</span>
                </div>
                <span className="font-semibold">FinC Lab</span>
              </div>
              <h2 className="text-sm text-gray-300">
                Basic Accounting & Tally Foundation
              </h2>
              <h3 className="text-lg font-semibold">Basic Accounting</h3>
            </div>

            <div className="space-y-2">
              {dummyCourse.chapters.map((chapter, idx) => (
                <div
                  key={chapter._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedTopic._id === chapter._id
                      ? "bg-yellow-500 text-gray-900"
                      : "hover:bg-gray-800"
                  }`}
                  onClick={() => handleTopicClick(chapter)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {idx + 1} {chapter.title}
                    </span>
                    {selectedTopic._id === chapter._id && (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button className="p-2 text-gray-400 hover:text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-8">
            <div className="max-w-4xl">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {selectedTopic.title}
              </h1>

              {selectedTopic.content && (
                <div className="space-y-8">
                  {/* Definition */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Definition
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedTopic.content.definition}
                    </p>
                  </div>

                  {/* Process Steps */}
                  {selectedTopic.content.steps && (
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        Key Steps
                      </h2>
                      <div className="grid gap-4">
                        {selectedTopic.content.steps.map((step, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">
                              {idx + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2">
                                {step.title}
                              </h3>
                              <p className="text-gray-700">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Progress */}
          <div className="w-64 bg-white border-l border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-blue-200 flex items-center justify-center mx-auto mb-3">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold">100%</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Course Progress</h3>
            </div>

            <div className="space-y-3">
              {dummyCourse.chapters.map((chapter, idx) => (
                <div
                  key={chapter._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {chapter.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-white rounded-full h-2 border border-gray-200">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">100%</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Pick up where you left off section */}
      {lastAccessedCourse && (
        <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Pick up where you left off!
              </h3>
              <p className="text-green-700 text-sm">
                You had last accessed{" "}
                <strong>{lastAccessedCourse.title}</strong>. Click on the button
                to continue from there!
              </p>
            </div>
            <button
              onClick={handleContinue}
              className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Courses section */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Courses
        </h1>
      </div>

      {/* Show dummy data notice if using dummy course */}
      {courses.length > 0 && courses[0]._id === "dummy-course-1" && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-blue-800 text-sm">
              <strong>Demo Mode:</strong> This is sample course data. Your
              actual enrolled courses will appear here once you're enrolled.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Course header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Not Certified. Finish test within lid Date
                    </span>
                  </div>
                </div>

                {/* Progress circle */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-200 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          100%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapters section */}
            <div className="p-6">
              {course.chapters?.length > 0 ? (
                <div className="space-y-4">
                  {course.chapters.map((chapter, idx) => (
                    <div
                      key={chapter._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleTopicClick(chapter)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                            {idx + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                            {chapter.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3 sm:mt-0">
                        {/* Progress bar */}
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-white rounded-full h-2.5 border border-gray-200 overflow-hidden">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: "100%" }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 font-medium">
                            100%
                          </span>
                        </div>

                        {/* Status badge */}
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-3">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">
                    No chapters added to this course yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
