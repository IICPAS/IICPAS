"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SimulatorDemoProps {
  courseId: string;
  student?: any;
}

interface TopicData {
  _id: string;
  topicName: string;
  content: string;
  order: number;
}

interface ChapterData {
  _id: string;
  chapterName: string;
  topics: TopicData[];
}

const SimulatorDemo: React.FC<SimulatorDemoProps> = ({ courseId, student }) => {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  
  // State management
  const [courseChapters, setCourseChapters] = useState<ChapterData[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<ChapterData | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicData | null>(null);
  const [topicContent, setTopicContent] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Demo mode state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDemoLimit, setShowDemoLimit] = useState(false);
  const [isDemo] = useState(true); // Always demo mode for simulator

  // Function to split content into pages (same as digital hub)
  const splitContentIntoPages = (content: string, maxPages: number = 3) => {
    if (!content) return { pages: [], totalPages: 0 };
    
    // Split content by paragraphs or sections
    const paragraphs = content.split(/(?=<h[1-6]|<\/p>|<\/div>|<\/section>)/i);
    const pages = [];
    const itemsPerPage = Math.ceil(paragraphs.length / maxPages);
    
    for (let i = 0; i < paragraphs.length; i += itemsPerPage) {
      const pageContent = paragraphs.slice(i, i + itemsPerPage).join('');
      if (pageContent.trim()) {
        pages.push(pageContent);
      }
    }
    
    return { pages, totalPages: Math.min(pages.length, maxPages) };
  };

  // Fetch course chapters
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/courses/${courseId}/chapters`);
        setCourseChapters(response.data);
        
        // Select first chapter by default
        if (response.data.length > 0) {
          setSelectedChapter(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
        // Use dummy data for demo
        const dummyChapters: ChapterData[] = [
          {
            _id: "demo-chapter-1",
            chapterName: "Introduction to Accounting",
            topics: [
              {
                _id: "demo-topic-1",
                topicName: "What is Accounting?",
                content: btoa(`
                  <h2>What is Accounting?</h2>
                  <p>Accounting is the process of recording, classifying, and summarizing financial transactions to provide information that is useful in making business decisions.</p>
                  
                  <h3>Key Concepts</h3>
                  <p>Accounting involves several key concepts that form the foundation of financial reporting:</p>
                  <ul>
                    <li><strong>Assets:</strong> Resources owned by the business</li>
                    <li><strong>Liabilities:</strong> Debts owed by the business</li>
                    <li><strong>Equity:</strong> Owner's claim on assets</li>
                    <li><strong>Revenue:</strong> Income earned from business operations</li>
                    <li><strong>Expenses:</strong> Costs incurred in earning revenue</li>
                  </ul>
                  
                  <h3>Accounting Equation</h3>
                  <p>The fundamental accounting equation is:</p>
                  <p><strong>Assets = Liabilities + Equity</strong></p>
                  
                  <h3>Types of Accounting</h3>
                  <p>There are several types of accounting:</p>
                  <ol>
                    <li><strong>Financial Accounting:</strong> Focuses on external reporting</li>
                    <li><strong>Managerial Accounting:</strong> Focuses on internal decision making</li>
                    <li><strong>Tax Accounting:</strong> Focuses on tax compliance</li>
                    <li><strong>Cost Accounting:</strong> Focuses on cost analysis</li>
                  </ol>
                  
                  <h3>Importance of Accounting</h3>
                  <p>Accounting is crucial for:</p>
                  <ul>
                    <li>Making informed business decisions</li>
                    <li>Ensuring compliance with regulations</li>
                    <li>Tracking financial performance</li>
                    <li>Facilitating communication with stakeholders</li>
                  </ul>
                `),
                order: 1
              },
              {
                _id: "demo-topic-2",
                topicName: "Basic Accounting Principles",
                content: btoa(`
                  <h2>Basic Accounting Principles</h2>
                  <p>Accounting principles are the fundamental rules and guidelines that govern the preparation of financial statements.</p>
                  
                  <h3>Generally Accepted Accounting Principles (GAAP)</h3>
                  <p>GAAP consists of several key principles:</p>
                  
                  <h4>1. Revenue Recognition Principle</h4>
                  <p>Revenue should be recognized when it is earned, regardless of when payment is received.</p>
                  
                  <h4>2. Matching Principle</h4>
                  <p>Expenses should be matched with the revenues they help generate.</p>
                  
                  <h4>3. Historical Cost Principle</h4>
                  <p>Assets should be recorded at their original cost.</p>
                  
                  <h4>4. Full Disclosure Principle</h4>
                  <p>All relevant information should be disclosed in financial statements.</p>
                  
                  <h3>Accounting Assumptions</h3>
                  <p>Several assumptions underlie accounting:</p>
                  <ul>
                    <li><strong>Going Concern:</strong> Business will continue operating</li>
                    <li><strong>Monetary Unit:</strong> Transactions measured in currency</li>
                    <li><strong>Time Period:</strong> Business activities divided into periods</li>
                    <li><strong>Business Entity:</strong> Business separate from owners</li>
                  </ul>
                `),
                order: 2
              }
            ]
          }
        ];
        setCourseChapters(dummyChapters);
        setSelectedChapter(dummyChapters[0]);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchChapters();
    }
  }, [courseId, API]);

  // Handle topic selection
  const handleTopicSelect = (topic: TopicData) => {
    setSelectedTopic(topic);
    
    if (topic.content) {
      try {
        const decodedContent = atob(topic.content);
        
        // For demo mode, split content into pages and limit to 3 pages
        const { pages, totalPages } = splitContentIntoPages(decodedContent, 3);
        setTotalPages(totalPages);
        setCurrentPage(1);
        setTopicContent(pages[0] || "Content not available");
        setShowDemoLimit(totalPages > 0);
      } catch (error) {
        console.error("Error decoding topic content:", error);
        setTopicContent(topic.content || "Content not available");
        setTotalPages(1);
        setCurrentPage(1);
        setShowDemoLimit(false);
      }
    }
  };

  // Handle page navigation
  const handlePageChange = (page: number) => {
    if (selectedTopic?.content) {
      try {
        const decodedContent = atob(selectedTopic.content);
        const { pages } = splitContentIntoPages(decodedContent, 3);
        setCurrentPage(page);
        setTopicContent(pages[page - 1] || "");
      } catch (error) {
        console.error("Error navigating pages:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg text-gray-600">Loading Simulator...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Topics */}
        <div className="lg:w-1/3">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Content</h3>
            {selectedChapter && (
              <div className="mb-3">
                <h4 className="text-md font-medium text-blue-600">{selectedChapter.chapterName}</h4>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {selectedChapter?.topics.map((topic) => (
              <button
                key={topic._id}
                onClick={() => handleTopicSelect(topic)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                  selectedTopic?._id === topic._id
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="font-medium">{topic.topicName}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:w-2/3">
          {selectedTopic ? (
            <div>
              {/* Demo Limit Banner */}
              {isDemo && showDemoLimit && (
                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-yellow-800 font-bold text-sm">!</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-800">
                          Demo Content - Page {currentPage} of {totalPages}
                        </h3>
                        <p className="text-yellow-700 text-sm">
                          You're viewing a preview of this course content. 
                          {totalPages > 1 && ` Only the first ${totalPages} pages are available in demo mode.`}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push('/student-login')}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Upgrade to Full Access
                    </button>
                  </div>
                </div>
              )}

              {/* Topic Content */}
              <div className="prose max-w-none">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedTopic.topicName}
                  {isDemo && (
                    <span className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                      DEMO MODE
                    </span>
                  )}
                </h1>
                
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: topicContent }}
                />
              </div>

              {/* Demo Mode Controls */}
              {isDemo && (
                <div className="mt-8">
                  {/* Pagination Controls for Multi-page Content */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg"
                        }`}
                      >
                        ← Previous
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`w-8 h-8 rounded-full font-medium transition-all duration-300 ${
                              currentPage === i + 1
                                ? "bg-blue-500 text-white shadow-md"
                                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg"
                        }`}
                      >
                        Next →
                      </button>
                    </div>
                  )}

                  {/* Upgrade Prompt */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        Want to access the full course?
                      </h3>
                      <p className="text-blue-700 mb-4">
                        Get unlimited access to all topics, assignments, and live sessions.
                      </p>
                      <button
                        onClick={() => router.push('/student-login')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                Select a topic to start learning
              </div>
              <p className="text-gray-500">
                Choose any topic from the left sidebar to begin your learning journey.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulatorDemo;
