"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  VideoIcon, 
  ClockIcon, 
  UserIcon, 
  CalendarIcon,
  PlayIcon,
  CheckCircleIcon,
  AlertCircleIcon
} from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

interface LiveClass {
  _id: string;
  title: string;
  subtitle?: string;
  instructor: string;
  instructorBio?: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  duration: number; // in minutes
  maxParticipants: number;
  enrolledCount: number;
  status: 'upcoming' | 'live' | 'completed';
  meetingLink?: string;
  thumbnail?: string;
  imageUrl?: string;
  price: number;
  category: string;
  isEnrolled?: boolean;
}

// Dummy data for CA students
const dummyLiveClasses: LiveClass[] = [
    {
      _id: "1",
      title: "CA Foundation - Accounting Principles",
      instructor: "CA Rajesh Kumar",
      description: "Master the fundamentals of accounting principles, double entry system, and journal entries for CA Foundation exam.",
      startTime: "10:00",
      endTime: "12:00",
      date: "2024-01-20",
      duration: 120,
      maxParticipants: 50,
      enrolledCount: 23,
      status: 'upcoming',
      meetingLink: "https://meet.google.com/abc-defg-hij",
      thumbnail: "/images/accounting.webp",
      price: 0,
      category: "CA Foundation"
    },
    {
      _id: "2",
      title: "CA Intermediate - Advanced Accounting",
      instructor: "CA Priya Sharma",
      description: "Deep dive into advanced accounting concepts including consolidation, amalgamation, and partnership accounting.",
      startTime: "14:00",
      endTime: "16:00",
      date: "2024-01-20",
      duration: 120,
      maxParticipants: 30,
      enrolledCount: 30,
      status: 'live',
      meetingLink: "https://meet.google.com/xyz-1234-abc",
      thumbnail: "/images/young-woman.jpg",
      price: 800,
      category: "CA Intermediate"
    },
    {
      _id: "3",
      title: "CA Final - Strategic Financial Management",
      instructor: "CA Amit Gupta",
      description: "Comprehensive coverage of SFM topics including capital budgeting, risk management, and derivatives.",
      startTime: "18:00",
      endTime: "20:00",
      date: "2024-01-19",
      duration: 120,
      maxParticipants: 40,
      enrolledCount: 40,
      status: 'completed',
      meetingLink: "https://meet.google.com/def-5678-ghi",
      thumbnail: "/images/course.png",
      price: 1200,
      category: "CA Final"
    },
    {
      _id: "4",
      title: "GST & Indirect Tax Laws - Live Session",
      instructor: "CA Neha Singh",
      description: "Complete GST framework, registration, returns filing, and recent amendments in indirect tax laws.",
      startTime: "09:00",
      endTime: "11:00",
      date: "2024-01-21",
      duration: 120,
      maxParticipants: 35,
      enrolledCount: 15,
      status: 'upcoming',
      meetingLink: "https://meet.google.com/ghi-9012-jkl",
      thumbnail: "/images/a4.jpg",
      price: 600,
      category: "Taxation"
    },
    {
      _id: "5",
      title: "CA Foundation - Business Mathematics",
      instructor: "CA Vikram Mehta",
      description: "Essential mathematical concepts for CA Foundation including ratio, proportion, and statistical analysis.",
      startTime: "16:00",
      endTime: "18:00",
      date: "2024-01-22",
      duration: 120,
      maxParticipants: 45,
      enrolledCount: 28,
      status: 'upcoming',
      meetingLink: "https://meet.google.com/jkl-3456-mno",
      thumbnail: "/images/about.jpeg",
      price: 0,
      category: "CA Foundation"
    },
    {
      _id: "6",
      title: "CA Intermediate - Cost & Management Accounting",
      instructor: "CA Sunita Agarwal",
      description: "Master cost concepts, budgeting, variance analysis, and management accounting techniques.",
      startTime: "11:00",
      endTime: "13:00",
      date: "2024-01-18",
      duration: 120,
      maxParticipants: 25,
      enrolledCount: 25,
      status: 'completed',
      meetingLink: "https://meet.google.com/mno-7890-pqr",
      thumbnail: "/images/s.jpg",
      price: 900,
      category: "CA Intermediate"
    }
  ];

export default function LiveClassesDisplay() {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'live' | 'completed'>('upcoming');
  const [user, setUser] = useState<any>(null);
  const [socket, setSocket] = useState<any>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const fetchLiveClasses = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching live sessions from:', `${API}/api/live-sessions`);
      
      const response = await fetch(`${API}/api/live-sessions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      console.log('📡 API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Received live sessions data:', data.length, 'sessions');
        console.log('📊 Sample session statuses:', data.slice(0, 3).map((s: any) => ({ title: s.title, status: s.status })));
        
        // Transform API data to match our interface
              const transformedClasses = data.map((session: any) => ({
                _id: session._id,
                title: session.title,
          subtitle: session.subtitle || session.category,
                instructor: session.instructor || "CA Instructor",
          instructorBio: session.instructorBio || "Expert CA Instructor",
                description: session.description || "Live class session",
                startTime: session.time ? session.time.split(' - ')[0] : "10:00",
                endTime: session.time ? session.time.split(' - ')[1] : "12:00",
                date: session.date,
          duration: session.duration || 120,
                maxParticipants: session.maxParticipants || 50,
          enrolledCount: session.enrolledCount || 0,
          status: session.status,
                meetingLink: session.link,
          thumbnail: session.thumbnail || '/images/live-class.jpg',
          imageUrl: session.imageUrl || session.thumbnail || '/images/live-class.jpg',
                price: session.price || 0,
                category: session.category || "CA Foundation",
          isEnrolled: user ? session.enrolledStudents?.some((student: any) => student._id === user._id) : false
        }));
        
        console.log('🎯 Transformed classes:', transformedClasses.length, 'sessions');
        setLiveClasses(transformedClasses);
      } else {
        console.error('❌ API request failed with status:', response.status);
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        // Fallback to dummy data if API fails
        setLiveClasses(dummyLiveClasses);
      }
    } catch (error: any) {
      console.error("💥 Error fetching live classes:", error);
      if (error.name === 'AbortError') {
        console.error("Request timed out");
        alert("Request timed out. Please check your connection and refresh the page.");
      } else {
        console.error("Network or server error:", error);
      }
      // Fallback to dummy data if API fails
      setLiveClasses(dummyLiveClasses);
    } finally {
      setLoading(false);
    }
  }, [API, user]);

  const getSessionStatus = (session: any): 'upcoming' | 'live' | 'completed' => {
    const now = new Date();
    const sessionDate = new Date(session.date);
    const [startTime, endTime] = session.time ? session.time.split(' - ') : ['10:00', '12:00'];
    
    const sessionStart = new Date(sessionDate);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    sessionStart.setHours(startHour, startMinute, 0, 0);
    
    const sessionEnd = new Date(sessionDate);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    sessionEnd.setHours(endHour, endMinute, 0, 0);
    
    if (now < sessionStart) {
      return 'upcoming';
    } else if (now >= sessionStart && now <= sessionEnd) {
      return 'live';
    } else {
      return 'completed';
    }
  };

  const checkUserAuth = useCallback(async () => {
    try {
      console.log('Checking user authentication...');
      const response = await axios.get(`${API}/api/v1/students/isstudent`, {
        withCredentials: true,
        timeout: 10000, // 10 second timeout
      });
      console.log('User auth response:', response.data);
      setUser(response.data.student);
    } catch (error: any) {
      console.log('User not authenticated or auth check failed:', error.response?.status);
      setUser(null);
    }
  }, [API]);

  const handleEnroll = async (sessionId: string) => {
    if (!user) {
      alert("Please login to enroll in live sessions");
      return;
    }

    try {
      const response = await fetch(`${API}/api/live-sessions/${sessionId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: user._id }),
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update the local state
        setLiveClasses(prevClasses => 
          prevClasses.map(cls => 
            cls._id === sessionId 
              ? { 
                  ...cls, 
                  isEnrolled: true, 
                  enrolledCount: result.session.enrolledCount 
                }
              : cls
          )
        );
        
        // Join socket room for real-time updates
        if (socket) {
          socket.emit('join-session', sessionId);
        }
        
        alert("Successfully enrolled in the live session!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to enroll in the session");
      }
    } catch (error: any) {
      console.error("Error enrolling in session:", error);
      if (error.name === 'AbortError') {
        alert("Request timed out. Please check your connection and try again.");
      } else {
        alert("Failed to enroll in the session. Please try again.");
      }
    }
  };

  const handleJoinClass = async (classId: string, meetingLink: string, isEnrolled: boolean = false) => {
    if (!user) {
      alert("Please login to join the live class");
      return;
    }

    if (!isEnrolled) {
      alert("You need to enroll in this live session first. Purchase a course with Digital Hub+ to get access.");
      return;
    }

    // Open meeting link
    window.open(meetingLink, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <PlayIcon className="w-4 h-4" />;
      case 'upcoming':
        return <ClockIcon className="w-4 h-4" />;
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      default:
        return <AlertCircleIcon className="w-4 h-4" />;
    }
  };

  // useEffect hooks - defined after all functions
  useEffect(() => {
    console.log('Component mounted, initializing...');
    checkUserAuth();
    fetchLiveClasses();
  }, [fetchLiveClasses]);

  useEffect(() => {
    if (user !== null) {
      console.log('User state determined, refetching live classes...');
      fetchLiveClasses();
    }
  }, [user, fetchLiveClasses]);

  // Socket.io connection
  useEffect(() => {
    if (!API) {
      console.warn('API URL not available, skipping Socket.io connection');
      return;
    }

    const socketConnection = io(API, {
      transports: ['polling', 'websocket'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    setSocket(socketConnection);

    // Connection event handlers
    socketConnection.on('connect', () => {
      console.log('✅ Socket.io connected:', socketConnection.id);
    });

    socketConnection.on('connect_error', (error) => {
      console.error('❌ Socket.io connection error:', error);
    });

    socketConnection.on('disconnect', (reason) => {
      console.log('🔌 Socket.io disconnected:', reason);
    });

    socketConnection.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket.io reconnected after', attemptNumber, 'attempts');
    });

    socketConnection.on('reconnect_error', (error) => {
      console.error('❌ Socket.io reconnection error:', error);
    });

    // Listen for enrollment updates
    socketConnection.on('enrollment-update', (data) => {
      console.log('📊 Received enrollment update:', data);
      setLiveClasses(prevClasses => 
        prevClasses.map(cls => 
          cls._id === data.sessionId 
            ? { 
                ...cls, 
                enrolledCount: data.enrolledCount 
              }
            : cls
        )
      );
    });

    return () => {
      console.log('🔌 Disconnecting Socket.io...');
      socketConnection.disconnect();
    };
  }, [API]);

  const filteredClasses = liveClasses.filter(cls => {
    const matches = cls.status === selectedTab;
    if (liveClasses.length > 0) {
      console.log(`🔍 Filtering: "${cls.title}" (${cls.status}) vs "${selectedTab}" = ${matches}`);
    }
    return matches;
  });
  
  console.log(`📊 Filtered classes for "${selectedTab}":`, filteredClasses.length, 'out of', liveClasses.length);


  return (
    <section className="py-16 px-4 md:px-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
            CA Live Classes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our interactive live sessions with expert CA instructors and master your CA exam preparation in real-time
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            {(['upcoming', 'live', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  selectedTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading live sessions...</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-12">
            <VideoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No {selectedTab} classes
            </h3>
            <p className="text-gray-500">
              {selectedTab === 'upcoming' && "Check back later for upcoming live classes"}
              {selectedTab === 'live' && "No live classes are currently running"}
              {selectedTab === 'completed' && "No completed classes to show"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((liveClass, index) => (
              <motion.div
                key={liveClass._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={liveClass.imageUrl || liveClass.thumbnail || '/images/live-class.jpg'} 
                    alt={liveClass.title}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    onLoad={(e) => {
                      console.log('✅ Image loaded successfully:', liveClass.imageUrl || liveClass.thumbnail);
                      e.currentTarget.style.opacity = '1';
                      // Hide loading placeholder
                      const loadingPlaceholder = e.currentTarget.parentElement?.querySelector('.loading-placeholder') as HTMLElement | null;
                      if (loadingPlaceholder) {
                        loadingPlaceholder.style.display = 'none';
                      }
                    }}
                    onError={(e) => {
                      console.log('❌ Image failed to load:', liveClass.imageUrl || liveClass.thumbnail);
                      // Try different fallback strategies
                      const currentSrc = e.currentTarget.src;
                      if (currentSrc.includes('/uploads/')) {
                        // If it's an uploaded image that failed, try client fallback
                        e.currentTarget.src = '/images/live-class.jpg';
                      } else if (currentSrc.includes('/images/')) {
                        // If it's a client image that failed, try a different fallback
                        e.currentTarget.src = '/images/accounting.webp';
                      } else {
                        // If it's a full URL that failed, try default fallback
                        e.currentTarget.src = '/images/live-class.jpg';
                      }
                    }}
                    style={{ opacity: 0 }}
                  />
                  {/* Loading placeholder */}
                  <div className="loading-placeholder absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 text-sm">Loading image...</div>
                  </div>
                  {/* Overlay for text readability */}
                  <div className="absolute inset-0 bg-opacity-10"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(liveClass.status)}`}>
                      {getStatusIcon(liveClass.status)}
                      {liveClass.status.charAt(0).toUpperCase() + liveClass.status.slice(1)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">
                      {liveClass.title}
                    </h3>
                    <p className="text-white text-sm opacity-90 drop-shadow-md">
                      {liveClass.subtitle || liveClass.category}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">{liveClass.instructor}</span>
                      {liveClass.instructorBio && (
                        <p className="text-xs text-gray-500">{liveClass.instructorBio}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {liveClass.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {new Date(liveClass.date).toLocaleDateString()} at {liveClass.startTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {liveClass.duration} minutes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <VideoIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {liveClass.enrolledCount}/{liveClass.maxParticipants} participants
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(liveClass.enrolledCount / liveClass.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                      {liveClass.price === 0 ? 'Free' : `₹${liveClass.price}`}
                    </span>
                  </div>

                  {/* Action Button */}
                  {liveClass.isEnrolled ? (
                  <button
                      onClick={() => handleJoinClass(liveClass._id, liveClass.meetingLink || '', true)}
                    disabled={liveClass.status === 'completed'}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                      liveClass.status === 'live'
                          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg'
                        : liveClass.status === 'upcoming'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-default'
                    }`}
                  >
                      {liveClass.status === 'live' && 'Join Live Class'}
                      {liveClass.status === 'upcoming' && 'Join When Live'}
                    {liveClass.status === 'completed' && 'Class Completed'}
                  </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(liveClass._id)}
                      disabled={liveClass.status === 'completed' || liveClass.enrolledCount >= liveClass.maxParticipants}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                        liveClass.status === 'completed' || liveClass.enrolledCount >= liveClass.maxParticipants
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg'
                      }`}
                    >
                      {liveClass.enrolledCount >= liveClass.maxParticipants ? 'Session Full' : 'Enroll Now'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
