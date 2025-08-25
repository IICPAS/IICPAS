"use client";
import React, { useState } from "react";
import {
  CheckCircle,
  Play,
  Moon,
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
  ChevronRight,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import AccountingExperimentCard from "../components/AccountingExperimentCard";

type ContentKey =
  | "intro"
  | "identifying"
  | "recording"
  | "classifying"
  | "summarizing"
  | "analyzing"
  | "comparison";

interface Topic {
  id: ContentKey;
  title: string;
  completed: boolean;
  icon: React.ComponentType<{ className?: string }>;
  subtopics: string[];
}

export default function DigitalHub() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeContent, setActiveContent] = useState<ContentKey>("intro");
  const [progress, setProgress] = useState(0);
  const [points, setPoints] = useState(110);
  const [chapterDropdownOpen, setChapterDropdownOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  // Sample experiment data
  const experiments = [
    {
      id: 1,
      statement:
        "20th April, Mr. Mahesh & Mr. Kiran Invested Rs. 1,00,000 each as capital by cheque",
      correctEntries: [
        {
          id: "1",
          date: "20/04/2025",
          type: "Debit",
          particulars: "Bank A/c",
          debit: "200000",
          credit: "",
        },
        {
          id: "2",
          date: "20/04/2025",
          type: "Credit",
          particulars: "Capital A/c",
          debit: "",
          credit: "200000",
        },
      ],
    },
    {
      id: 2,
      statement:
        "26th April, Company purchased Furniture worth Rs.50,000/- through bank payment",
      correctEntries: [
        {
          id: "1",
          date: "26/04/2025",
          type: "Debit",
          particulars: "Furniture A/c",
          debit: "50000",
          credit: "",
        },
        {
          id: "2",
          date: "26/04/2025",
          type: "Credit",
          particulars: "Bank A/c",
          debit: "",
          credit: "50000",
        },
      ],
    },
  ];

  const chapters = [
    "Basic Accounting",
    "Company creation and data management",
    "Voucher Entries in Tally",
    "Method of Accounting",
    "Finalisation of ledger balances",
    "Bank Reconciliation Statement",
  ];

  const learningContent = {
    intro: {
      title: "Accounting",
      content: `
        <p class="mb-6 text-lg leading-relaxed text-gray-700">Accounting is the systematic procedure of identifying, recording, classifying, summarizing, analyzing, and reporting business transactions. The primary objective is to reveal the profits and losses of a business. It plays a crucial role in managing and maintaining financial records, making informed business decisions, and ensuring compliance with financial regulations. It therefore, safeguards the interests of stakeholders.</p>
        
        <div class="flex justify-center my-12">
          <div class="relative">
            <div class="w-40 h-40 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">Accounting</div>
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
        <p class="mb-6 text-lg leading-relaxed text-gray-700">This is the initial step in accounting, where financial transactions are recognized and recorded. Accountants identify and document each transaction, ensuring they are classified correctly as income, expenses, assets, liabilities, or equity.</p>
        
        <div class="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <h4 class="font-semibold mb-4 text-green-800 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Key Points:
          </h4>
          <ul class="space-y-3">
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Recognize financial transactions</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Document each transaction</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Classify as income, expenses, assets, liabilities, or equity</span>
            </li>
          </ul>
        </div>
      `,
    },
    recording: {
      title: "2. Recording",
      content: `
        <p class="mb-6 text-lg leading-relaxed text-gray-700">It is a fundamental step in the accounting cycle and involves documenting these events accurately for the purpose of maintaining complete and reliable financial records. Entering financial transactions in a systematic manner, as and when they occur. And to do so, we use Journal or subsidiary books.</p>
        
        <div class="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <h4 class="font-semibold mb-4 text-green-800 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Methods:
          </h4>
          <ul class="space-y-3">
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Journal entries</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Subsidiary books</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Systematic documentation</span>
            </li>
          </ul>
        </div>
      `,
    },
    classifying: {
      title: "3. Classifying",
      content: `
        <p class="mb-6 text-lg leading-relaxed text-gray-700">After the recording of data, the transactions of similar nature or type are grouped together. For this purpose, the firm opens various accounts in a ledger which is a secondary book. Thereafter, the posting of transactions in those accounts takes place. Proper classification is essential for accurately representing an entity's financial position and performance.</p>
        
        <div class="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <h4 class="font-semibold mb-4 text-green-800 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Process:
          </h4>
          <ul class="space-y-3">
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Group similar transactions</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Open ledger accounts</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Post transactions</span>
            </li>
          </ul>
        </div>
      `,
    },
    summarizing: {
      title: "4. Summarizing",
      content: `
        <p class="mb-6 text-lg leading-relaxed text-gray-700">It involves the preparation and presentation of the classified data. The classification takes place in a manner that is useful to the users. In this step, the firm prepares financial statements. Summarising is the basic function of accounting. All business transactions of a financial characters evidenced by some documents such as sales bill, pass book, salary slip etc. are recorded in the books of account.</p>
        
        <div class="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <h4 class="font-semibold mb-4 text-green-800 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Output:
          </h4>
          <ul class="space-y-3">
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Financial statements</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Useful presentation</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Documented evidence</span>
            </li>
          </ul>
        </div>
      `,
    },
    analyzing: {
      title: "5. Analyzing",
      content: `
        <p class="mb-6 text-lg leading-relaxed text-gray-700">Analysis is the systematic classification of data provided in the financial statements. It refers to the process of examining financial data to understand the financial health and performance of a business.</p>
        
        <div class="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <h4 class="font-semibold mb-4 text-green-800 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Analysis Types:
          </h4>
          <ul class="space-y-3">
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Ratio analysis</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Trend analysis</span>
            </li>
            <li class="flex items-start">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Comparative analysis</span>
            </li>
          </ul>
        </div>
      `,
    },
    comparison: {
      title: "Difference between Accounting & Finance",
      content: `
        <p class="mb-8 text-lg leading-relaxed text-gray-700">In summary, accounting is more focused on recording and presenting financial data accurately, while finance is focused on managing financial resources strategically to maximize value. Both fields are integral to the success of businesses and play complementary roles in decision-making and overall financial management.</p>
        
        <div class="overflow-x-auto bg-white rounded-xl shadow-lg border border-green-200">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gradient-to-r from-green-50 to-green-100">
                <th class="border border-green-200 px-6 py-4 text-left font-semibold text-green-800">BASIS FOR COMPARISON</th>
                <th class="border border-green-200 px-6 py-4 text-left font-semibold text-green-800">ACCOUNTING</th>
                <th class="border border-green-200 px-6 py-4 text-left font-semibold text-green-800">FINANCE</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-green-50 transition-colors">
                <td class="border border-green-200 px-6 py-4 font-medium text-gray-800">Meaning</td>
                <td class="border border-green-200 px-6 py-4">A methodical record-keeping of transactions of business.</td>
                <td class="border border-green-200 px-6 py-4">The study of the management of funds in the best possible manner.</td>
              </tr>
              <tr class="bg-green-50 hover:bg-green-100 transition-colors">
                <td class="border border-green-200 px-6 py-4 font-medium text-gray-800">Part of</td>
                <td class="border border-green-200 px-6 py-4">Finance</td>
                <td class="border border-green-200 px-6 py-4">Economics</td>
              </tr>
              <tr class="hover:bg-green-50 transition-colors">
                <td class="border border-green-200 px-6 py-4 font-medium text-gray-800">Focuses on</td>
                <td class="border border-green-200 px-6 py-4">Past</td>
                <td class="border border-green-200 px-6 py-4">Future</td>
              </tr>
              <tr class="bg-green-50 hover:bg-green-100 transition-colors">
                <td class="border border-green-200 px-6 py-4 font-medium text-gray-800">Concerned with</td>
                <td class="border border-green-200 px-6 py-4">Ensuring that all the financial transactions are recorded in the financial system with accuracy.</td>
                <td class="border border-green-200 px-6 py-4">Understanding financial data of the enterprise keeping in mind the growth and strategy.</td>
              </tr>
              <tr class="hover:bg-green-50 transition-colors">
                <td class="border border-green-200 px-6 py-4 font-medium text-gray-800">Thinking Process</td>
                <td class="border border-green-200 px-6 py-4">Rules-Based</td>
                <td class="border border-green-200 px-6 py-4">Analysis Based</td>
              </tr>
              <tr class="bg-green-50 hover:bg-green-100 transition-colors">
                <td class="border border-green-200 px-6 py-4 font-medium text-gray-800">Financial Statements</td>
                <td class="border border-green-200 px-6 py-4">It is prepared</td>
                <td class="border border-green-200 px-6 py-4">It is analyzed</td>
              </tr>
              <tr class="hover:bg-green-50 transition-colors">
                <td class="border border-green-200 px-6 py-4 font-medium text-gray-800">Drive</td>
                <td class="border border-green-200 px-6 py-4">Tax Driven</td>
                <td class="border border-green-200 px-6 py-4">Plan Driven</td>
              </tr>
              <tr class="bg-green-50 hover:bg-green-100 transition-colors">
                <td class="border border-green-200 px-6 py-4 font-medium text-gray-800">Career</td>
                <td class="border border-green-200 px-6 py-4">Accounting professionals can become accountants, auditors, tax consultants, etc.</td>
                <td class="border border-green-200 px-6 py-4">Finance professionals can become investment bankers, financial analysts, finance consultants, etc.</td>
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
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg shadow-md"></div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h1 className="text-xl font-semibold">Digital Hub</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{progress}%</span>
            </div>

            <select className="px-3 py-1 rounded-lg border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Language</option>
            </select>

            <span className="text-sm font-medium">Introduction</span>

            <div className="flex items-center space-x-1 bg-yellow-100 px-3 py-1 rounded-full">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <span className="text-sm font-semibold text-yellow-800">
                {points}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Narrow Left Sidebar */}
        <div className="w-16 bg-gray-50 border-r border-gray-200 min-h-screen flex flex-col items-center py-4">
          {/* Logo */}
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg mb-8"></div>

          {/* Navigation Icons */}
          <div className="flex flex-col items-center space-y-6">
            <button
              onClick={() => setHamburgerOpen(!hamburgerOpen)}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Menu className="w-5 h-5 text-green-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <ArrowRight className="w-5 h-5 text-green-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <Moon className="w-5 h-5 text-green-600" />
            </button>
          </div>

          {/* Bottom Icons */}
          <div className="mt-auto flex flex-col items-center space-y-4">
            <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <Info className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <AlertTriangle className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Hamburger Menu Sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            hamburgerOpen ? "w-80" : "w-0"
          } overflow-hidden bg-white border-r border-gray-200`}
        >
          <div className="w-80 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Chapters</h2>
              <button
                onClick={() => setHamburgerOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setHamburgerOpen(false);
                    // Handle chapter selection
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-green-50 transition-colors text-gray-700 border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{chapter}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 bg-white">
          <div className="w-full">
            {/* Chapter Selection Dropdown */}
            <div className="mb-8">
              <div className="relative">
                <button
                  onClick={() => setChapterDropdownOpen(!chapterDropdownOpen)}
                  className="flex items-center justify-between w-80 bg-green-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span>Select a chapter</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      chapterDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {chapterDropdownOpen && (
                  <div className="absolute top-full left-0 w-80 bg-white border border-gray-300 rounded-lg shadow-xl z-50 mt-1">
                    {chapters.map((chapter, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setChapterDropdownOpen(false);
                          // Handle chapter selection
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors text-gray-700 border-b border-gray-200 last:border-b-0"
                      >
                        {chapter}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content Display */}
            <div className="prose max-w-none">
              <h1 className="text-4xl font-bold text-green-600 mb-8">
                {learningContent[activeContent].title}
              </h1>
              <div
                className="text-lg leading-relaxed bg-gray-50 border border-gray-200 rounded-lg p-8 shadow-sm"
                dangerouslySetInnerHTML={{
                  __html: learningContent[activeContent].content,
                }}
              />
            </div>

            {/* Interactive Experiments Section */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-green-600 mb-8">
                Interactive Experiments
              </h2>
              <p className="text-gray-700 mb-8 text-lg">
                Practice real accounting scenarios by creating journal entries.
                Fill in the correct accounts, types, and amounts to complete
                each transaction.
              </p>

              {experiments.map((experiment) => (
                <AccountingExperimentCard
                  key={experiment.id}
                  experimentNumber={experiment.id}
                  statement={experiment.statement}
                  correctEntries={experiment.correctEntries}
                  onComplete={(isCorrect) => {
                    console.log(
                      `Experiment ${experiment.id} completed: ${
                        isCorrect ? "Correct" : "Incorrect"
                      }`
                    );
                  }}
                />
              ))}
            </div>

            {/* Quiz Section */}
            {activeContent === "comparison" && (
              <div className="mt-12 p-8 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl shadow-lg border border-green-200">
                <h3 className="text-2xl font-semibold mb-6 flex items-center text-green-800">
                  <GraduationCap className="w-6 h-6 mr-3" />
                  Quick Quiz
                </h3>
                <p className="mb-6 text-lg text-gray-700">
                  What is the primary focus of accounting?
                </p>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border-2 border-transparent hover:border-green-200 transition-colors">
                    <input
                      type="radio"
                      name="quiz"
                      className="text-green-500 w-5 h-5"
                    />
                    <span className="text-lg text-gray-700">
                      Managing financial resources
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border-2 border-transparent hover:border-green-200 transition-colors">
                    <input
                      type="radio"
                      name="quiz"
                      className="text-green-500 w-5 h-5"
                    />
                    <span className="text-lg text-gray-700">
                      Planning for the future
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border-2 border-transparent hover:border-green-200 transition-colors">
                    <input
                      type="radio"
                      name="quiz"
                      className="text-green-500 w-5 h-5"
                    />
                    <span className="text-lg text-gray-700">
                      Recording and reporting financial transactions
                    </span>
                  </label>
                </div>
                <button className="mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg">
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
