"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

// Add Google Translate types
declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: {
          new (options: Record<string, unknown>, elementId: string): unknown;
          getInstance(): {
            translatePage: (languageCode: string) => void;
          };
          InlineLayout: {
            SIMPLE: number;
          };
        };
      };
    };
    googleTranslateElementInit: () => void;
  }
}
import {
  CheckCircle,
  Play,
  Moon,
  Sun,
  Info,
  AlertTriangle,
  ArrowLeft,
  Menu,
  X,
  Home,
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

interface ChapterData {
  _id: string;
  title: string;
  topics: TopicData[];
  order: number;
  status: string;
}

interface TopicData {
  _id: string;
  title: string;
  content: string;
  quiz?: string;
  createdAt: string;
  updatedAt: string;
}

function DigitalHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const [darkMode, setDarkMode] = useState(false);
  const [activeContent, setActiveContent] = useState<ContentKey>("intro");
  const [progress, setProgress] = useState(0);
  const [points, setPoints] = useState(110);
  const [chapterDropdownOpen, setChapterDropdownOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // New state for dynamic content
  const [courseChapters, setCourseChapters] = useState<ChapterData[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<ChapterData | null>(
    null
  );
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicData | null>(null);
  const [topicContent, setTopicContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Ticket submission functions
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketForm),
      });

      if (response.ok) {
        setToastMessage(
          "Ticket submitted successfully! We'll get back to you soon."
        );
        setShowToast(true);
        setIsModalOpen(false);
        setTicketForm({
          name: "",
          email: "",
          phone: "",
          message: "",
        });

        // Hide toast after 3 seconds
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setToastMessage("Failed to submit ticket. Please try again.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      setToastMessage("Error submitting ticket. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTicketForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle chapter selection
  const handleChapterSelect = (chapter: ChapterData) => {
    setSelectedChapter(chapter);
    setTopics(chapter.topics || []);

    // Auto-select first topic of selected chapter
    if (chapter.topics && chapter.topics.length > 0) {
      const firstTopic = chapter.topics[0];
      setSelectedTopic(firstTopic);

      // Decode and set topic content
      if (firstTopic.content) {
        try {
          const decodedContent = atob(firstTopic.content);
          setTopicContent(decodedContent);
        } catch (error) {
          console.error("Error decoding topic content:", error);
          setTopicContent(firstTopic.content || "Content not available");
        }
      }
    } else {
      setSelectedTopic(null);
      setTopicContent("No topics available for this chapter.");
    }
  };

  // Handle topic selection
  const handleTopicSelect = (topic: TopicData) => {
    setSelectedTopic(topic);

    // Decode and set topic content
    if (topic.content) {
      try {
        const decodedContent = atob(topic.content);
        setTopicContent(decodedContent);
      } catch (error) {
        console.error("Error decoding topic content:", error);
        setTopicContent(topic.content || "Content not available");
      }
    }
  };

  // Fetch course data when courseId is available
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch chapters for the course
        const chaptersResponse = await axios.get(
          `${API}/api/chapters/course/${courseId}`
        );

        if (
          chaptersResponse.data.success &&
          chaptersResponse.data.chapters.length > 0
        ) {
          setCourseChapters(chaptersResponse.data.chapters);

          // Auto-select first chapter
          const firstChapter = chaptersResponse.data.chapters[0];
          setSelectedChapter(firstChapter);

          // Auto-select first topic of first chapter
          if (firstChapter.topics && firstChapter.topics.length > 0) {
            const firstTopic = firstChapter.topics[0];
            setSelectedTopic(firstTopic);
            setTopics(firstChapter.topics);

            // Decode and set topic content
            if (firstTopic.content) {
              try {
                const decodedContent = atob(firstTopic.content);
                setTopicContent(decodedContent);
              } catch (error) {
                console.error("Error decoding topic content:", error);
                setTopicContent(firstTopic.content || "Content not available");
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        setTopicContent("Error loading course content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, API]);

  // Initialize Google Translate
  useEffect(() => {
    // Initialize Google Translate
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);

    // Define the callback function
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
        },
        "google_translate_element"
      );
    };

    // Add custom CSS for Google Translate styling
    const style = document.createElement("style");
    style.textContent = `
      .goog-te-banner-frame {
        display: none !important;
      }
      .goog-te-gadget {
        color: black !important;
      }
      .goog-te-gadget .goog-te-combo {
        color: black !important;
        background-color: white !important;
        border: 1px solid #ccc !important;
      }
      .goog-te-gadget .goog-te-combo option {
        color: black !important;
        background-color: white !important;
      }
      .goog-te-banner {
        display: none !important;
      }
      .goog-te-menu-value {
        color: black !important;
      }
      .goog-te-menu-value span {
        color: black !important;
      }
      .goog-te-menu-value span:first-child {
        color: black !important;
      }
      .goog-te-gadget-simple {
        color: black !important;
        background-color: white !important;
      }
      .goog-te-gadget-simple .goog-te-menu-value {
        color: black !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Clean up script if component unmounts
      const existingScript = document.querySelector(
        'script[src*="translate.google.com"]'
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      // Remove custom styles
      const existingStyle = document.querySelector(
        "style[data-google-translate]"
      );
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

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
            <div class="w-48 h-48 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg z-10">Accounting</div>
            <div class="absolute -top-12 -left-12 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md z-20">
              <span class="text-center leading-tight px-2">Identifying</span>
            </div>
            <div class="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md z-20">
              <span class="text-center leading-tight px-2">Recording</span>
            </div>
            <div class="absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md z-20">
              <span class="text-center leading-tight px-2">Classifying</span>
            </div>
            <div class="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-blue-700 to-blue-800 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md z-20">
              <span class="text-center leading-tight px-2">Summarising</span>
            </div>
            <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md z-20">
              <span class="text-center leading-tight px-2">Analysing</span>
            </div>
            <div class="absolute -top-12 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md z-20">
              <span class="text-center leading-tight px-2">Reporting</span>
            </div>
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
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b transition-colors duration-300 ${
          isDarkMode
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
        } p-4 shadow-sm`}
      >
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

            {/* Google Translate Widget */}
            <div id="google_translate_element"></div>

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
        <div
          className={`w-16 transition-colors duration-300 ${
            isDarkMode
              ? "bg-blue-800 border-blue-700"
              : "bg-blue-50 border-blue-200"
          } border-r min-h-screen flex flex-col items-center py-4`}
        >
          {/* Logo */}
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg mb-8"></div>

          {/* Navigation Icons */}
          <div className="flex flex-col items-center space-y-6">
            <button
              onClick={() => setHamburgerOpen(!hamburgerOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <Menu
                className={`w-5 h-5 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              />
            </button>
            <button
              onClick={() => router.push("/student-dashboard")}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <ArrowLeft
                className={`w-5 h-5 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              />
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "hover:bg-gray-700 bg-gray-700"
                  : "hover:bg-gray-200"
              }`}
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-black" />
              )}
            </button>
          </div>

          {/* Bottom Icons */}
          <div className="mt-auto flex flex-col items-center space-y-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              title="Submit a ticket"
            >
              <AlertTriangle
                className={`w-5 h-5 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <ArrowLeft
                className={`w-5 h-5 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Hamburger Menu Sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            hamburgerOpen ? "w-80" : "w-0"
          } overflow-hidden ${
            isDarkMode
              ? "bg-blue-800 border-blue-700"
              : "bg-white border-gray-200"
          } border-r`}
        >
          <div className="w-80 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Chapters
              </h2>
              <button
                onClick={() => setHamburgerOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {selectedChapter
                ? // Show topics for selected chapter
                  topics.map((topic: TopicData, index) => (
                    <button
                      key={topic._id}
                      onClick={() => {
                        setHamburgerOpen(false);
                        handleTopicSelect(topic);
                      }}
                      className={`w-full text-left p-3 rounded-lg hover:bg-green-50 hover:text-black transition-colors border border-gray-200 ${
                        selectedTopic?._id === topic._id
                          ? "bg-green-100 border-green-300"
                          : ""
                      } ${isDarkMode ? "text-white" : "text-gray-700"}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{topic.title}</span>
                      </div>
                    </button>
                  ))
                : // Show chapters if no chapter is selected
                  courseChapters.map((chapter: ChapterData, index) => (
                    <button
                      key={chapter._id}
                      onClick={() => {
                        setHamburgerOpen(false);
                        handleChapterSelect(chapter);
                      }}
                      className={`w-full text-left p-3 rounded-lg hover:bg-green-50 hover:text-black transition-colors border border-gray-200 ${
                        isDarkMode ? "text-white" : "text-gray-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{chapter.title}</span>
                      </div>
                    </button>
                  ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 p-8 transition-colors duration-300 ${
            isDarkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
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
                    <span>
                      {selectedChapter
                        ? selectedChapter.title
                        : "Select a chapter"}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      chapterDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {chapterDropdownOpen && (
                  <div className="absolute top-full left-0 w-80 bg-white border border-gray-300 rounded-lg shadow-xl z-50 mt-1">
                    {courseChapters.map((chapter: ChapterData, index) => (
                      <button
                        key={chapter._id}
                        onClick={() => {
                          setChapterDropdownOpen(false);
                          handleChapterSelect(chapter);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors text-gray-700 border-b border-gray-200 last:border-b-0"
                      >
                        {chapter.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content Display */}
            <div className="prose max-w-none">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-lg text-gray-600">
                    Loading content...
                  </div>
                </div>
              ) : selectedTopic ? (
                <>
                  <h1 className="text-4xl font-bold text-green-600 mb-8">
                    {selectedTopic.title}
                  </h1>
                  <div
                    className="text-lg leading-relaxed bg-white border border-gray-200 rounded-lg p-8 shadow-sm text-gray-900"
                    dangerouslySetInnerHTML={{
                      __html: topicContent,
                    }}
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-lg text-gray-600">
                    No content available
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Hazy transparent background overlay */}
          <div
            className="absolute inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Submit a Ticket
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={ticketForm.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={ticketForm.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={ticketForm.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={ticketForm.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your issue or request..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DigitalHub() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-gray-600">Loading Digital Hub...</div>
        </div>
      }
    >
      <DigitalHubContent />
    </Suspense>
  );
}
