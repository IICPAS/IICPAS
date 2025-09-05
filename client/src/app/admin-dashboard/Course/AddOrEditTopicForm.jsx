"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  IconButton,
  Link,
  Modal,
  Paper,
} from "@mui/material";
import * as XLSX from "xlsx";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Delete,
  Visibility,
  Close,
  Add,
  DragIndicator,
} from "@mui/icons-material";
import dynamic from "next/dynamic";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Debounce utility function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const STATIC_CDN_BASE = "https://cdn.iicpa.in";

console.log(STATIC_CDN_BASE);
const joditConfig = {
  readonly: false,
  height: 300,
  uploader: { insertImageAsBase64URI: true },
  toolbarAdaptive: false,
  showCharsCounter: false,
  showWordsCounter: false,
  spellcheck: true,
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: "insert_clear_html",
  enterMode: "BR",
  useSearch: false,
  showXPathInStatusbar: false,
  toolbar: [
    "source",
    "|",
    "bold",
    "strikethrough",
    "underline",
    "italic",
    "|",
    "ul",
    "ol",
    "|",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "image",
    "link",
    "table",
    "|",
    "align",
    "undo",
    "redo",
    "|",
    "hr",
    "eraser",
    "copyformat",
    "|",
    "fullsize",
  ],
  events: {
    afterInit: function (editor) {
      // Override the list commands to ensure they work
      const originalExecCommand = editor.execCommand;
      editor.execCommand = function (command, showUI, value) {
        if (command === "insertUnorderedList") {
          const selection = editor.selection;
          const selectedText = selection.getText();

          if (selectedText) {
            // If text is selected, wrap it in list items
            const lines = selectedText.split("\n");
            const listItems = lines.map((line) => `<li>${line}</li>`).join("");
            selection.insertHTML(`<ul>${listItems}</ul>`);
          } else {
            // If no text selected, insert a bullet point
            selection.insertHTML("<ul><li>• </li></ul>");
          }
          return true;
        } else if (command === "insertOrderedList") {
          const selection = editor.selection;
          const selectedText = selection.getText();

          if (selectedText) {
            // If text is selected, wrap it in list items
            const lines = selectedText.split("\n");
            const listItems = lines.map((line) => `<li>${line}</li>`).join("");
            selection.insertHTML(`<ol>${listItems}</ol>`);
          } else {
            // If no text selected, insert a numbered point
            selection.insertHTML("<ol><li>1. </li></ul>");
          }
          return true;
        }
        return originalExecCommand.call(this, command, showUI, value);
      };
    },
  },
};
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
export default function AddOrEditTopicForm({
  chapterId,
  chapterName,
  topic,
  onCancel,
  onSaved,
}) {
  const editor = useRef(null);
  const [title, setTitle] = useState(topic?.title || "");
  const [content, setContent] = useState(topic?.content || "");
  const [quizFile, setQuizFile] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [videoLinks, setVideoLinks] = useState([]);
  const [imageLinks, setImageLinks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [quizPreviewOpen, setQuizPreviewOpen] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [quizEditorOpen, setQuizEditorOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);
  const [uploadedFiles, setUploadedFiles] = useState({
    images: [],
    videos: [],
  });
  const [loadingFiles, setLoadingFiles] = useState(false);

  // Debounced content update to prevent typing interruption

  // Quiz editing functions
  const openQuizEditor = () => {
    setQuizEditorOpen(true);
  };

  const closeQuizEditor = () => {
    setQuizEditorOpen(false);
    setEditingQuestion(null);
    setEditingQuestionIndex(-1);
  };

  const addNewQuestion = () => {
    setEditingQuestion({
      question: "",
      options: ["", "", "", ""],
      answer: "",
    });
    setEditingQuestionIndex(-1); // -1 means new question
    setQuizEditorOpen(true);
  };

  const editQuestion = (question, index) => {
    setEditingQuestion({ ...question });
    setEditingQuestionIndex(index);
    setQuizEditorOpen(true);
  };

  const deleteQuestion = (index) => {
    const newQuizData = [...quizData];
    newQuizData.splice(index, 1);
    setQuizData(newQuizData);
    Swal.fire(
      "Question Deleted",
      "Question has been removed from the quiz.",
      "success"
    );
  };

  const saveQuestion = () => {
    if (!editingQuestion.question.trim()) {
      Swal.fire("Error", "Question text is required", "error");
      return;
    }

    const validOptions = editingQuestion.options.filter((opt) => opt.trim());
    if (validOptions.length < 2) {
      Swal.fire("Error", "At least 2 options are required", "error");
      return;
    }

    if (!editingQuestion.answer.trim()) {
      Swal.fire("Error", "Correct answer is required", "error");
      return;
    }

    if (!validOptions.includes(editingQuestion.answer)) {
      Swal.fire(
        "Error",
        "Correct answer must match one of the options",
        "error"
      );
      return;
    }

    const newQuizData = [...quizData];
    if (editingQuestionIndex >= 0) {
      // Update existing question
      newQuizData[editingQuestionIndex] = {
        ...editingQuestion,
        options: validOptions,
      };
    } else {
      // Add new question
      newQuizData.push({
        ...editingQuestion,
        options: validOptions,
      });
    }

    setQuizData(newQuizData);
    closeQuizEditor();
    Swal.fire(
      "Success",
      editingQuestionIndex >= 0 ? "Question updated!" : "Question added!",
      "success"
    );
  };

  // Drag and drop handler for reordering questions
  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(quizData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuizData(items);
    Swal.fire(
      "Question Reordered",
      "Question order has been updated!",
      "success"
    );
  };

  useEffect(() => {
    if (topic) {
      console.log("Topic data received:", topic);
      setTitle(topic.title || "");
      setContent(topic.content || "");
      setVideoLinks(topic.videos || []);

      // Load existing quiz data if available
      if (topic.quiz) {
        console.log("Topic has quiz:", topic.quiz);
        loadExistingQuiz(topic.quiz);
      } else {
        console.log("Topic has no quiz");
      }
    }

    // Fetch uploaded files when component mounts
    fetchUploadedFiles();
  }, [topic]);

  // Fetch uploaded files from static-backend
  const fetchUploadedFiles = async () => {
    setLoadingFiles(true);
    try {
      // Fetch images and videos in parallel
      const [imagesRes, videosRes] = await Promise.all([
        axios.get(`${STATIC_CDN_BASE}/files/images`),
        axios.get(`${STATIC_CDN_BASE}/files/videos`),
      ]);

      if (imagesRes.data.success && videosRes.data.success) {
        setUploadedFiles({
          images: imagesRes.data.data || [],
          videos: videosRes.data.data || [],
        });
      }
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      // Don't show error to user as this is not critical
    } finally {
      setLoadingFiles(false);
    }
  };

  // Delete uploaded file
  const handleDeleteFile = async (fileId, fileType) => {
    try {
      await axios.delete(`${STATIC_CDN_BASE}/files/${fileId}`);

      // Remove from local state
      setUploadedFiles((prev) => ({
        ...prev,
        [fileType]: prev[fileType].filter((file) => file.id !== fileId),
      }));

      // Also remove from links if present
      if (fileType === "videos") {
        setVideoLinks((prev) =>
          prev.filter((link) => !link.includes(fileId.toString()))
        );
      } else if (fileType === "images") {
        setImageLinks((prev) =>
          prev.filter((link) => !link.includes(fileId.toString()))
        );
      }

      Swal.fire("Success", "File deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting file:", error);
      Swal.fire("Error", "Failed to delete file", "error");
    }
  };

  const loadExistingQuiz = async (quizId) => {
    try {
      console.log("loadExistingQuiz called with:", quizId, typeof quizId);

      // Ensure quizId is a string
      const id = typeof quizId === "object" ? quizId._id || quizId : quizId;
      console.log("Processed quiz ID:", id);

      if (!id) {
        console.log("No quiz ID found, skipping quiz load");
        return;
      }

      const response = await axios.get(`${API_BASE}/quizzes/${id}`);
      console.log("Quiz API response:", response.data);

      if (
        response.data &&
        response.data.success &&
        response.data.quiz &&
        response.data.quiz.questions
      ) {
        setQuizData(response.data.quiz.questions);
        console.log("Loaded existing quiz:", response.data.quiz.questions);
      }
    } catch (error) {
      console.error("Error loading existing quiz:", error);
      // Try to load quiz by topic ID as fallback
      if (topic && topic._id) {
        try {
          console.log("Trying to load quiz by topic ID:", topic._id);
          const topicResponse = await axios.get(
            `${API_BASE}/quizzes/topic/${topic._id}`
          );
          console.log("Topic quiz response:", topicResponse.data);

          if (
            topicResponse.data &&
            topicResponse.data.success &&
            topicResponse.data.quiz &&
            topicResponse.data.quiz.questions
          ) {
            setQuizData(topicResponse.data.quiz.questions);
            console.log(
              "Loaded quiz by topic:",
              topicResponse.data.quiz.questions
            );
          }
        } catch (topicError) {
          console.error("Error loading quiz by topic:", topicError);
        }
      }
    }
  };

  const handleEditorReady = (editorInstance) => {
    if (editorInstance) {
      editor.current = editorInstance;
      setEditorReady(true);
    }
  };

  // Preserve scroll position when opening/closing modal
  const handlePreviewOpen = () => {
    setScrollPosition(window.scrollY);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    // Restore scroll position after modal closes
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 100);
  };

  // Function to process content for preview with proper formatting
  const processContentForPreview = (htmlContent) => {
    if (!htmlContent) return "";

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Enhance headings with proper styling
    const headings = tempDiv.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headings.forEach((heading) => {
      heading.style.fontWeight = "600";
      heading.style.marginTop = "1.5rem";
      heading.style.marginBottom = "1rem";
      heading.style.color = "#1a202c";
      heading.style.borderBottom = "2px solid #e2e8f0";
      heading.style.paddingBottom = "0.5rem";
    });

    // Style paragraphs
    const paragraphs = tempDiv.querySelectorAll("p");
    paragraphs.forEach((p) => {
      p.style.marginBottom = "1rem";
      p.style.lineHeight = "1.6";
      p.style.color = "#2d3748";
    });

    // Center and style images
    const images = tempDiv.querySelectorAll("img");
    images.forEach((img) => {
      img.style.display = "block";
      img.style.margin = "2rem auto";
      img.style.maxWidth = "90%";
      img.style.minWidth = "400px";
      img.style.height = "auto";
      img.style.borderRadius = "12px";
      img.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)";
      img.style.border = "2px solid #f0f0f0";
    });

    // Center and style videos
    const videos = tempDiv.querySelectorAll("video");
    videos.forEach((video) => {
      video.style.display = "block";
      video.style.margin = "2rem auto";
      video.style.maxWidth = "80%";
      video.style.minWidth = "500px";
      video.style.height = "auto";
      video.style.borderRadius = "12px";
      video.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)";
      video.style.border = "2px solid #f0f0f0";
    });

    // Center and style iframes (for embedded videos)
    const iframes = tempDiv.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      iframe.style.display = "block";
      iframe.style.margin = "2rem auto";
      iframe.style.maxWidth = "80%";
      iframe.style.minWidth = "500px";
      iframe.style.borderRadius = "12px";
      iframe.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)";
      iframe.style.border = "2px solid #f0f0f0";
    });

    // Style lists
    const lists = tempDiv.querySelectorAll("ul, ol");
    lists.forEach((list) => {
      list.style.marginBottom = "1rem";
      list.style.paddingLeft = "1.5rem";
    });

    // Style list items
    const listItems = tempDiv.querySelectorAll("li");
    listItems.forEach((li) => {
      li.style.marginBottom = "0.5rem";
      li.style.lineHeight = "1.6";
    });

    // Style tables
    const tables = tempDiv.querySelectorAll("table");
    tables.forEach((table) => {
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.style.marginBottom = "1.5rem";
      table.style.borderRadius = "8px";
      table.style.overflow = "hidden";
      table.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
    });

    // Style table cells
    const cells = tempDiv.querySelectorAll("td, th");
    cells.forEach((cell) => {
      cell.style.padding = "0.75rem";
      cell.style.border = "1px solid #e2e8f0";
      cell.style.textAlign = "left";
    });

    // Style table headers
    const headers = tempDiv.querySelectorAll("th");
    headers.forEach((header) => {
      header.style.backgroundColor = "#f7fafc";
      header.style.fontWeight = "600";
    });

    return tempDiv.innerHTML;
  };

  const downloadQuizTemplate = () => {
    const templateData = [
      {
        question: "What is the capital of France?",
        option1: "London",
        option2: "Paris",
        option3: "Berlin",
        option4: "Madrid",
        answer: "Paris",
      },
      {
        question: "Which planet is closest to the Sun?",
        option1: "Venus",
        option2: "Earth",
        option3: "Mars",
        option4: "Mercury",
        answer: "Mercury",
      },
      {
        question: "What is 2 + 2?",
        option1: "3",
        option2: "4",
        option3: "5",
        option4: "6",
        answer: "4",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Template");

    // Generate and download the file
    XLSX.writeFile(workbook, "quiz_template.xlsx");

    Swal.fire({
      title: "Template Downloaded!",
      text: "quiz_template.xlsx has been downloaded. Use this as a reference for your quiz format.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const handleQuizUpload = (e) => {
    const file = e.target.files[0];
    setQuizFile(file);
    if (!file) return;

    // Check file size (5MB limit for Excel files)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "Excel file size must be less than 5MB", "error");
      return;
    }

    // Check file type
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx)$/i)) {
      Swal.fire(
        "Error",
        "Please select a valid Excel file (.xls or .xlsx)",
        "error"
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (rows.length === 0) {
          Swal.fire("Error", "Excel file is empty or has no data", "error");
          return;
        }

        const questions = [];
        const errors = [];

        rows.forEach((row, index) => {
          const question = row.question || row.Question || "";
          const option1 = row.option1 || row.Option1 || "";
          const option2 = row.option2 || row.Option2 || "";
          const option3 = row.option3 || row.Option3 || "";
          const option4 = row.option4 || row.Option4 || "";
          const answer = row.answer || row.Answer || "";

          // Skip completely empty rows
          if (
            !question.trim() &&
            !option1.trim() &&
            !option2.trim() &&
            !option3.trim() &&
            !option4.trim() &&
            !answer.trim()
          ) {
            return; // Skip this row entirely
          }

          // Validation
          if (!question.trim()) {
            errors.push(`Row ${index + 1}: Question is required`);
            return;
          }

          const options = [option1, option2, option3, option4].filter(Boolean);
          if (options.length < 2) {
            errors.push(`Row ${index + 1}: At least 2 options are required`);
            return;
          }

          if (!answer.trim()) {
            errors.push(`Row ${index + 1}: Answer is required`);
            return;
          }

          if (!options.includes(answer)) {
            errors.push(
              `Row ${index + 1}: Answer must match one of the options exactly`
            );
            return;
          }

          questions.push({
            question: question.trim(),
            options: options,
            answer: answer.trim(),
          });
        });

        if (errors.length > 0) {
          let errorMessage = "";
          if (errors.length > 10) {
            errorMessage =
              `Found ${errors.length} validation errors. The first 5 errors are:<br><br>` +
              errors.slice(0, 5).join("<br>") +
              `<br><br><strong>Please check your Excel file format. Make sure:</strong><br>` +
              `• Column headers are: question, option1, option2, option3, option4, answer<br>` +
              `• All required fields are filled<br>` +
              `• Answer matches one of the options exactly<br>` +
              `• Empty rows are removed`;
          } else {
            errorMessage = errors.join("<br>");
          }

          Swal.fire({
            title: "Validation Errors",
            html: errorMessage,
            icon: "error",
            confirmButtonText: "OK",
            width: "600px",
          });
          return;
        }

        if (questions.length === 0) {
          Swal.fire({
            title: "No Valid Questions Found",
            text: "No valid quiz questions were found in the Excel file. Please check the format and try again.",
            icon: "warning",
            confirmButtonText: "OK",
          });
          return;
        }

        setQuizData(questions);
        Swal.fire({
          title: "Quiz Loaded Successfully!",
          text: `${questions.length} questions parsed from ${file.name}`,
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        Swal.fire(
          "Error",
          "Failed to parse Excel file. Please check the format.",
          "error"
        );
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (300MB limit for videos)
    if (file.size > 300 * 1024 * 1024) {
      Swal.fire("Error", "Video size must be less than 300MB", "error");
      return;
    }

    // Check file type
    if (!file.type.startsWith("video/")) {
      Swal.fire("Error", "Please select a valid video file", "error");
      return;
    }

    const formData = new FormData();

    console.log("11", STATIC_CDN_BASE);
    formData.append("video", file);

    try {
      // Upload to static-backend microservice

      const res = await axios.post(
        `${STATIC_CDN_BASE}/upload/video`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success && res.data.data.cdnUrl) {
        // Add the video URL to the list
        setVideoLinks((prev) => [...prev, res.data.data.cdnUrl]);
        Swal.fire({
          title: "Video Uploaded Successfully!",
          text: "Video URL is now available below. You can copy and use it in the editor.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire("Error", "Failed to get video URL", "error");
      }
    } catch (err) {
      console.error("Video upload error:", err);
      Swal.fire("Error", err.response?.data?.error || "Upload failed", "error");
    }
  };

  // Handle multiple video uploads
  const handleMultipleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check if too many files
    if (files.length > 5) {
      Swal.fire("Error", "Maximum 5 videos allowed per upload", "error");
      return;
    }

    // Validate files
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      if (file.size > 300 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (too large)`);
      } else if (!file.type.startsWith("video/")) {
        invalidFiles.push(`${file.name} (invalid type)`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      Swal.fire("Error", `Invalid files: ${invalidFiles.join(", ")}`, "error");
      return;
    }

    if (validFiles.length === 0) return;

    const formData = new FormData();
    validFiles.forEach((file) => {
      formData.append("videos", file);
    });

    try {
      // Upload to static-backend microservice
      const res = await axios.post(
        `${STATIC_CDN_BASE}/upload/videos`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        // Add all video URLs to the list
        const newUrls = res.data.data.uploaded.map((file) => file.cdnUrl);
        setVideoLinks((prev) => [...prev, ...newUrls]);

        Swal.fire({
          title: "Videos Uploaded Successfully!",
          text: `${res.data.data.successful} videos uploaded. URLs are now available below.`,
          icon: "success",
          confirmButtonText: "OK",
        });

        // Refresh the uploaded files list
        fetchUploadedFiles();
      } else {
        Swal.fire("Error", "Failed to upload videos", "error");
      }
    } catch (err) {
      console.error("Multiple videos upload error:", err);
      Swal.fire("Error", err.response?.data?.error || "Upload failed", "error");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "Image size must be less than 5MB", "error");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      Swal.fire("Error", "Please select a valid image file", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      // Upload to static-backend microservice
      const res = await axios.post(
        `${STATIC_CDN_BASE}/upload/image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success && res.data.data.cdnUrl) {
        // Add the image URL to the list
        setImageLinks((prev) => [...prev, res.data.data.cdnUrl]);
        Swal.fire({
          title: "Image Uploaded Successfully!",
          text: "Image URL is now available below. You can copy and use it in the editor.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire("Error", "Failed to get image URL", "error");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      Swal.fire("Error", err.response?.data?.error || "Upload failed", "error");
    }
  };

  // Handle multiple image uploads
  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check if too many files
    if (files.length > 10) {
      Swal.fire("Error", "Maximum 10 images allowed per upload", "error");
      return;
    }

    // Validate files
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (too large)`);
      } else if (!file.type.startsWith("image/")) {
        invalidFiles.push(`${file.name} (invalid type)`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      Swal.fire("Error", `Invalid files: ${invalidFiles.join(", ")}`, "error");
      return;
    }

    if (validFiles.length === 0) return;

    const formData = new FormData();
    validFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      // Upload to static-backend microservice
      const res = await axios.post(
        `${STATIC_CDN_BASE}/upload/images`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        // Add all image URLs to the list
        const newUrls = res.data.data.uploaded.map((file) => file.cdnUrl);
        setImageLinks((prev) => [...prev, ...newUrls]);

        Swal.fire({
          title: "Images Uploaded Successfully!",
          text: `${res.data.data.successful} images uploaded. URLs are now available below.`,
          icon: "success",
          confirmButtonText: "OK",
        });

        // Refresh the uploaded files list
        fetchUploadedFiles();
      } else {
        Swal.fire("Error", "Failed to upload images", "error");
      }
    } catch (err) {
      console.error("Multiple images upload error:", err);
      Swal.fire("Error", err.response?.data?.error || "Upload failed", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      Swal.fire("Validation", "Title and content required!", "warning");
      return;
    }
    setSaving(true);
    try {
      let topicId;
      if (topic) {
        // Update existing topic
        await axios.put(`${API_BASE}/topics/${topic._id}`, {
          title: title.trim(),
          content,
        });
        topicId = topic._id;
      } else {
        // Create new topic
        const topicRes = await axios.post(
          `${API_BASE}/topics/by-chapter/${chapterId}`,
          {
            title: title.trim(),
            content,
          }
        );
        topicId = topicRes.data._id;
      }

      // Handle quiz creation/update
      if (quizData && quizData.length > 0) {
        try {
          await axios.post(`${API_BASE}/quizzes/topic/${topicId}`, {
            questions: quizData,
          });
        } catch (quizError) {
          console.error("Error saving quiz:", quizError);
          // Don't fail the entire operation if quiz fails
          Swal.fire(
            "Warning",
            "Topic saved but quiz update failed. Please try again.",
            "warning"
          );
        }
      }

      setTitle("");
      setContent("");
      setQuizFile(null);
      setQuizData(null);
      setVideoLinks([]);
      onSaved && onSaved();
      const quizMessage =
        quizData?.length > 0 ? ` with ${quizData.length} quiz questions` : "";
      Swal.fire(
        "Success!",
        topic ? `Topic updated${quizMessage}!` : `Topic added${quizMessage}!`,
        "success"
      );
    } catch (err) {
      console.error("Error saving topic:", err);
      Swal.fire("Error", "Failed to save topic.", "error");
    }
    setSaving(false);
  };

  return (
    <Box sx={{ width: "75vw", maxWidth: "76vw", mx: "auto", mt: 3 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ p: { xs: 2, md: 5 } }}>
          <Typography
            variant="h5"
            fontWeight={700}
            align="center"
            sx={{ fontSize: 28 }}
          >
            {topic ? "Edit Topic" : "Add Topic"} for "{chapterName}"
          </Typography>

          <TextField
            label="Topic Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />

          {/* Upload and show video links */}
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography fontWeight={600} fontSize={15}>
                Upload Videos
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={fetchUploadedFiles}
                disabled={loadingFiles}
              >
                {loadingFiles ? "Loading..." : "Refresh Files"}
              </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Upload videos to get a direct link. Copy the link below and use it
              in the editor.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button component="label" variant="contained">
                Upload Single Video
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={handleVideoUpload}
                />
              </Button>
              <Button component="label" variant="outlined" color="primary">
                Upload Multiple Videos
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  hidden
                  onChange={handleMultipleVideoUpload}
                />
              </Button>
            </Stack>

            {/* Display existing uploaded videos */}
            {uploadedFiles.videos.length > 0 && (
              <Box mt={2} mb={2}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  📁 Previously Uploaded Videos:
                </Typography>
                <Stack spacing={1}>
                  {uploadedFiles.videos.map((file) => (
                    <Box
                      key={file.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#f0f9ff",
                        p: 2,
                        borderRadius: 1,
                        border: "1px solid #bae6fd",
                      }}
                    >
                      <Box sx={{ flex: 1, mr: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, mb: 0.5 }}
                        >
                          {file.original_name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            wordBreak: "break-all",
                            fontFamily: "monospace",
                            fontSize: "0.8rem",
                            color: "#0369a1",
                          }}
                        >
                          {file.cdn_url}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Size: {(file.file_size / (1024 * 1024)).toFixed(2)} MB
                          • Uploaded:{" "}
                          {new Date(file.upload_date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            navigator.clipboard.writeText(file.cdn_url);
                            Swal.fire(
                              "Copied!",
                              "Video URL copied to clipboard",
                              "success"
                            );
                          }}
                        >
                          Copy
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            if (editor.current) {
                              const videoHtml = `<div style="text-align: center; margin: 2rem 0;">
                                <video controls style="max-width: 80%; min-width: 500px; height: auto; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); border: 2px solid #f0f0f0;">
                                  <source src="${file.cdn_url}" type="video/mp4">
                                  <source src="${file.cdn_url}" type="video/webm">
                                  <source src="${file.cdn_url}" type="video/ogg">
                                  Your browser does not support the video tag.
                                </video>
                              </div>`;
                              editor.current.selection.insertHTML(videoHtml);
                              Swal.fire(
                                "Video Inserted!",
                                "Video has been inserted into the editor",
                                "success"
                              );
                            }
                          }}
                        >
                          Insert
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteFile(file.id, "videos")}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Display uploaded video links */}
            <Stack mt={2} spacing={1}>
              {videoLinks.map((url, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#f8f9fa",
                    p: 2,
                    borderRadius: 1,
                    border: "1px solid #e9ecef",
                  }}
                >
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Video URL:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        wordBreak: "break-all",
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                        color: "#007bff",
                      }}
                    >
                      {url}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        navigator.clipboard.writeText(url);
                        Swal.fire(
                          "Copied!",
                          "Video URL copied to clipboard",
                          "success"
                        );
                      }}
                    >
                      Copy
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        if (editor.current) {
                          // Insert video as embedded player with better formatting
                          const videoHtml = `<div style="text-align: center; margin: 2rem 0;">
                            <video controls style="max-width: 80%; min-width: 500px; height: auto; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); border: 2px solid #f0f0f0;">
                              <source src="${url}" type="video/mp4">
                              <source src="${url}" type="video/webm">
                              <source src="${url}" type="video/ogg">
                              Your browser does not support the video tag.
                            </video>
                          </div>`;
                          editor.current.selection.insertHTML(videoHtml);
                          Swal.fire(
                            "Video Inserted!",
                            "Video has been inserted into the editor as a player",
                            "success"
                          );
                        }
                      }}
                    >
                      Insert
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="info"
                      onClick={() => {
                        if (editor.current) {
                          // Insert as clickable link
                          const linkHtml = `<a href="${url}" target="_blank" style="color: #007bff; text-decoration: underline;">📹 Watch Video: ${url
                            .split("/")
                            .pop()}</a>`;
                          editor.current.selection.insertHTML(linkHtml);
                          Swal.fire(
                            "Link Inserted!",
                            "Video link has been inserted into the editor",
                            "success"
                          );
                        }
                      }}
                    >
                      Link
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        // Test video URL
                        const testVideo = document.createElement("video");
                        testVideo.src = url;
                        testVideo.controls = true;
                        testVideo.style.width = "300px";
                        testVideo.style.height = "200px";

                        Swal.fire({
                          title: "Video Test",
                          html: testVideo.outerHTML,
                          width: 400,
                          showConfirmButton: true,
                          confirmButtonText: "Close",
                        });
                      }}
                    >
                      Test
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        setVideoLinks((prev) =>
                          prev.filter((_, index) => index !== i)
                        )
                      }
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Upload Images */}
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography fontWeight={600} fontSize={15}>
                Upload Images
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={fetchUploadedFiles}
                disabled={loadingFiles}
              >
                {loadingFiles ? "Loading..." : "Refresh Files"}
              </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Upload images to get a direct link. Copy the link below and use it
              in the editor.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button component="label" variant="contained" color="secondary">
                Upload Single Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </Button>
              <Button component="label" variant="outlined" color="secondary">
                Upload Multiple Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleMultipleImageUpload}
                />
              </Button>
            </Stack>

            {/* Display existing uploaded images */}
            {uploadedFiles.images.length > 0 && (
              <Box mt={2} mb={2}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  🖼️ Previously Uploaded Images:
                </Typography>
                <Stack spacing={1}>
                  {uploadedFiles.images.map((file) => (
                    <Box
                      key={file.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#fef3c7",
                        p: 2,
                        borderRadius: 1,
                        border: "1px solid #fcd34d",
                      }}
                    >
                      <Box sx={{ flex: 1, mr: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <img
                            src={file.cdn_url}
                            alt={file.original_name}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "2px solid #f59e0b",
                            }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500, mb: 0.5 }}
                            >
                              {file.original_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                wordBreak: "break-all",
                                fontFamily: "monospace",
                                fontSize: "0.8rem",
                                color: "#92400e",
                              }}
                            >
                              {file.cdn_url}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Size:{" "}
                              {(file.file_size / (1024 * 1024)).toFixed(2)} MB •
                              Uploaded:{" "}
                              {new Date(file.upload_date).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            navigator.clipboard.writeText(file.cdn_url);
                            Swal.fire(
                              "Copied!",
                              "Image URL copied to clipboard",
                              "success"
                            );
                          }}
                        >
                          Copy
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            if (editor.current) {
                              const imageHtml = `<div style="text-align: center; margin: 2rem 0;">
                                <img src="${file.cdn_url}" alt="${file.original_name}" style="max-width: 90%; min-width: 400px; height: auto; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); border: 2px solid #f0f0f0;">
                              </div>`;
                              editor.current.selection.insertHTML(imageHtml);
                              Swal.fire(
                                "Image Inserted!",
                                "Image has been inserted into the editor",
                                "success"
                              );
                            }
                          }}
                        >
                          Insert
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteFile(file.id, "images")}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Display uploaded image links */}
            <Stack mt={2} spacing={1}>
              {imageLinks.map((url, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#f8f9fa",
                    p: 2,
                    borderRadius: 1,
                    border: "1px solid #e9ecef",
                  }}
                >
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Image URL:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        wordBreak: "break-all",
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                        color: "#007bff",
                      }}
                    >
                      {url}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        navigator.clipboard.writeText(url);
                        Swal.fire(
                          "Copied!",
                          "Image URL copied to clipboard",
                          "success"
                        );
                      }}
                    >
                      Copy
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        if (editor.current) {
                          // Insert image directly
                          editor.current.selection.insertImage(url);
                          Swal.fire(
                            "Image Inserted!",
                            "Image has been inserted into the editor",
                            "success"
                          );
                        }
                      }}
                    >
                      Insert
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        // Test video URL
                        const testVideo = document.createElement("video");
                        testVideo.src = url;
                        testVideo.controls = true;
                        testVideo.style.width = "300px";
                        testVideo.style.height = "200px";

                        Swal.fire({
                          title: "Video Test",
                          html: testVideo.outerHTML,
                          width: 400,
                          showConfirmButton: true,
                          confirmButtonText: "Close",
                        });
                      }}
                    >
                      Test
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        setImageLinks((prev) =>
                          prev.filter((_, index) => index !== i)
                        )
                      }
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Jodit Editor */}
          <Box>
            <Typography
              fontWeight={600}
              fontSize={15}
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Content
            </Typography>
            <JoditEditor
              ref={editor}
              value={content}
              config={joditConfig}
              tabIndex={1}
              onChange={(newContent) => debouncedSetContent(newContent)}
              onBlur={(newContent) => setContent(newContent)}
              onLoad={handleEditorReady}
            />
          </Box>

          {/* Preview Button */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={handlePreviewOpen}
              disabled={!content.trim()}
              sx={{ mr: 2 }}
            >
              Preview Content
            </Button>
          </Box>

          {/* Quiz Upload */}
          {
            <Box>
              <Typography fontWeight={600} fontSize={15} sx={{ mb: 1 }}>
                Quiz Management
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {topic
                  ? "Upload a new Excel file to replace the existing quiz, or edit the current quiz manually."
                  : "Upload an Excel file with quiz questions. The file should have columns: question, option1, option2, option3, option4, answer"}
              </Typography>

              {/* Display existing quiz info */}
              {topic && quizData && quizData.length > 0 && (
                <Box
                  sx={{
                    background: "#e8f5e8",
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #4caf50",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    📝 Current Quiz: {quizData.length} questions
                  </Typography>
                  <Typography
                    variant="body2"
                    fontSize="0.8rem"
                    color="text.secondary"
                  >
                    First question: "{quizData[0].question.substring(0, 50)}..."
                  </Typography>
                </Box>
              )}

              <Button
                variant="outlined"
                color="secondary"
                onClick={downloadQuizTemplate}
                sx={{ mb: 2 }}
              >
                📥 Download Excel Template
              </Button>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Button component="label" variant="outlined">
                  Upload Quiz (Excel)
                  <input
                    type="file"
                    accept=".xls,.xlsx"
                    hidden
                    onChange={handleQuizUpload}
                    disabled={saving}
                  />
                </Button>
                {quizFile && (
                  <Typography fontSize={14} color="primary">
                    📄 {quizFile.name}
                  </Typography>
                )}
                {quizData && quizData.length > 0 && (
                  <>
                    <Button
                      variant="outlined"
                      color="info"
                      onClick={() => setQuizPreviewOpen(true)}
                    >
                      Preview Quiz ({quizData.length} questions)
                    </Button>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={openQuizEditor}
                    >
                      Edit Quiz Manually
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => {
                        setQuizData(null);
                        setQuizFile(null);
                        Swal.fire(
                          "Quiz Cleared",
                          "Quiz data has been cleared.",
                          "info"
                        );
                      }}
                    >
                      Clear Quiz
                    </Button>
                  </>
                )}
              </Stack>

              {/* Quiz Data Preview */}
              {quizData && quizData.length > 0 && (
                <Box
                  sx={{
                    background: "#f8f9fa",
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #e9ecef",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    ✅ Quiz loaded successfully! {quizData.length} questions
                    ready to save.
                  </Typography>
                  <Typography
                    variant="body2"
                    fontSize="0.8rem"
                    color="text.secondary"
                  >
                    First question: "{quizData[0].question.substring(0, 50)}..."
                  </Typography>
                </Box>
              )}

              {/* Show message if no quiz exists */}
              {topic && (!quizData || quizData.length === 0) && (
                <Box
                  sx={{
                    background: "#fff3cd",
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #ffeaa7",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    ℹ️ No quiz exists for this topic yet. Upload an Excel file
                    or create one manually.
                  </Typography>
                </Box>
              )}
            </Box>
          }

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" onClick={onCancel} disabled={saving}>
              Back
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={saving}
              sx={{
                fontWeight: 600,
                fontSize: 16,
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#115293" },
              }}
            >
              {saving
                ? topic
                  ? "Updating..."
                  : "Adding..."
                : topic
                ? "Update Topic"
                : "Add Topic"}
            </Button>
          </Stack>
        </Stack>
      </form>

      {/* Content Preview Modal */}
      <Modal
        open={previewOpen}
        onClose={handlePreviewClose}
        aria-labelledby="preview-modal-title"
        aria-describedby="preview-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,
        }}
      >
        <Paper
          sx={{
            width: "90vw",
            maxWidth: "900px",
            maxHeight: "90vh",
            overflow: "auto",
            p: 4,
            position: "relative",
            margin: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              pb: 2,
              borderBottom: "2px solid #e2e8f0",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              id="preview-modal-title"
              sx={{
                fontWeight: 700,
                color: "#1a202c",
                fontSize: "1.875rem",
              }}
            >
              {title || "Untitled Topic"}
            </Typography>
            <IconButton
              onClick={handlePreviewClose}
              sx={{
                color: "#666",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>

          <Box
            id="preview-modal-description"
            sx={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "#2d3748",
              "& h1": {
                fontSize: "2rem",
                fontWeight: 700,
                color: "#1a202c",
                marginTop: "2rem",
                marginBottom: "1rem",
                borderBottom: "3px solid #3182ce",
                paddingBottom: "0.5rem",
              },
              "& h2": {
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#1a202c",
                marginTop: "1.5rem",
                marginBottom: "0.75rem",
                borderBottom: "2px solid #e2e8f0",
                paddingBottom: "0.25rem",
              },
              "& h3": {
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#1a202c",
                marginTop: "1.25rem",
                marginBottom: "0.5rem",
              },
              "& p": {
                marginBottom: "1rem",
                lineHeight: 1.7,
              },
              "& img": {
                display: "block",
                margin: "1.5rem auto",
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              },
              "& video": {
                display: "block",
                margin: "1.5rem auto",
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              },
              "& iframe": {
                display: "block",
                margin: "1.5rem auto",
                maxWidth: "100%",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              },
              "& ul, & ol": {
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
              },
              "& li": {
                marginBottom: "0.5rem",
                lineHeight: 1.6,
              },
              "& table": {
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "1.5rem",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              },
              "& td, & th": {
                padding: "0.75rem",
                border: "1px solid #e2e8f0",
                textAlign: "left",
              },
              "& th": {
                backgroundColor: "#f7fafc",
                fontWeight: 600,
              },
              "& *": {
                maxWidth: "100%",
              },
            }}
            dangerouslySetInnerHTML={{
              __html: processContentForPreview(content),
            }}
          />
        </Paper>
      </Modal>

      {/* Quiz Preview Modal */}
      <Modal
        open={quizPreviewOpen}
        onClose={() => setQuizPreviewOpen(false)}
        aria-labelledby="quiz-preview-modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,
        }}
      >
        <Paper
          sx={{
            width: "90vw",
            maxWidth: "800px",
            maxHeight: "90vh",
            overflow: "auto",
            p: 4,
            position: "relative",
            margin: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              pb: 2,
              borderBottom: "2px solid #e2e8f0",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              id="quiz-preview-modal-title"
              sx={{
                fontWeight: 700,
                color: "#1a202c",
                fontSize: "1.5rem",
              }}
            >
              Quiz Preview ({quizData?.length || 0} Questions)
            </Typography>
            <IconButton
              onClick={() => setQuizPreviewOpen(false)}
              sx={{
                color: "#666",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>

          <Stack spacing={3}>
            {quizData?.map((question, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  border: "1px solid #e2e8f0",
                  borderRadius: 2,
                  backgroundColor: "#f8f9fa",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#1a202c",
                    mb: 2,
                  }}
                >
                  Question {index + 1}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                    fontWeight: 500,
                    color: "#2d3748",
                  }}
                >
                  {question.question}
                </Typography>

                <Stack spacing={1}>
                  {question.options.map((option, optionIndex) => (
                    <Box
                      key={optionIndex}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1.5,
                        borderRadius: 1,
                        backgroundColor:
                          option === question.answer ? "#e6fffa" : "#ffffff",
                        border:
                          option === question.answer
                            ? "2px solid #38b2ac"
                            : "1px solid #e2e8f0",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: option === question.answer ? 600 : 400,
                          color:
                            option === question.answer ? "#2c7a7b" : "#4a5568",
                        }}
                      >
                        {String.fromCharCode(65 + optionIndex)}. {option}
                        {option === question.answer && " ✓"}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Modal>

      {/* Quiz Editor Modal */}
      <Modal
        open={quizEditorOpen && editingQuestion}
        onClose={closeQuizEditor}
        aria-labelledby="quiz-editor-modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,
        }}
      >
        <Paper
          sx={{
            width: "90vw",
            maxWidth: "800px",
            maxHeight: "90vh",
            overflow: "auto",
            p: 4,
            position: "relative",
            margin: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              pb: 2,
              borderBottom: "2px solid #e2e8f0",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              id="quiz-editor-modal-title"
              sx={{
                fontWeight: 700,
                color: "#1a202c",
                fontSize: "1.5rem",
              }}
            >
              {editingQuestionIndex >= 0 ? "Edit Question" : "Add New Question"}
            </Typography>
            <IconButton
              onClick={closeQuizEditor}
              sx={{
                color: "#666",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>

          {editingQuestion && (
            <Stack spacing={3}>
              {/* Question Text */}
              <TextField
                label="Question Text *"
                value={editingQuestion.question}
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    question: e.target.value,
                  })
                }
                multiline
                rows={3}
                fullWidth
                required
              />

              {/* Options */}
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1a202c" }}
              >
                Answer Options *
              </Typography>
              {editingQuestion.options.map((option, index) => (
                <TextField
                  key={index}
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...editingQuestion.options];
                    newOptions[index] = e.target.value;
                    setEditingQuestion({
                      ...editingQuestion,
                      options: newOptions,
                    });
                  }}
                  fullWidth
                  required
                />
              ))}

              {/* Correct Answer */}
              <TextField
                label="Correct Answer *"
                value={editingQuestion.answer}
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    answer: e.target.value,
                  })
                }
                fullWidth
                required
                helperText="Must match one of the options exactly"
              />

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={closeQuizEditor}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={saveQuestion}>
                  {editingQuestionIndex >= 0
                    ? "Update Question"
                    : "Add Question"}
                </Button>
              </Stack>
            </Stack>
          )}
        </Paper>
      </Modal>

      {/* Quiz Questions List Modal */}
      <Modal
        open={quizEditorOpen && !editingQuestion}
        onClose={closeQuizEditor}
        aria-labelledby="quiz-questions-modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,
        }}
      >
        <Paper
          sx={{
            width: "90vw",
            maxWidth: "800px",
            maxHeight: "90vh",
            overflow: "auto",
            p: 4,
            position: "relative",
            margin: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              pb: 2,
              borderBottom: "2px solid #e2e8f0",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              id="quiz-questions-modal-title"
              sx={{
                fontWeight: 700,
                color: "#1a202c",
                fontSize: "1.5rem",
              }}
            >
              Quiz Questions ({quizData?.length || 0})
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, fontStyle: "italic" }}
            >
              💡 Drag the questions to reorder them
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={addNewQuestion}
                startIcon={<Add />}
              >
                Add Question
              </Button>
              <IconButton
                onClick={closeQuizEditor}
                sx={{
                  color: "#666",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <Close />
              </IconButton>
            </Stack>
          </Box>

          <Stack spacing={2}>
            {quizData?.map((question, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  border: "1px solid #e2e8f0",
                  borderRadius: 2,
                  backgroundColor: "#f8f9fa",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1a202c",
                    }}
                  >
                    Question {index + 1}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => editQuestion(question, index)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => deleteQuestion(index)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                    fontWeight: 500,
                    color: "#2d3748",
                  }}
                >
                  {question.question}
                </Typography>

                <Stack spacing={1}>
                  {question.options.map((option, optionIndex) => (
                    <Box
                      key={optionIndex}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        borderRadius: 1,
                        backgroundColor:
                          option === question.answer ? "#e6fffa" : "#ffffff",
                        border:
                          option === question.answer
                            ? "2px solid #38b2ac"
                            : "1px solid #e2e8f0",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: option === question.answer ? 600 : 400,
                          color:
                            option === question.answer ? "#2c7a7b" : "#4a5568",
                        }}
                      >
                        {String.fromCharCode(65 + optionIndex)}. {option}
                        {option === question.answer && " ✓"}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            ))}

            {(!quizData || quizData.length === 0) && (
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  color: "#666",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  No questions yet
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Click "Add Question" to create your first quiz question.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addNewQuestion}
                  startIcon={<Add />}
                >
                  Add First Question
                </Button>
              </Box>
            )}
          </Stack>
        </Paper>
      </Modal>
    </Box>
  );
}
