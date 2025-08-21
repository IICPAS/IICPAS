"use client";
import React, { useState, useRef } from "react";
import Swal from "sweetalert2"; // <-- Add this import
import CourseList from "./Course/CourseList";
import ChapterList from "./Course/ChapterList";
import TopicList from "./Course/TopicList";
import EditCourse from "./Course/EditCourse";
import EditChapter from "./Course/EditChapter";
import AddOrEditTopicForm from "./Course/AddOrEditTopicForm";
import CourseAddTab from "./Course/CourseAdd";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function CourseArea() {
  const [view, setView] = useState("course-list");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingChapter, setEditingChapter] = useState(null);
  const courseListRef = useRef();
  const chapterListRef = useRef();

  // Navigation handlers
  const handleShowCourseList = () => {
    setView("course-list");
    setSelectedCourse(null);
    setSelectedChapter(null);
    setEditingTopic(null);
    courseListRef.current?.fetchCourses?.();
  };

  const handleShowAddCourse = () => {
    setView("add-course");
    setSelectedCourse(null);
    setSelectedChapter(null);
    setEditingTopic(null);
  };

  const handleShowEditCourse = (course) => {
    setSelectedCourse(course);
    setView("edit-course");
    setSelectedChapter(null);
    setEditingTopic(null);
  };

  const handleShowChapters = (course) => {
    setSelectedCourse(course);
    setView("chapters");
    setSelectedChapter(null);
    setEditingTopic(null);
  };

  const handleShowTopics = (chapter) => {
    setSelectedChapter(chapter);
    setView("topics");
    setEditingTopic(null);
  };

  const handleShowAddTopic = () => {
    setEditingTopic(null);
    setView("add-topic");
  };

  const handleShowEditTopic = (topic) => {
    setEditingTopic(topic);
    setView("edit-topic");
  };

  const handleShowEditChapter = (chapter) => {
    setEditingChapter(chapter);
    setView("edit-chapter");
  };

  // Course actions with SweetAlert2
  const handleDeleteCourse = async (course, refreshCourses) => {
    const result = await Swal.fire({
      title: `Delete course "${course.title}"?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API_BASE}/courses/${course._id}`);
      await Swal.fire("Deleted!", "Course deleted successfully.", "success");
      if (refreshCourses) refreshCourses();
    } catch (err) {
      Swal.fire("Error", err?.message || "Error deleting course", "error");
    }
  };

  const handleToggleStatus = async (course, refreshCourses) => {
    const newStatus = course.status === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`${API_BASE}/courses/${course._id}`, {
        status: newStatus,
      });
      await Swal.fire(
        "Status Changed",
        `Course status set to ${newStatus}`,
        "success"
      );
      if (refreshCourses) refreshCourses();
    } catch (err) {
      Swal.fire("Error", err?.message || "Failed to toggle status", "error");
    }
  };

  return (
    <>
      {view === "course-list" && (
        <CourseList
          ref={courseListRef}
          onAddCourse={handleShowAddCourse}
          onEditCourse={handleShowEditCourse}
          onAddChapter={handleShowChapters}
          onDeleteCourse={handleDeleteCourse}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {view === "add-course" && <CourseAddTab onBack={handleShowCourseList} />}

      {view === "edit-course" && selectedCourse && (
        <EditCourse
          courseId={selectedCourse._id}
          onBack={handleShowCourseList}
        />
      )}

      {view === "chapters" && selectedCourse && (
        <ChapterList
          ref={chapterListRef}
          courseId={selectedCourse._id}
          courseName={selectedCourse.title}
          onViewCourse={handleShowCourseList}
          onViewTopics={handleShowTopics}
          onEditChapter={handleShowEditChapter}
        />
      )}

      {view === "topics" && selectedChapter && (
        <TopicList
          chapterId={selectedChapter._id}
          chapterName={selectedChapter.title}
          onViewChapters={() => setView("chapters")}
          onAddTopic={handleShowAddTopic}
          onEditTopic={handleShowEditTopic}
        />
      )}

      {(view === "add-topic" || view === "edit-topic") && selectedChapter && (
        <AddOrEditTopicForm
          chapterId={selectedChapter._id}
          chapterName={selectedChapter.title}
          topic={editingTopic}
          onCancel={() => setView("topics")}
          onSaved={() => setView("topics")}
        />
      )}

      {view === "edit-chapter" && editingChapter && (
        <EditChapter
          chapterId={editingChapter._id}
          onCancel={() => setView("chapters")}
          onUpdated={() => {
            setView("chapters");
            // Refresh chapters list when returning from edit
            if (chapterListRef.current?.fetchChapters) {
              chapterListRef.current.fetchChapters();
            }
          }}
        />
      )}
    </>
  );
}
