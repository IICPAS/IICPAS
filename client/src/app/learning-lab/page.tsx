"use client";
import React, { useState } from "react";
import {
  ChevronRight,
  BookOpen,
  CheckCircle,
  Play,
  Moon,
  Sun,
  Info,
  AlertTriangle,
  ArrowRight,
  Menu,
  X,
  Home,
  GraduationCap,
  Target,
  BarChart3,
  FileText,
  Users,
  Settings,
  HelpCircle,
} from "lucide-react";

type ContentKey = "intro" | "identifying" | "recording" | "classifying" | "summarizing" | "analyzing" | "comparison";

interface Topic {
  id: ContentKey;
  title: string;
  completed: boolean;
  icon: React.ComponentType<{ className?: string }>;
  subtopics: string[];
}

export default function LearningLab() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeContent, setActiveContent] = useState<ContentKey>("intro");
  const [progress, setProgress] = useState(100);
  const [points, setPoints] = useState(50);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const learningContent = {
    intro: {
      title: "Accounting",
      content: `
        <p class="mb-6 text-lg leading-relaxed">Accounting is the systematic procedure of identifying, recording, classifying, summarizing, analyzing, and reporting business transactions. The primary objective is to reveal the profits and losses of a business. It plays a crucial role in managing and maintaining financial records, making informed business decisions, and ensuring compliance with financial regulations. It therefore, safeguards the interests of stakeholders.</p>
        
        <div class="flex justify-center my-12">
          <div class="relative">
            <div class="w-40 h-40 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">Accounting</div>
            <div class="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">Identifying</div>
            <div class="absolute -top-6 right-0 w-24 h-24 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">Recording</div>
            <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">Classifying</div>
            <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-blue-700 to-blue-800 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">Summarising</div>
            <div class="absolute bottom-0 -left-6 w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">Analysing</div>
            <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">Reporting</div>
          </div>
        </div>
      `,
    },
    identifying: {
      title: "1. Identifying",
      content: `
        <p class="mb-6 text-lg leading-relaxed">This is the initial step in accounting, where financial transactions are recognized and recorded. Accountants identify and document each transaction, ensuring they are classified correctly as income, expenses, assets, liabilities, or equity.</p>
        
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <h4 class="font-semibold mb-4 text-blue-800 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Key Points:
          </h4>
          <ul class="space-y-3">
            <li class="flex items-start">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Recognize financial transactions</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Document each transaction</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Classify as income, expenses, assets, liabilities, or equity</span>
            </li>
          </ul>
        </div>
      `,
    },
    recording: {
      title: "2. Recording",
      content: `
        <p class="mb-6 text-lg leading-relaxed">It is a fundamental step in the accounting cycle and involves documenting these events accurately for the purpose of maintaining complete and reliable financial records. Entering financial transactions in a systematic manner, as and when they occur. And to do so, we use Journal or subsidiary books.</p>
        
        <div class="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <h4 class="font-semibold mb-4 text-green-800 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Methods:
          </h4>
          <ul class="space-y-3">
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Journal entries</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Subsidiary books</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Systematic documentation</span>
            </li>
          </ul>
        </div>
      `,
    },
    classifying: {
      title: "3. Classifying",
      content: `
        <p class="mb-6 text-lg leading-relaxed">After the recording of data, the transactions of similar nature or type are grouped together. For this purpose, the firm opens various accounts in a ledger which is a secondary book. Thereafter, the posting of transactions in those accounts takes place. Proper classification is essential for accurately representing an entity's financial position and performance.</p>
        
        <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
          <h4 class="font-semibold mb-4 text-yellow-800 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Process:
          </h4>
          <ul class="space-y-3">
            <li class="flex items-start">
              <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Group similar transactions</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Open ledger accounts</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Post transactions</span>
            </li>
          </ul>
        </div>
      `,
    },
    summarizing: {
      title: "4. Summarizing",
      content: `
        <p class="mb-6 text-lg leading-relaxed">It involves the preparation and presentation of the classified data. The classification takes place in a manner that is useful to the users. In this step, the firm prepares financial statements. Summarising is the basic function of accounting. All business transactions of a financial characters evidenced by some documents such as sales bill, pass book, salary slip etc. are recorded in the books of account.</p>
        
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <h4 class="font-semibold mb-4 text-blue-800 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Output:
          </h4>
          <ul class="space-y-3">
            <li class="flex items-start">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Financial statements</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Useful presentation</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Documented evidence</span>
            </li>
          </ul>
        </div>
      `,
    },
    analyzing: {
      title: "5. Analyzing",
      content: `
        <p class="mb-6 text-lg leading-relaxed">Analysis is the systematic classification of data provided in the financial statements. It refers to the process of examining financial data to understand the financial health and performance of a business.</p>
        
        <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <h4 class="font-semibold mb-4 text-purple-800 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Analysis Types:
          </h4>
          <ul class="space-y-3">
            <li class="flex items-start">
              <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Ratio analysis</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Trend analysis</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Comparative analysis</span>
            </li>
          </ul>
        </div>
      `,
    },
    comparison: {
      title: "Difference between Accounting & Finance",
      content: `
        <p class="mb-8 text-lg leading-relaxed">In summary, accounting is more focused on recording and presenting financial data accurately, while finance is focused on managing financial resources strategically to maximize value. Both fields are integral to the success of businesses and play complementary roles in decision-making and overall financial management.</p>
        
        <div class="overflow-x-auto bg-white rounded-xl shadow-lg border">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gradient-to-r from-gray-50 to-gray-100">
                <th class="border border-gray-200 px-6 py-4 text-left font-semibold text-gray-700">BASIS FOR COMPARISON</th>
                <th class="border border-gray-200 px-6 py-4 text-left font-semibold text-gray-700">ACCOUNTING</th>
                <th class="border border-gray-200 px-6 py-4 text-left font-semibold text-gray-700">FINANCE</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="border border-gray-200 px-6 py-4 font-medium text-gray-800">Meaning</td>
                <td class="border border-gray-200 px-6 py-4">A methodical record-keeping of transactions of business.</td>
                <td class="border border-gray-200 px-6 py-4">The study of the management of funds in the best possible manner.</td>
              </tr>
              <tr class="bg-gray-50 hover:bg-gray-100 transition-colors">
                <td class="border border-gray-200 px-6 py-4 font-medium text-gray-800">Part of</td>
                <td class="border border-gray-200 px-6 py-4">Finance</td>
                <td class="border border-gray-200 px-6 py-4">Economics</td>
              </tr>
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="border border-gray-200 px-6 py-4 font-medium text-gray-800">Focuses on</td>
                <td class="border border-gray-200 px-6 py-4">Past</td>
                <td class="border border-gray-200 px-6 py-4">Future</td>
              </tr>
              <tr class="bg-gray-50 hover:bg-gray-100 transition-colors">
                <td class="border border-gray-200 px-6 py-4 font-medium text-gray-800">Concerned with</td>
                <td class="border border-gray-200 px-6 py-4">Ensuring that all the financial transactions are recorded in the financial system with accuracy.</td>
                <td class="border border-gray-200 px-6 py-4">Understanding financial data of the enterprise keeping in mind the growth and strategy.</td>
              </tr>
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="border border-gray-200 px-6 py-4 font-medium text-gray-800">Thinking Process</td>
                <td class="border border-gray-200 px-6 py-4">Rules-Based</td>
                <td class="border border-gray-200 px-6 py-4">Analysis Based</td>
              </tr>
              <tr class="bg-gray-50 hover:bg-gray-100 transition-colors">
                <td class="border border-gray-200 px-6 py-4 font-medium text-gray-800">Financial Statements</td>
                <td class="border border-gray-200 px-6 py-4">It is prepared</td>
                <td class="border border-gray-200 px-6 py-4">It is analyzed</td>
              </tr>
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="border border-gray-200 px-6 py-4 font-medium text-gray-800">Drive</td>
                <td class="border border-gray-200 px-6 py-4">Tax Driven</td>
                <td class="border border-gray-200 px-6 py-4">Plan Driven</td>
              </tr>
              <tr class="bg-gray-50 hover:bg-gray-100 transition-colors">
                <td class="border border-gray-200 px-6 py-4 font-medium text-gray-800">Career</td>
                <td class="border border-gray-200 px-6 py-4">Accounting professionals can become accountants, auditors, tax consultants, etc.</td>
                <td class="border border-gray-200 px-6 py-4">Finance professionals can become investment bankers, financial analysts, finance consultants, etc.</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
    },
  };

  const allTopics: Topic[] = [
    {
      id: "intro",
      title: "Introduction",
      completed: true,
      icon: BookOpen,
      subtopics: [
        "Overview of Accounting",
        "Definition & Purpose",
        "Accounting Process",
        "Business Transactions",
        "Financial Regulations",
      ],
    },
    {
      id: "identifying",
      title: "Identifying",
      completed: true,
      icon: Target,
      subtopics: [
        "Transaction Recognition",
        "Income Classification",
        "Expense Classification",
        "Asset Classification",
        "Liability Classification",
        "Equity Classification",
      ],
    },
    {
      id: "recording",
      title: "Recording",
      completed: true,
      icon: FileText,
      subtopics: [
        "Journal Entries",
        "Double Entry System",
        "Ledger Accounts",
        "Subsidiary Books",
        "Source Documents",
        "Systematic Documentation",
      ],
    },
    {
      id: "classifying",
      title: "Classifying",
      completed: true,
      icon: BarChart3,
      subtopics: [
        "Grouping Transactions",
        "Account Types",
        "Chart of Accounts",
        "Posting Process",
        "Trial Balance",
        "Account Categories",
      ],
    },
    {
      id: "summarizing",
      title: "Summarizing",
      completed: true,
      icon: FileText,
      subtopics: [
        "Financial Statements",
        "Income Statement",
        "Balance Sheet",
        "Cash Flow Statement",
        "Data Presentation",
        "Documentary Evidence",
      ],
    },
    {
      id: "analyzing",
      title: "Analyzing",
      completed: true,
      icon: BarChart3,
      subtopics: [
        "Ratio Analysis",
        "Trend Analysis",
        "Comparative Analysis",
        "Financial Health",
        "Performance Metrics",
        "Decision Making",
      ],
    },
    {
      id: "comparison",
      title: "Comparison",
      completed: false,
      icon: BookOpen,
      subtopics: [
        "Accounting vs Finance",
        "Role Differences",
        "Career Paths",
        "Skills Required",
        "Industry Applications",
        "Future Trends",
      ],
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        } p-4 shadow-sm`}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg shadow-md"></div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h1 className="text-xl font-semibold">Basic Accounting</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{progress}%</span>
            </div>

            <select
              className={`px-3 py-1 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option>Language</option>
            </select>

            <span className="text-sm font-medium">Introduction</span>

            <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                {points}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${
            darkMode
              ? "bg-gray-800 border-r border-gray-700"
              : "bg-white border-r border-gray-200"
          } shadow-xl`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold">Course Content</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Topics List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {allTopics.map((topic) => {
                  const Icon = topic.icon;
                  const isActive = activeContent === topic.id;

                  return (
                    <div key={topic.id} className="space-y-1">
                      <button
                        onClick={() => setActiveContent(topic.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-blue-500 text-white shadow-md"
                            : darkMode
                            ? "hover:bg-gray-700 text-gray-200"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{topic.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              topic.completed ? "bg-green-500" : "bg-gray-300"
                            }`}
                          ></div>
                          {topic.completed && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </button>

                      {/* Subtopics */}
                      {isActive && topic.subtopics && (
                        <div className="ml-6 space-y-1">
                          {topic.subtopics.map((subtopic, index) => (
                            <div
                              key={index}
                              className={`flex items-center space-x-2 p-2 rounded-md text-sm ${
                                darkMode
                                  ? "text-gray-300 bg-gray-700"
                                  : "text-gray-600 bg-gray-50"
                              }`}
                            >
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                              <span>{subtopic}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                  <span className="text-sm">Theme</span>
                </button>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <HelpCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-transparent z-40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Content Display */}
            <div
              className={`prose ${darkMode ? "prose-invert" : ""} max-w-none`}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
                {learningContent[activeContent].title}
              </h1>
              <div
                className="text-lg leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: learningContent[activeContent].content,
                }}
              />
            </div>

            {/* Quiz Section */}
            {activeContent === "comparison" && (
              <div className="mt-12 p-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg border">
                <h3 className="text-2xl font-semibold mb-6 flex items-center">
                  <GraduationCap className="w-6 h-6 mr-3" />
                  Quick Quiz
                </h3>
                <p className="mb-6 text-lg">
                  What is the primary focus of accounting?
                </p>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border-2 border-transparent hover:border-blue-200 transition-colors">
                    <input
                      type="radio"
                      name="quiz"
                      className="text-blue-500 w-5 h-5"
                    />
                    <span className="text-lg">
                      Managing financial resources
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border-2 border-transparent hover:border-blue-200 transition-colors">
                    <input
                      type="radio"
                      name="quiz"
                      className="text-blue-500 w-5 h-5"
                    />
                    <span className="text-lg">Planning for the future</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border-2 border-transparent hover:border-blue-200 transition-colors">
                    <input
                      type="radio"
                      name="quiz"
                      className="text-blue-500 w-5 h-5"
                    />
                    <span className="text-lg">
                      Recording and reporting financial transactions
                    </span>
                  </label>
                </div>
                <button className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg">
                  Submit Answer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
