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

interface User {
  _id: string;
  name?: string;
  email?: string;
}

export default function LiveClassesDisplay() {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'live' | 'completed'>('upcoming');
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<any>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const fetchLiveClasses = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching live sessions from:', `${API}/api/live-sessions`);
      
      const response = await fetch(`${API}/api/live-sessions`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      console.log('📡 API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Received live sessions data:', data.length, 'sessions');

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

        setLiveClasses(transformedClasses);
      } else {
        console.error('❌ API request failed with status:', response.status);
        setLiveClasses([]); // or fallback dummyLiveClasses
      }
    } catch (error: any) {
      console.error("💥 Error fetching live classes:", error);
      setLiveClasses([]); // or fallback dummyLiveClasses
    } finally {
      setLoading(false);
    }
  }, [API, user]);

  // ... rest of your component remains unchanged
}
