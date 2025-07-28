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
} from "@mui/material";
import * as XLSX from "xlsx";
import axios from "axios";
import Swal from "sweetalert2";
import { Delete } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import dynamic from "next/dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

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
  const [videoLinks, setVideoLinks] = useState(topic?.videos || []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (topic) {
      setTitle(topic.title || "");
      setContent(topic.content || "");
      setVideoLinks(topic.videos || []);
    }
  }, [topic]);

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
    const formData = new FormData();
    formData.append("video", file);
    try {
      const res = await axios.post(`${API_BASE}/upload/video`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setVideoLinks((prev) => [...prev, res.data.videoUrl]);
      Swal.fire("Success", "Video uploaded!", "success");
    } catch (err) {
      Swal.fire("Error", "Upload failed", "error");
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
            <Button component="label" variant="contained" sx={{ mt: 1 }}>
              Upload Video
              <input
                type="file"
                accept="video/*"
                hidden
                onChange={handleVideoUpload}
              />
            </Button>

            <Stack mt={2} spacing={1}>
              {videoLinks.map((url, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#f5f5f5",
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <Link
                    href={url}
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                  >
                    {url.split("/").pop()}
                  </Link>
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
              tabIndex={1}
              onBlur={(newContent) => setContent(newContent)}
              config={{
                readonly: false,
                height: 350,
              }}
            />
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
    </Box>
  );
}
