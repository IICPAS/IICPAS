"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Stack } from "@mui/material";
import * as XLSX from "xlsx";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const quillModules = {
  toolbar: [
    [{ font: [] }, { size: ["small", false, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

function styleQuillHtml(html) {
  if (!html) return "";
  return html
    .replace(
      /<img /g,
      '<img style="display:block;margin:16px auto;max-width:80%;border-radius:12px;" '
    )
    .replace(
      /<iframe /g,
      '<iframe style="display:block;margin:20px auto;max-width:80%;" '
    )
    .replace(
      /<video /g,
      '<video style="display:block;margin:20px auto;max-width:80%;" '
    );
}

const quillFormats = [
  "font",
  "size",
  "color",
  "background",
  "bold",
  "italic",
  "underline",
  "strike",
  "align",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "clean",
];

export default function AddOrEditTopicForm({
  chapterId,
  chapterName,
  topic, // If set, we are in EDIT mode
  onCancel,
  onSaved,
}) {
  const [title, setTitle] = useState(topic?.title || "");
  const [content, setContent] = useState(topic?.content || "");
  const [quizFile, setQuizFile] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [saving, setSaving] = useState(false);

  // Re-populate fields when editing a different topic
  useEffect(() => {
    setTitle(topic?.title || "");
    setContent(topic?.content || "");
  }, [topic]);

  // Excel parsing
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

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      Swal.fire("Validation", "Title and content required!", "warning");
      return;
    }
    setSaving(true);
    try {
      if (topic?._id) {
        // EDIT
        await axios.put(`${API_BASE}/topics/${topic._id}`, {
          title: title.trim(),
          content,
        });
        // Optionally: allow quiz edit here as well
      } else {
        // ADD
        const topicRes = await axios.post(
          `${API_BASE}/topics/by-chapter/${chapterId}`,
          {
            chapterId,
            title: title.trim(),
            content,
          }
        );
        const topicId = topicRes.data._id;
        if (quizData && quizData.length > 0) {
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
    <Box
      sx={{
        p: { xs: 1, md: 4 },
        maxWidth: 750,
        mx: "auto",
        mt: 6,
        bgcolor: "white",
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom align="center">
        {topic ? `Edit Topic` : `Add Topic`} for "{chapterName}"
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Topic Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            inputProps={{ style: { fontSize: 18, fontWeight: 500 } }}
          />
          <Box>
            <Typography
              fontWeight={600}
              fontSize={15}
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Content (Rich text, images, video, color...)
            </Typography>
            <div
              style={{
                resize: "vertical",
                overflow: "auto",
                minHeight: 180,
                maxHeight: 800,
                borderRadius: 10,
                background: "#fafbfc",
                border: "1px solid #d1d5db",
                marginBottom: 20,
              }}
            >
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                style={{
                  height: "100%",
                  border: "none",
                  background: "transparent",
                }}
                placeholder="Write content here... you can use images, videos, colors, etc."
              />
            </div>
          </Box>
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
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={saving}
              sx={{ minWidth: 120 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={saving}
              sx={{
                minWidth: 140,
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
            {topic && (
              <Button
                variant={showPreview ? "outlined" : "contained"}
                color="secondary"
                onClick={() => setShowPreview((prev) => !prev)}
                sx={{
                  minWidth: 140,
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                {showPreview ? "Hide Preview" : "Get Preview"}
              </Button>
            )}
          </Stack>
        </Stack>
      </form>

      {showPreview && (
        <Box
          sx={{
            mt: 4,
            p: 3,
            bgcolor: "#f5f6fa",
            borderRadius: 2,
            border: "1px solid #ddd",
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={2}>
            Content Preview
          </Typography>
          <div
            dangerouslySetInnerHTML={{ __html: styleQuillHtml(content) }}
            style={{ width: "100%" }}
          />
        </Box>
      )}
    </Box>
  );
}
