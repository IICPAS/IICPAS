import React, { useState } from "react";
import CourseList from "./Course/CourseList";
import ChapterList from "./Course/ChapterList";
import TopicList from "./Course/TopicList";
import AddOrEditTopicForm from "./Course/AddOrEditTopicForm"; // NEW!

export default function CourseArea() {
  const [view, setView] = useState("list"); // 'list', 'chapters', 'topics', 'add-topic', 'edit-topic'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null); // NEW!

  // Add
  const handleAddTopicTab = () => {
    setEditingTopic(null);
    setView("add-topic");
  };

  // Edit
  const handleEditTopicTab = (topic) => {
    setEditingTopic(topic);
    setView("edit-topic");
  };

  const handleTopicAddedOrCancel = () => {
    setView("topics");
    setEditingTopic(null);
  };

  // ...other handlers unchanged...

  return (
    <>
      {view === "list" && (
        <CourseList
          onAddChapter={(course) => {
            setSelectedCourse(course);
            setView("chapters");
          }}
          onAddCourse={() => {}}
          onEditCourse={() => {}}
          onViewChapters={() => {}}
        />
      )}

      {view === "chapters" && selectedCourse && (
        <ChapterList
          courseId={selectedCourse._id}
          courseName={selectedCourse.title}
          onAddChapter={() => {}}
          onViewCourse={() => {
            setSelectedCourse(null);
            setSelectedChapter(null);
            setView("list");
          }}
          onViewTopics={(chapter) => {
            setSelectedChapter(chapter);
            setView("topics");
          }}
          onEditChapter={() => {}}
        />
      )}

      {view === "topics" && selectedChapter && (
        <TopicList
          chapterId={selectedChapter._id}
          chapterName={selectedChapter.title}
          onViewChapters={() => {
            setSelectedChapter(null);
            setView("chapters");
          }}
          onAddTopic={handleAddTopicTab}
          onEditTopic={handleEditTopicTab}
        />
      )}

      {/* Add/Edit Topic Panel */}
      {(view === "add-topic" || view === "edit-topic") && selectedChapter && (
        <AddOrEditTopicForm
          chapterId={selectedChapter._id}
          chapterName={selectedChapter.title}
          topic={editingTopic} // Pass topic for editing, null for add
          onCancel={handleTopicAddedOrCancel}
          onSaved={handleTopicAddedOrCancel}
        />
      )}
    </>
  );
}
