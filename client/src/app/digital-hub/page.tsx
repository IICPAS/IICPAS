"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import AccountingExperimentCard from "../components/AccountingExperimentCard";

// Type definitions
interface Task {
  _id: string;
  taskName: string;
  instructions: string;
  order: number;
}

interface Content {
  _id: string;
  type: "video" | "text" | "rich";
  videoUrl?: string;
  videoBase64?: string;
  textContent?: string;
  richTextContent?: string;
  order: number;
}

interface Simulation {
  _id: string;
  type: string;
  title: string;
  description: string;
  config: Record<string, unknown>;
  isOptional: boolean;
  order: number;
  // Accounting simulation specific fields
  statement?: string;
  correctEntries?: Array<{
    id: string;
    date: string;
    type: string;
    particulars: string;
    debit: string;
    credit: string;
  }>;
  accountTypes?: string[];
  accountOptions?: string[];
}

interface Question {
  _id: string;
  question: string;
  context: string;
  type: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuestionSet {
  passingScore: React.JSX.Element;
  _id: string;
  name: string;
  description: string;
  excelFile?: string;
  excelBase64?: string;
  questions: Question[];
  totalQuestions: number;
  timeLimit: number;
  order: number;
}

interface CaseStudy {
  _id: string;
  title: string;
  description: string;
  chapterId: string;
  order: number;
  isActive: boolean;
  tasks: Task[];
  content: Content[];
  simulations: Simulation[];
  questionSets: QuestionSet[];
  createdAt: string;
  updatedAt: string;
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  chapterId: string;
  order: number;
  isActive: boolean;
  tasks: Task[];
  content: Content[];
  simulations: Simulation[];
  questionSets: QuestionSet[];
  createdAt: string;
  updatedAt: string;
}

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
  Moon,
  Sun,
  AlertTriangle,
  ArrowLeft,
  Menu,
  X,
  Target,
  BarChart3,
  FileText,
  BookOpen,
  ChevronDown,
  Globe,
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

interface QuizQuestion {
  _id: string;
  question: string;
  options: string[];
  answer: string;
}

interface QuizData {
  _id: string;
  topic: string;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

function DigitalHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");
  const chapterId = searchParams.get("chapterId");
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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

  // Language dropdown state
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  // New state for dynamic content
  const [courseChapters, setCourseChapters] = useState<ChapterData[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<ChapterData | null>(
    null
  );
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicData | null>(null);
  const [topicContent, setTopicContent] = useState("");
  const [loading, setLoading] = useState(true);

  // New state for case studies and assignments
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(
    null
  );
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  // Quiz state
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const [points, setPoints] = useState(110);

  // Ticket submission functions
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const response = await fetch(`${API_BASE}/tickets`, {
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

  // Fetch case studies for a chapter
  const fetchCaseStudies = useCallback(
    async (chapterId: string) => {
      try {
        const response = await axios.get(
          `${API}/api/case-studies/chapter/${chapterId}`
        );
        if (response.data.success) {
          setCaseStudies(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching case studies:", error);
        setCaseStudies([]);
      }
    },
    [API]
  );

  // Fetch assignments for a chapter
  const fetchAssignments = useCallback(
    async (chapterId: string) => {
      try {
        const response = await axios.get(
          `${API}/api/assignments/chapter/${chapterId}`
        );
        if (response.data.success) {
          setAssignments(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setAssignments([]);
      }
    },
    [API]
  );

  // Handle chapter selection
  const handleChapterSelect = useCallback(
    (chapter: ChapterData) => {
      setSelectedChapter(chapter);
      setTopics(chapter.topics || []);

      // Fetch case studies and assignments for this chapter
      fetchCaseStudies(chapter._id);
      fetchAssignments(chapter._id);

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
    },
    [fetchCaseStudies, fetchAssignments]
  );

  // Handle topic selection
  const handleTopicSelect = (topic: TopicData) => {
    console.log("Topic selected:", topic);
    setSelectedTopic(topic);
    setSelectedCaseStudy(null);
    setSelectedAssignment(null);

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

    // Load quiz for the selected topic
    console.log("Calling loadQuizForTopic with topic ID:", topic._id);
    loadQuizForTopic(topic._id);
  };

  // Handle case study selection
  const handleCaseStudySelect = (caseStudy: CaseStudy) => {
    console.log("Case study selected:", caseStudy);
    setSelectedCaseStudy(caseStudy);
    setSelectedTopic(null);
    setSelectedAssignment(null);
    setTopicContent("");
  };

  // Handle assignment selection
  const handleAssignmentSelect = (assignment: Assignment) => {
    console.log("Assignment selected:", assignment);
    setSelectedAssignment(assignment);
    setSelectedTopic(null);
    setSelectedCaseStudy(null);
    setTopicContent("");
  };

  // Load quiz for a specific topic
  const loadQuizForTopic = useCallback(
    async (topicId: string) => {
      try {
        console.log("Loading quiz for topic:", topicId);
        setQuizLoading(true);
        setQuizData(null);
        setSelectedAnswers({});
        setShowQuizResults(false);
        setQuizSubmitted(false);

        const response = await axios.get(`${API}/api/quizzes/topic/${topicId}`);
        console.log("Quiz API response:", response.data);

        if (response.data.success && response.data.quiz) {
          console.log("Quiz loaded successfully:", response.data.quiz);
          setQuizData(response.data.quiz);
        } else {
          console.log("No quiz found or invalid response");
        }
      } catch (error) {
        console.error("Error loading quiz:", error);
        // Quiz might not exist for this topic, which is fine
      } finally {
        setQuizLoading(false);
      }
    },
    [API]
  );

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, selectedAnswer: string) => {
    if (quizSubmitted) return; // Don't allow changes after submission

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));
  };

  // Submit quiz

  // Handle language selection
  const handleLanguageSelect = (language: {
    code: string;
    name: string;
    flag: string;
  }) => {
    setSelectedLanguage(language.name);
    setLanguageDropdownOpen(false);

    // Here you can add logic to actually translate the content
    // For now, we'll just show a toast message
    setToastMessage(`Language changed to ${language.name}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Fetch course data when courseId is available
  useEffect(() => {
    const fetchCourseData = async () => {
      console.log("Current courseId:", courseId);
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
        console.log("Chapters response:", chaptersResponse.data);

        if (
          chaptersResponse.data.success &&
          chaptersResponse.data.chapters.length > 0
        ) {
          setCourseChapters(chaptersResponse.data.chapters);

          // If chapterId is provided, select that specific chapter
          if (chapterId) {
            const specificChapter = chaptersResponse.data.chapters.find(
              (chapter: ChapterData) => chapter._id === chapterId
            );

            if (specificChapter) {
              setSelectedChapter(specificChapter);

              // Fetch case studies and assignments for this chapter
              fetchCaseStudies(specificChapter._id);
              fetchAssignments(specificChapter._id);

              // Auto-select first topic of the specific chapter
              if (specificChapter.topics && specificChapter.topics.length > 0) {
                const firstTopic = specificChapter.topics[0];
                setSelectedTopic(firstTopic);
                setTopics(specificChapter.topics);

                // Decode and set topic content
                if (firstTopic.content) {
                  try {
                    const decodedContent = atob(firstTopic.content);
                    setTopicContent(decodedContent);
                  } catch (error) {
                    console.error("Error decoding topic content:", error);
                    setTopicContent(
                      firstTopic.content || "Content not available"
                    );
                  }
                }

                // Load quiz for the first topic
                console.log("Loading quiz for topic:", firstTopic._id);
                loadQuizForTopic(firstTopic._id);
              }
            } else {
              // Fallback to first chapter if specific chapter not found
              const firstChapter = chaptersResponse.data.chapters[0];
              setSelectedChapter(firstChapter);

              // Fetch case studies and assignments for this chapter
              fetchCaseStudies(firstChapter._id);
              fetchAssignments(firstChapter._id);

              if (firstChapter.topics && firstChapter.topics.length > 0) {
                const firstTopic = firstChapter.topics[0];
                setSelectedTopic(firstTopic);
                setTopics(firstChapter.topics);

                if (firstTopic.content) {
                  try {
                    const decodedContent = atob(firstTopic.content);
                    setTopicContent(decodedContent);
                  } catch (error) {
                    console.error("Error decoding topic content:", error);
                    setTopicContent(
                      firstTopic.content || "Content not available"
                    );
                  }
                }

                // Load quiz for the first topic
                console.log("Loading quiz for topic:", firstTopic._id);
                loadQuizForTopic(firstTopic._id);
              }
            }
          } else {
            // No chapterId provided, select first chapter
            const firstChapter = chaptersResponse.data.chapters[0];
            setSelectedChapter(firstChapter);

            // Fetch case studies and assignments for this chapter
            fetchCaseStudies(firstChapter._id);
            fetchAssignments(firstChapter._id);

            if (firstChapter.topics && firstChapter.topics.length > 0) {
              const firstTopic = firstChapter.topics[0];
              setSelectedTopic(firstTopic);
              setTopics(firstChapter.topics);

              if (firstTopic.content) {
                try {
                  const decodedContent = atob(firstTopic.content);
                  setTopicContent(decodedContent);
                } catch (error) {
                  console.error("Error decoding topic content:", error);
                  setTopicContent(
                    firstTopic.content || "Content not available"
                  );
                }
              }

              // Load quiz for the first topic
              console.log("Loading quiz for topic:", firstTopic._id);
              loadQuizForTopic(firstTopic._id);
            }
          }
        } else {
          console.log("No chapters found for course");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [
    courseId,
    chapterId,
    API,
    fetchAssignments,
    fetchCaseStudies,
    loadQuizForTopic,
  ]);

  // Initialize Google Translate with enhanced styling
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

    // Add enhanced CSS for Google Translate styling
    const style = document.createElement("style");
    style.textContent = `
      .goog-te-banner-frame {
        display: none !important;
      }
      
      /* Enhanced Google Translate Container */
      #google_translate_element {
        position: relative;
        display: inline-block;
      }
      
      /* Hide default Google Translate elements */
      .goog-te-banner {
        display: none !important;
      }
      
      /* Enhanced dropdown styling */
      .goog-te-gadget {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
        font-size: 14px !important;
        color: #374151 !important;
      }
      
      .goog-te-gadget-simple {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 8px 16px !important;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
        transition: all 0.3s ease !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        min-width: 180px !important;
      }
      
      .goog-te-gadget-simple:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
      }
      
      .goog-te-gadget-simple .goog-te-menu-value {
        color: white !important;
        font-weight: 500 !important;
        font-size: 14px !important;
        text-decoration: none !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
      }
      
      .goog-te-gadget-simple .goog-te-menu-value span {
        color: white !important;
        font-weight: 500 !important;
      }
      
      .goog-te-gadget-simple .goog-te-menu-value span:first-child {
        color: white !important;
        font-weight: 500 !important;
      }
      
      /* Custom dropdown arrow */
      .goog-te-gadget-simple .goog-te-menu-value::after {
        content: '▼' !important;
        color: white !important;
        font-size: 10px !important;
        margin-left: auto !important;
        transition: transform 0.2s ease !important;
      }
      
      .goog-te-gadget-simple:hover .goog-te-menu-value::after {
        transform: rotate(180deg) !important;
      }
      
      /* Dropdown options styling */
      .goog-te-menu-frame {
        border-radius: 8px !important;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
        border: none !important;
        background: white !important;
      }
      
      .goog-te-menu2 {
        border-radius: 8px !important;
        overflow: hidden !important;
      }
      
      .goog-te-menu2-item {
        padding: 12px 16px !important;
        color: #374151 !important;
        font-weight: 500 !important;
        transition: background-color 0.2s ease !important;
      }
      
      .goog-te-menu2-item:hover {
        background-color: #f3f4f6 !important;
        color: #1f2937 !important;
      }
      
      /* Hide Google Translate attribution */
      .goog-te-gadget img {
        display: none !important;
      }
      
      /* Progress indicator */
      .goog-te-gadget-simple::before {
        content: '🌐' !important;
        font-size: 16px !important;
        margin-right: 6px !important;
      }
      
      /* Enhanced Simple Dropdown Styling */
      .goog-te-combo {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 10px 16px !important;
        color: white !important;
        font-weight: 500 !important;
        font-size: 14px !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
        transition: all 0.3s ease !important;
        cursor: pointer !important;
        outline: none !important;
        min-width: 160px !important;
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e") !important;
        background-repeat: no-repeat !important;
        background-position: right 12px center !important;
        background-size: 16px !important;
        padding-right: 40px !important;
      }
      
      .goog-te-combo:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%) !important;
      }
      
      .goog-te-combo:focus {
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3) !important;
      }
      
      .goog-te-combo option {
        background: white !important;
        color: #374151 !important;
        font-weight: 500 !important;
        padding: 12px 16px !important;
        border: none !important;
      }
      
      .goog-te-combo option:hover {
        background: #f3f4f6 !important;
        color: #1f2937 !important;
      }
      
      /* Alternative simple styling for different Google Translate versions */
      .goog-te-gadget .goog-te-combo {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 10px 16px !important;
        color: white !important;
        font-weight: 500 !important;
        font-size: 14px !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
        transition: all 0.3s ease !important;
        cursor: pointer !important;
        outline: none !important;
        min-width: 160px !important;
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e") !important;
        background-repeat: no-repeat !important;
        background-position: right 12px center !important;
        background-size: 16px !important;
        padding-right: 40px !important;
      }
      
      .goog-te-gadget .goog-te-combo:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%) !important;
      }
      
      .goog-te-gadget .goog-te-combo:focus {
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3) !important;
      }
      
      .goog-te-gadget .goog-te-combo option {
        background: white !important;
        color: #374151 !important;
        font-weight: 500 !important;
        padding: 12px 16px !important;
        border: none !important;
      }
      
      .goog-te-gadget .goog-te-combo option:hover {
        background: #f3f4f6 !important;
        color: #1f2937 !important;
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

  // Language options
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "ko", name: "Korean", flag: "🇰🇷" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "bn", name: "Bengali", flag: "🇧🇩" },
    { code: "ur", name: "Urdu", flag: "🇵🇰" },
    { code: "tr", name: "Turkish", flag: "🇹🇷" },
    { code: "nl", name: "Dutch", flag: "🇳🇱" },
    { code: "sv", name: "Swedish", flag: "🇸🇪" },
    { code: "no", name: "Norwegian", flag: "🇳🇴" },
    { code: "da", name: "Danish", flag: "🇩🇰" },
    { code: "fi", name: "Finnish", flag: "🇫🇮" },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Enhanced Header with Chapters Dropdown */}
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

          <div className="flex items-center space-x-6">
            {/* Progress Bar */}
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{progress}%</span>
            </div>

            {/* Custom Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg min-w-[160px]"
              >
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-white" />
                  <span className="truncate">{selectedLanguage}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    languageDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {languageDropdownOpen && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-xl z-50 mt-1 max-h-60 overflow-y-auto">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-gray-700 border-b border-gray-200 last:border-b-0 flex items-center space-x-3"
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span className="font-medium">{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chapters Dropdown - Moved to Header */}
            <div className="relative">
              <button
                onClick={() => setChapterDropdownOpen(!chapterDropdownOpen)}
                className="flex items-center justify-between bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg min-w-[200px]"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-4 h-4 text-white" />
                  <span className="truncate">
                    {selectedChapter ? selectedChapter.title : "Select Chapter"}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    chapterDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {chapterDropdownOpen && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-xl z-50 mt-1 max-h-60 overflow-y-auto">
                  {courseChapters.length > 0 ? (
                    courseChapters.map((chapter: ChapterData, index) => (
                      <button
                        key={chapter._id}
                        onClick={() => {
                          setChapterDropdownOpen(false);
                          handleChapterSelect(chapter);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors text-gray-700 border-b border-gray-200 last:border-b-0 flex items-center space-x-3"
                      >
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{chapter.title}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      No chapters available
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Points Badge */}
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
              ? "bg-orange-500 border-orange-400"
              : "bg-blue-50 border-blue-200"
          } border-r min-h-screen flex flex-col items-center py-4`}
        >
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
            isDarkMode ? "bg-white border-gray-600" : "bg-white border-gray-200"
          } border-r`}
        >
          <div className="w-80 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-black" : "text-gray-800"
                }`}
              >
                Topics
              </h2>
              <button
                onClick={() => setHamburgerOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-black" : "text-gray-500"
                  }`}
                />
              </button>
            </div>
            <div className="space-y-2">
              {selectedChapter ? (
                <>
                  {/* Topics Section */}
                  {topics.length > 0 && (
                    <>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">
                        Topics
                      </h3>
                      {topics.map((topic: TopicData, index) => (
                        <button
                          key={topic._id}
                          onClick={() => {
                            setHamburgerOpen(false);
                            handleTopicSelect(topic);
                          }}
                          className={`w-full text-left p-3 rounded-lg hover:bg-green-50 hover:text-black transition-colors border border-gray-600 ${
                            selectedTopic?._id === topic._id
                              ? "bg-gray-100 border-gray-600"
                              : ""
                          } ${isDarkMode ? "text-black" : "text-gray-700"}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <span className="font-medium">{topic.title}</span>
                          </div>
                        </button>
                      ))}
                    </>
                  )}

                  {/* Case Studies Section */}
                  {caseStudies.length > 0 && (
                    <>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2 mt-4">
                        Simulations
                      </h3>
                      {caseStudies
                        .slice(0, 2)
                        .map((caseStudy: CaseStudy, index) => (
                          <button
                            key={caseStudy._id}
                            onClick={() => {
                              setHamburgerOpen(false);
                              handleCaseStudySelect(caseStudy);
                            }}
                            className={`w-full text-left p-3 rounded-lg hover:bg-blue-50 hover:text-black transition-colors border border-gray-600 ${
                              selectedCaseStudy?._id === caseStudy._id
                                ? "bg-gray-100 border-gray-600"
                                : ""
                            } ${isDarkMode ? "text-black" : "text-gray-700"}`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                S{index + 1}
                              </div>
                              <span className="font-medium">
                                Simulation {index + 1}
                              </span>
                            </div>
                          </button>
                        ))}
                    </>
                  )}

                  {/* Assignments Section */}
                  {assignments.length > 0 && (
                    <>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2 mt-4">
                        Assessments
                      </h3>
                      {assignments
                        .slice(0, 2)
                        .map((assignment: Assignment, index) => (
                          <button
                            key={assignment._id}
                            onClick={() => {
                              setHamburgerOpen(false);
                              handleAssignmentSelect(assignment);
                            }}
                            className={`w-full text-left p-3 rounded-lg hover:bg-purple-50 hover:text-black transition-colors border border-gray-600 ${
                              selectedAssignment?._id === assignment._id
                                ? "bg-gray-100 border-gray-600"
                                : ""
                            } ${isDarkMode ? "text-black" : "text-gray-700"}`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                A{index + 1}
                              </div>
                              <span className="font-medium">
                                Assessment {index + 1}
                              </span>
                            </div>
                          </button>
                        ))}
                    </>
                  )}

                  {topics.length === 0 &&
                    caseStudies.length === 0 &&
                    assignments.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="mx-auto mb-2 w-8 h-8 text-gray-300" />
                        <p className="text-sm">
                          No content available for this chapter
                        </p>
                      </div>
                    )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="mx-auto mb-2 w-8 h-8 text-gray-300" />
                  <p className="text-sm">Select a chapter to view content</p>
                </div>
              )}
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
                  <div className="text-lg leading-relaxed bg-white border border-gray-200 rounded-lg p-8 shadow-sm text-gray-900">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: topicContent,
                      }}
                    />

                    {/* Quiz Questions - Directly in main content */}
                    {quizLoading ? (
                      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-center text-gray-600">
                          Loading questions...
                        </div>
                      </div>
                    ) : quizData &&
                      quizData.questions &&
                      quizData.questions.length > 0 ? (
                      <div className="mt-8">
                        <div className="space-y-6">
                          {quizData.questions.map(
                            (question: QuizQuestion, questionIndex: number) => (
                              <div
                                key={question._id}
                                className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                              >
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                  Question {questionIndex + 1}:{" "}
                                  {question.question}
                                </h3>

                                <div className="space-y-3">
                                  {question.options.map(
                                    (option: string, optionIndex: number) => {
                                      const isSelected =
                                        selectedAnswers[question._id] ===
                                        option;
                                      const isCorrect =
                                        option === question.answer;
                                      const hasAnswered =
                                        selectedAnswers[question._id];

                                      return (
                                        <div
                                          key={optionIndex}
                                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                            isSelected
                                              ? isCorrect
                                                ? "bg-green-100 border-green-500"
                                                : "bg-red-100 border-red-500"
                                              : hasAnswered && isCorrect
                                              ? "bg-green-100 border-green-500"
                                              : "bg-white border-gray-300 hover:border-gray-400"
                                          }`}
                                          onClick={() => {
                                            handleAnswerSelect(
                                              question._id,
                                              option
                                            );
                                          }}
                                        >
                                          <div className="flex items-center justify-between">
                                            <span className="text-gray-800">
                                              {String.fromCharCode(
                                                65 + optionIndex
                                              )}
                                              . {option}
                                            </span>
                                            {(isSelected ||
                                              (hasAnswered && isCorrect)) && (
                                              <span className="text-xl font-bold">
                                                {isCorrect ? (
                                                  <span className="text-green-600">
                                                    ✓
                                                  </span>
                                                ) : (
                                                  <span className="text-red-600">
                                                    ✗
                                                  </span>
                                                )}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : selectedCaseStudy ? (
                <>
                  <div className="text-lg leading-relaxed bg-white border border-gray-200 rounded-lg p-8 shadow-sm text-gray-900">
                    <div className="mb-6">
                      <p className="text-gray-700">
                        {selectedCaseStudy.description}
                      </p>
                    </div>

                    {/* Task Instructions */}
                    {selectedCaseStudy.tasks &&
                      selectedCaseStudy.tasks.length > 0 && (
                        <div className="mb-8 p-6 bg-pink-50 border border-pink-200 rounded-lg">
                          <p className="text-pink-700">
                            {selectedCaseStudy.tasks[0].instructions}
                          </p>
                        </div>
                      )}

                    {/* Simulations */}
                    <div className="space-y-6">
                      {selectedCaseStudy.simulations &&
                      selectedCaseStudy.simulations.length > 0 ? (
                        selectedCaseStudy.simulations.map(
                          (simulation: Simulation, index: number) => (
                            <div
                              key={simulation._id}
                              className="bg-blue-50 border border-blue-200 rounded-lg p-6"
                            >
                              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                                {simulation.title}
                              </h3>
                              <p className="text-blue-700 mb-4">
                                {simulation.description}
                              </p>

                              {/* Render AccountingExperimentCard */}
                              <AccountingExperimentCard
                                experimentNumber={index + 1}
                                statement={
                                  simulation.description ||
                                  "Mock transaction: Paid wages to employees for the first two weeks of January, aggregating Rs.25000."
                                }
                                correctEntries={
                                  simulation.correctEntries || [
                                    {
                                      id: "1",
                                      date: "15/01/2025",
                                      type: "Debit",
                                      particulars: "Salary A/c",
                                      debit: "25000",
                                      credit: "",
                                    },
                                    {
                                      id: "2",
                                      date: "15/01/2025",
                                      type: "Credit",
                                      particulars: "Cash A/c",
                                      debit: "",
                                      credit: "25000",
                                    },
                                  ]
                                }
                                onComplete={(isCorrect) => {
                                  console.log(
                                    `Experiment ${index + 1} completed:`,
                                    isCorrect
                                  );
                                }}
                              />
                            </div>
                          )
                        )
                      ) : (
                        /* Mock Simulation when no simulations exist */
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-blue-800 mb-4">
                            Mock Simulation
                          </h3>
                          <p className="text-blue-700 mb-4">
                            This is a mock simulation to demonstrate the
                            AccountingExperimentCard component.
                          </p>

                          {/* Render AccountingExperimentCard with mock data */}
                          <AccountingExperimentCard
                            experimentNumber={1}
                            statement="Mock transaction: Paid wages to employees for the first two weeks of January, aggregating Rs.25000."
                            correctEntries={[
                              {
                                id: "1",
                                date: "15/01/2025",
                                type: "Debit",
                                particulars: "Salary A/c",
                                debit: "25000",
                                credit: "",
                              },
                              {
                                id: "2",
                                date: "15/01/2025",
                                type: "Credit",
                                particulars: "Cash A/c",
                                debit: "",
                                credit: "25000",
                              },
                            ]}
                            onComplete={(isCorrect) => {
                              console.log(
                                "Mock experiment completed:",
                                isCorrect
                              );
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Debug: Always show AccountingExperimentCard */}
                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                        🚀 Debug: AccountingExperimentCard Test
                      </h3>
                      <p className="text-yellow-700 mb-4">
                        This section always shows the AccountingExperimentCard
                        component for testing.
                      </p>
                      <AccountingExperimentCard
                        experimentNumber={999}
                        statement="Debug transaction: Cash sale of goods worth Rs.50000 to Mr. Test Customer."
                        correctEntries={[
                          {
                            id: "debug1",
                            date: "01/01/2025",
                            type: "Debit",
                            particulars: "Cash A/c",
                            debit: "50000",
                            credit: "",
                          },
                          {
                            id: "debug2",
                            date: "01/01/2025",
                            type: "Credit",
                            particulars: "Sales A/c",
                            debit: "",
                            credit: "50000",
                          },
                        ]}
                        onComplete={(isCorrect) => {
                          console.log("Debug experiment completed:", isCorrect);
                          alert(
                            `Debug experiment completed: ${
                              isCorrect ? "Correct!" : "Incorrect!"
                            }`
                          );
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : selectedAssignment ? (
                <>
                  <h1 className="text-4xl font-bold text-purple-600 mb-8">
                    {selectedAssignment.title}
                  </h1>
                  <div className="text-lg leading-relaxed bg-white border border-gray-200 rounded-lg p-8 shadow-sm text-gray-900">
                    <div className="mb-6">
                      <p className="text-gray-700">
                        {selectedAssignment.description}
                      </p>
                    </div>

                    {/* Tasks Section */}
                    {selectedAssignment.tasks &&
                      selectedAssignment.tasks.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-xl font-semibold text-purple-800 mb-4">
                            Tasks ({selectedAssignment.tasks.length})
                          </h3>
                          <div className="space-y-4">
                            {selectedAssignment.tasks.map((task, index) => (
                              <div
                                key={task._id || index}
                                className="p-6 bg-purple-50 border border-purple-200 rounded-lg"
                              >
                                <h4 className="text-lg font-semibold text-purple-800 mb-2">
                                  Task {index + 1}: {task.taskName}
                                </h4>
                                <p className="text-purple-700">
                                  {task.instructions}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Content Section */}
                    {selectedAssignment.content &&
                      selectedAssignment.content.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-xl font-semibold text-purple-800 mb-4">
                            Content ({selectedAssignment.content.length})
                          </h3>
                          <div className="space-y-4">
                            {selectedAssignment.content.map(
                              (content, index) => (
                                <div
                                  key={content._id || index}
                                  className="p-6 bg-blue-50 border border-blue-200 rounded-lg"
                                >
                                  <h4 className="text-lg font-semibold text-blue-800 mb-2">
                                    Content {index + 1} - {content.type}
                                  </h4>
                                  {content.type === "video" &&
                                    content.videoUrl && (
                                      <div className="mb-4">
                                        <video
                                          controls
                                          className="w-full max-w-2xl rounded-lg"
                                        >
                                          <source
                                            src={content.videoUrl}
                                            type="video/mp4"
                                          />
                                          Your browser does not support the
                                          video tag.
                                        </video>
                                      </div>
                                    )}
                                  {content.type === "text" &&
                                    content.textContent && (
                                      <div className="text-blue-700 whitespace-pre-wrap">
                                        {content.textContent}
                                      </div>
                                    )}
                                  {content.type === "rich" &&
                                    content.richTextContent && (
                                      <div
                                        className="text-blue-700"
                                        dangerouslySetInnerHTML={{
                                          __html: content.richTextContent,
                                        }}
                                      />
                                    )}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Simulations Section */}
                    {selectedAssignment.simulations &&
                      selectedAssignment.simulations.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-xl font-semibold text-purple-800 mb-4">
                            Simulations ({selectedAssignment.simulations.length}
                            )
                          </h3>
                          <div className="space-y-4">
                            {selectedAssignment.simulations.map(
                              (simulation, index) => (
                                <div
                                  key={simulation._id || index}
                                  className="p-6 bg-green-50 border border-green-200 rounded-lg"
                                >
                                  <h4 className="text-lg font-semibold text-green-800 mb-2">
                                    Simulation {index + 1}: {simulation.title}
                                  </h4>
                                  <p className="text-green-700 mb-2">
                                    {simulation.description}
                                  </p>
                                  <p className="text-sm text-green-600">
                                    Type: {simulation.type} |
                                    {simulation.isOptional
                                      ? " Optional"
                                      : " Required"}
                                  </p>
                                  {simulation.config && (
                                    <div className="mt-3 p-3 bg-white rounded border">
                                      <p className="text-sm text-gray-600">
                                        Configuration available for this
                                        simulation
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Assessment Questions */}
                    {selectedAssignment.questionSets &&
                    selectedAssignment.questionSets.length > 0 ? (
                      <div className="space-y-6">
                        {selectedAssignment.questionSets.map(
                          (questionSet: QuestionSet, index: number) => (
                            <div
                              key={questionSet._id}
                              className="bg-purple-50 border border-purple-200 rounded-lg p-6"
                            >
                              <h3 className="text-lg font-semibold text-purple-800 mb-4">
                                {questionSet.name}
                              </h3>
                              <p className="text-purple-700 mb-4">
                                {questionSet.description}
                              </p>

                              {/* Dynamic Questions */}
                              <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h4 className="text-lg font-semibold text-purple-800 mb-6">
                                  Assessment Questions
                                </h4>

                                {questionSet.questions &&
                                questionSet.questions.length > 0 ? (
                                  <div className="space-y-6">
                                    {questionSet.questions.map(
                                      (question, qIndex) => (
                                        <div
                                          key={qIndex}
                                          className="mb-8 p-4 bg-gray-50 rounded-lg"
                                        >
                                          <h5 className="text-md font-semibold text-gray-800 mb-3">
                                            {qIndex + 1}. {question.question}
                                          </h5>
                                          {question.context && (
                                            <p className="text-sm text-gray-600 mb-3 italic">
                                              {question.context}
                                            </p>
                                          )}
                                          <div className="space-y-2">
                                            {question.options &&
                                              question.options.map(
                                                (option, oIndex) => (
                                                  <label
                                                    key={oIndex}
                                                    className="flex items-center space-x-3 cursor-pointer"
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      className="w-4 h-4 text-purple-600 rounded"
                                                    />
                                                    <span className="text-gray-700">
                                                      {option}
                                                    </span>
                                                  </label>
                                                )
                                              )}
                                          </div>
                                          {question.explanation && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                                              <p className="text-sm text-blue-800">
                                                <strong>Explanation:</strong>{" "}
                                                {question.explanation}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )}

                                    {/* Question Set Info */}
                                    <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        {questionSet.totalQuestions && (
                                          <div>
                                            <span className="font-semibold text-purple-800">
                                              Total Questions:
                                            </span>
                                            <span className="ml-2 text-purple-700">
                                              {questionSet.totalQuestions}
                                            </span>
                                          </div>
                                        )}
                                        {questionSet.timeLimit && (
                                          <div>
                                            <span className="font-semibold text-purple-800">
                                              Time Limit:
                                            </span>
                                            <span className="ml-2 text-purple-700">
                                              {questionSet.timeLimit} minutes
                                            </span>
                                          </div>
                                        )}
                                        {questionSet.passingScore && (
                                          <div>
                                            <span className="font-semibold text-purple-800">
                                              Passing Score:
                                            </span>
                                            <span className="ml-2 text-purple-700">
                                              {questionSet.passingScore}%
                                            </span>
                                          </div>
                                        )}
                                        <div>
                                          <span className="font-semibold text-purple-800">
                                            Questions:
                                          </span>
                                          <span className="ml-2 text-purple-700">
                                            {questionSet.questions.length}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="text-center mt-6">
                                      <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                        Submit Assessment
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-8 text-gray-500">
                                    <p>
                                      No questions available for this question
                                      set.
                                    </p>
                                  </div>
                                )}

                                {/* Question 2 */}
                                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                  <h5 className="text-md font-semibold text-gray-800 mb-3">
                                    2. Which ledger to be recognised for the
                                    payment made through SBI bank account?
                                  </h5>
                                  <div className="space-y-2">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        Cash
                                      </span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        Party
                                      </span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        Bank
                                      </span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        None of the above
                                      </span>
                                    </label>
                                  </div>
                                </div>

                                {/* Question 3 */}
                                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                  <h5 className="text-md font-semibold text-gray-800 mb-3">
                                    3. When equipment is purchased on credit,
                                    which accounts are affected?
                                  </h5>
                                  <div className="space-y-2">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        Equipment (Debit) & Cash (Credit)
                                      </span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        Equipment (Debit) & Accounts Payable
                                        (Credit)
                                      </span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        Cash (Debit) & Equipment (Credit)
                                      </span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        Accounts Payable (Debit) & Equipment
                                        (Credit)
                                      </span>
                                    </label>
                                  </div>
                                </div>

                                {/* Question 4 */}
                                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                  <h5 className="text-md font-semibold text-gray-800 mb-3">
                                    4. What is the correct journal entry for
                                    paying salary advance to an employee?
                                  </h5>
                                  <div className="space-y-2">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        Salary Advance (Debit) & Cash (Credit)
                                      </span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        Cash (Debit) & Salary Advance (Credit)
                                      </span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        Salary Expense (Debit) & Cash (Credit)
                                      </span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        Employee Advance (Debit) & Bank (Credit)
                                      </span>
                                    </label>
                                  </div>
                                </div>

                                {/* Question 5 */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                  <h5 className="text-md font-semibold text-gray-800 mb-3">
                                    5. When services are provided and partial
                                    payment is received, which accounts are
                                    involved?
                                  </h5>
                                  <div className="space-y-2">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        Service Revenue (Credit) & Cash (Debit)
                                        & Accounts Receivable (Debit)
                                      </span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        Cash (Credit) & Service Revenue (Debit)
                                      </span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        Accounts Receivable (Credit) & Service
                                        Revenue (Debit)
                                      </span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 text-purple-600 rounded"
                                      />
                                      <span className="text-gray-700">
                                        Service Expense (Debit) & Cash (Credit)
                                      </span>
                                    </label>
                                  </div>
                                </div>

                                {/* Submit Button */}
                                <div className="text-center">
                                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                    Submit Assessment
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-purple-800 mb-6">
                          Assessment Questions
                        </h4>
                        <div className="text-center py-8 text-gray-500">
                          <p>No question sets available for this assignment.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-lg text-gray-600">
                    Select a chapter and topic to view content
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
