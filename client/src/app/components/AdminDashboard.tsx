"use client";
import React, { useState } from "react";
import TopicsList from "./TopicsList";
import CaseStudiesList from "./CaseStudiesList";
import AssignmentsList from "./AssignmentsList";
import CaseStudyBuilder from "./CaseStudyBuilder";
import AssignmentBuilder from "./AssignmentBuilder";

interface AdminDashboardProps {
  chapterId: string;
  chapterName: string;
}

type ViewMode = "default" | "caseStudyBuilder" | "assignmentBuilder";

export default function AdminDashboard({
  chapterId,
  chapterName,
}: AdminDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("default");

  const handleAddCaseStudy = () => {
    setViewMode("caseStudyBuilder");
  };

  const handleAddAssignment = () => {
    setViewMode("assignmentBuilder");
  };

  const handleBackToDefault = () => {
    setViewMode("default");
  };

  const renderMainArea = () => {
    switch (viewMode) {
      case "caseStudyBuilder":
        return (
          <CaseStudyBuilder
            chapterId={chapterId}
            chapterName={chapterName}
            onBack={handleBackToDefault}
          />
        );
      case "assignmentBuilder":
        return (
          <AssignmentBuilder
            chapterId={chapterId}
            chapterName={chapterName}
            onBack={handleBackToDefault}
          />
        );
      default:
        return (
          <div className="space-y-8">
            {/* Topics Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Topics</h2>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  ADD TOPIC
                </button>
              </div>
              <TopicsList chapterId={chapterId} />
            </div>

            {/* Case Studies Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Case Studies</h2>
                <button
                  onClick={handleAddCaseStudy}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  ADD CASE STUDY
                </button>
              </div>
              <CaseStudiesList chapterId={chapterId} />
            </div>

            {/* Assignments Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Assignments</h2>
                <button
                  onClick={handleAddAssignment}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  ADD ASSIGNMENT
                </button>
              </div>
              <AssignmentsList chapterId={chapterId} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Topics for '{chapterName}'
        </h1>
        <p className="text-gray-600">
          Manage topics, case studies, and assignments for this chapter
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-200 transition-colors">
          VIEW CHAPTERS
        </button>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
          ADD TOPIC
        </button>
        <button
          onClick={handleAddCaseStudy}
          className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          ADD CASE STUDY
        </button>
        <button
          onClick={handleAddAssignment}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
        >
          ADD ASSIGNMENT
        </button>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[600px]">{renderMainArea()}</div>
    </div>
  );
}
