"use client";

import React, { useState, useEffect } from "react";
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

interface LiveClass {
  _id: string;
  title: string;
  instructor: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  duration: number; // in minutes
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'live' | 'completed';
  meetingLink?: string;
  thumbnail?: string;
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
      currentParticipants: 23,
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
      currentParticipants: 30,
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
      currentParticipants: 40,
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
      currentParticipants: 15,
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
      currentParticipants: 28,
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
      currentParticipants: 25,
      status: 'completed',
      meetingLink: "https://meet.google.com/mno-7890-pqr",
      thumbnail: "/images/s.jpg",
      price: 900,
      category: "CA Intermediate"
    }
  ];

interface User {
  _id: string;
  name?: string;
  email?: string;
}

export default function LiveClassesDisplay() {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>(dummyLiveClasses);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'live' | 'completed'>('upcoming');
  const [user, setUser] = useState<User | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Load data in background without blocking UI
    fetchLiveClasses();
    checkUserAuth();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      const response = await fetch(`${API}/api/live-sessions`);
      if (response.ok) {
        const data = await response.json();
        
        // If user is logged in, also fetch their enrolled sessions
        if (user) {
          try {
            const enrolledResponse = await fetch(`${API}/api/v1/students/enrolled-live-sessions/${user._id}`);
            if (enrolledResponse.ok) {
              const enrolledData = await enrolledResponse.json();
              const enrolledSessionIds = enrolledData.enrolledLiveSessions.map((session: any) => session._id);
              
              // Mark enrolled sessions
              const transformedClasses = data.map((session: any) => ({
                _id: session._id,
                title: session.title,
                instructor: session.instructor || "CA Instructor",
                description: session.description || "Live class session",
                startTime: session.time ? session.time.split(' - ')[0] : "10:00",
                endTime: session.time ? session.time.split(' - ')[1] : "12:00",
                date: session.date,
                duration: 120, // Default duration
                maxParticipants: session.maxParticipants || 50,
                currentParticipants: Math.floor(Math.random() * (session.maxParticipants || 50)),
                status: getSessionStatus(session),
                meetingLink: session.link,
                thumbnail: session.thumbnail || "/images/accounting.webp",
                price: session.price || 0,
                category: session.category || "CA Foundation",
                isEnrolled: enrolledSessionIds.includes(session._id)
              }));
              setLiveClasses(transformedClasses);
              return;
            }
          } catch (enrolledError) {
            console.error("Error fetching enrolled sessions:", enrolledError);
          }
        }
        
        // Fallback: transform API data without enrollment info
        const transformedClasses = data.map((session: any) => ({
          _id: session._id,
          title: session.title,
          instructor: session.instructor || "CA Instructor",
          description: session.description || "Live class session",
          startTime: session.time ? session.time.split(' - ')[0] : "10:00",
          endTime: session.time ? session.time.split(' - ')[1] : "12:00",
          date: session.date,
          duration: 120, // Default duration
          maxParticipants: session.maxParticipants || 50,
          currentParticipants: Math.floor(Math.random() * (session.maxParticipants || 50)),
          status: getSessionStatus(session),
          meetingLink: session.link,
          thumbnail: session.thumbnail || "/images/accounting.webp",
          price: session.price || 0,
          category: session.category || "CA Foundation",
          isEnrolled: false
        }));
        setLiveClasses(transformedClasses);
      }
      // If API fails, keep showing dummy data (no need to update)
    } catch (error) {
      console.error("Error fetching live classes:", error);
      // Keep showing dummy data if API fails
    }
  };

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

  const checkUserAuth = async () => {
    try {
      const response = await axios.get(`${API}/api/v1/students/isstudent`, {
        withCredentials: true,
      });
      setUser(response.data.student);
    } catch (error) {
      setUser(null);
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

  const filteredClasses = liveClasses.filter(cls => cls.status === selectedTab);


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

        {/* Live Classes Grid */}
        {filteredClasses.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((liveClass, index) => (
              <motion.div
                key={liveClass._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-green-500 overflow-hidden">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${liveClass.thumbnail || '/images/ca-default.jpg'})`
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(liveClass.status)}`}>
                      {getStatusIcon(liveClass.status)}
                      {liveClass.status.charAt(0).toUpperCase() + liveClass.status.slice(1)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg mb-1">
                      {liveClass.title}
                    </h3>
                    <p className="text-white text-sm opacity-90">
                      {liveClass.category}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{liveClass.instructor}</span>
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
                        {liveClass.currentParticipants}/{liveClass.maxParticipants} participants
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      {liveClass.price === 0 ? 'Free' : `₹${liveClass.price}`}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleJoinClass(liveClass._id, liveClass.meetingLink || '', liveClass.isEnrolled || false)}
                    disabled={liveClass.status === 'completed'}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      liveClass.status === 'live'
                        ? liveClass.isEnrolled
                          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg'
                          : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg cursor-not-allowed'
                        : liveClass.status === 'upcoming'
                        ? liveClass.isEnrolled
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg'
                          : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-400 to-green-400 text-white shadow-lg cursor-default'
                    }`}
                  >
                    {liveClass.status === 'live' && (liveClass.isEnrolled ? 'Join Live Class' : 'Not Enrolled')}
                    {liveClass.status === 'upcoming' && (liveClass.isEnrolled ? 'Join When Live' : 'Not Enrolled')}
                    {liveClass.status === 'completed' && 'Class Completed'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
