"use client";

import React from "react";
import Link from "next/link";
import ScribblerGame from "./components/ScribblerGame";
import { FaArrowLeft, FaTrophy, FaGamepad, FaStar } from "react-icons/fa";

export default function GamificationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft /> Back to Home
            </Link>
            <div className="flex items-center gap-2">
              <FaGamepad className="text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">
                Gamification Hub
              </h1>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎮 Gamification Hub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enhance your learning experience with interactive games and
            challenges. Have fun while mastering new concepts!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scribbler Game */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                🎨 Scribbler Game
              </h2>
              <p className="text-gray-600">
                Test your drawing skills and creativity! Draw the given word and
                see how well others can guess it.
              </p>
            </div>
            <ScribblerGame />
          </div>

          {/* Coming Soon Games */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                🚀 More Games Coming Soon!
              </h2>
              <p className="text-gray-600">
                We&apos;re working on exciting new games to make your learning
                journey even more engaging.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 border-l-4 border-purple-500">
                <h3 className="font-semibold text-gray-800 mb-2">
                  🧩 Quiz Challenge
                </h3>
                <p className="text-sm text-gray-600">
                  Interactive quizzes with leaderboards and achievements
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 border-l-4 border-green-500">
                <h3 className="font-semibold text-gray-800 mb-2">
                  🏆 Learning Streaks
                </h3>
                <p className="text-sm text-gray-600">
                  Track your daily learning progress and maintain streaks
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 border-l-4 border-yellow-500">
                <h3 className="font-semibold text-gray-800 mb-2">
                  🎯 Skill Badges
                </h3>
                <p className="text-sm text-gray-600">
                  Earn badges for completing courses and mastering skills
                </p>
              </div>

              <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-lg p-4 border-l-4 border-red-500">
                <h3 className="font-semibold text-gray-800 mb-2">
                  🎪 Memory Match
                </h3>
                <p className="text-sm text-gray-600">
                  Test your memory with card matching games
                </p>
              </div>

              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-4 border-l-4 border-indigo-500">
                <h3 className="font-semibold text-gray-800 mb-2">
                  🔤 Word Puzzle
                </h3>
                <p className="text-sm text-gray-600">
                  Solve word puzzles and crossword challenges
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Game Stats */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Your Gaming Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-gray-600">Games Played</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">0</div>
              <div className="text-gray-600">High Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-gray-600">Badges Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
              <div className="text-gray-600">Current Streak</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            🎯 Quick Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/courses"
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
            >
              <FaStar className="text-blue-600 text-2xl mx-auto mb-2" />
              <div className="font-semibold text-blue-800">Browse Courses</div>
              <div className="text-sm text-blue-600">
                Explore our course catalog
              </div>
            </Link>
            <Link
              href="/student-dashboard"
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors"
            >
              <FaGamepad className="text-green-600 text-2xl mx-auto mb-2" />
              <div className="font-semibold text-green-800">
                Student Dashboard
              </div>
              <div className="text-sm text-green-600">
                Access your learning hub
              </div>
            </Link>
            <Link
              href="/practice"
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors"
            >
              <FaTrophy className="text-purple-600 text-2xl mx-auto mb-2" />
              <div className="font-semibold text-purple-800">
                Practice Tests
              </div>
              <div className="text-sm text-purple-600">Test your knowledge</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
