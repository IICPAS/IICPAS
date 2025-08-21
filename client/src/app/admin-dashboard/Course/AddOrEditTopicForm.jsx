"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { Delete, Visibility, Close } from "@mui/icons-material";
import dynamic from "next/dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const joditConfig = {
  readonly: false,
  height: 200,
  uploader: { insertImageAsBase64URI: true },
  toolbarAdaptive: false,
  showCharsCounter: false,
  showWordsCounter: false,
  spellcheck: true,
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

  useEffect(() => {
    if (topic) {
      setTitle(topic.title || "");
      setContent(topic.content || "");
      setVideoLinks(topic.videos || []);
    }
  }, [topic]);

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

  const handleQuizUpload = (e) => {
    const file = e.target.files[0];
    setQuizFile(file);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      const questions = rows.map((row) => ({
        question: row.question || row.Question || "",
        options: [
          row.option1 || row.Option1 || "",
          row.option2 || row.Option2 || "",
          row.option3 || row.Option3 || "",
          row.option4 || row.Option4 || "",
        ].filter(Boolean),
        answer: row.answer || row.Answer || "",
      }));
      setQuizData(questions);
      Swal.fire("Quiz Loaded", `${file.name} parsed successfully!`, "success");
    };
    reader.readAsArrayBuffer(file);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (100MB limit for videos)
    if (file.size > 100 * 1024 * 1024) {
      Swal.fire("Error", "Video size must be less than 100MB", "error");
      return;
    }

    // Check file type
    if (!file.type.startsWith("video/")) {
      Swal.fire("Error", "Please select a valid video file", "error");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    try {
      const res = await axios.post(`${API_BASE}/upload/video`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.videoUrl) {
        // Add the video URL to the list
        setVideoLinks((prev) => [...prev, res.data.videoUrl]);
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
      Swal.fire("Error", err.response?.data?.error || "Upload failed", "error");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire("Error", "Image size must be less than 10MB", "error");
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
      const res = await axios.post(`${API_BASE}/upload/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.imageUrl) {
        // Add the image URL to the list
        setImageLinks((prev) => [...prev, res.data.imageUrl]);
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
      if (topic?._id) {
        await axios.put(`${API_BASE}/topics/${topic._id}`, {
          title,
          content,
          videos: videoLinks,
        });
      } else {
        const topicRes = await axios.post(
          `${API_BASE}/topics/by-chapter/${chapterId}`,
          {
            chapterId,
            title,
            content,
            videos: videoLinks,
          }
        );
        const topicId = topicRes.data._id;
        if (quizData?.length > 0) {
          await axios.post(`${API_BASE}/quizzes`, {
            topic: topicId,
            questions: quizData,
          });
        }
      }
      setTitle("");
      setContent("");
      setQuizFile(null);
      setQuizData(null);
      setVideoLinks([]);
      onSaved && onSaved();
      Swal.fire(
        "Success!",
        topic ? "Topic updated!" : "Topic added!",
        "success"
      );
    } catch (err) {
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
            <Typography fontWeight={600} fontSize={15}>
              Upload Videos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Upload videos to get a direct link. Copy the link below and use it
              in the editor.
            </Typography>
            <Button component="label" variant="contained" sx={{ mt: 1 }}>
              Upload Video
              <input
                type="file"
                accept="video/*"
                hidden
                onChange={handleVideoUpload}
              />
            </Button>

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
            <Typography fontWeight={600} fontSize={15}>
              Upload Images
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Upload images to get a direct link. Copy the link below and use it
              in the editor.
            </Typography>
            <Button
              component="label"
              variant="contained"
              color="secondary"
              sx={{ mt: 1 }}
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Button>

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
              onBlur={(newContent) => setContent(newContent)}
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
          {!topic && (
            <Box>
              <Button component="label" variant="outlined" sx={{ mr: 2 }}>
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
                <Typography fontSize={14} mt={1} color="primary">
                  {quizFile.name}
                </Typography>
              )}
            </Box>
          )}

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

      {/* Preview Modal */}
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
    </Box>
  );
}
