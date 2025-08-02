"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import * as XLSX from "xlsx";

// API endpoints (swap with your real ones)
const API_REVISION = "http://localhost:8080/api/v1/revision-quizzes";
const API_COURSES = "http://localhost:8080/api/v1/courses";

// MOCK for demo:
const MOCK_REVISION_QUIZZES = [
  {
    id: 1,
    course: { id: 11, title: "Taxation and HR" },
    revisionTitle: "Quarter 1 Revision",
    level: "Core",
  },
];

export default function RevisionQuizTable() {
  const [revisions, setRevisions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Revision UI state
  const [showAddRevision, setShowAddRevision] = useState(false);
  const [form, setForm] = useState({
    courseId: "",
    revisionTitle: "",
    level: "",
    questions: [],
    excelFileName: "",
  });
  const [excelError, setExcelError] = useState("");

  // Fetch data
  useEffect(() => {
    // Real API example (uncomment for real use)
    /*
    fetch(API_REVISION)
      .then(res => res.json())
      .then(data => setRevisions(data))
      .catch(() => setRevisions([]));

    fetch(API_COURSES)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(() => setCourses([]));
    setLoading(false);
    */
    // MOCK for demo
    setTimeout(() => {
      setRevisions(MOCK_REVISION_QUIZZES);
      setCourses([
        { id: 11, title: "Taxation and HR" },
        { id: 12, title: "Corporate Accounting" },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Form change
  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Excel upload
  const handleExcelUpload = (e) => {
    setExcelError("");
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, excelFileName: file.name }));
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setForm((f) => ({ ...f, questions: json }));
      } catch (err) {
        setExcelError("Invalid Excel file.");
        setForm((f) => ({ ...f, questions: [], excelFileName: "" }));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Submit new revision
  const handleAddRevisionSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.courseId ||
      !form.revisionTitle ||
      !form.level ||
      form.questions.length === 0
    ) {
      setExcelError("All fields and a valid Excel file are required.");
      return;
    }
    // Replace with real POST API call
    // await fetch(...)

    // For demo, just add to list
    setRevisions((prev) => [
      ...prev,
      {
        id: Date.now(),
        course: courses.find((c) => String(c.id) === String(form.courseId)),
        revisionTitle: form.revisionTitle,
        level: form.level,
      },
    ]);
    setShowAddRevision(false);
    setForm({
      courseId: "",
      revisionTitle: "",
      level: "",
      questions: [],
      excelFileName: "",
    });
    setExcelError("");
  };

  // UI: Add Revision Form
  if (showAddRevision) {
    return (
      <Container
        maxWidth="sm"
        sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
      >
        <Card sx={{ width: "100%", boxShadow: 6, borderRadius: 4, mt: 6 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <IconButton
                onClick={() => {
                  setShowAddRevision(false);
                  setExcelError("");
                  setForm({
                    courseId: "",
                    revisionTitle: "",
                    level: "",
                    questions: [],
                    excelFileName: "",
                  });
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h5" fontWeight="bold" sx={{ ml: 1 }}>
                Add Revision Quiz
              </Typography>
            </Box>
            <Box
              component="form"
              onSubmit={handleAddRevisionSubmit}
              sx={{ mt: 1 }}
            >
              <FormControl fullWidth required sx={{ mb: 3 }}>
                <InputLabel id="course-label">Course</InputLabel>
                <Select
                  labelId="course-label"
                  name="courseId"
                  value={form.courseId}
                  label="Course"
                  onChange={handleFormChange}
                >
                  <MenuItem value="">Select course</MenuItem>
                  {courses.map((c) => (
                    <MenuItem value={c.id} key={c.id}>
                      {c.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Revision Title"
                name="revisionTitle"
                required
                fullWidth
                value={form.revisionTitle}
                onChange={handleFormChange}
                sx={{ mb: 3 }}
              />
              <FormControl fullWidth required sx={{ mb: 3 }}>
                <InputLabel id="level-label">Level</InputLabel>
                <Select
                  labelId="level-label"
                  name="level"
                  value={form.level}
                  label="Level"
                  onChange={handleFormChange}
                >
                  <MenuItem value="">Select level</MenuItem>
                  <MenuItem value="Core">Core</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ mb: 2 }}
              >
                {form.excelFileName || "Upload Excel (Questions)"}
                <input
                  type="file"
                  hidden
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                />
              </Button>
              {excelError && <Alert severity="error">{excelError}</Alert>}
              {form.questions.length > 0 && (
                <Alert severity="success" sx={{ my: 1 }}>
                  {form.questions.length} questions loaded.
                  <details>
                    <summary>Preview first 2 rows</summary>
                    <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                      {JSON.stringify(form.questions.slice(0, 2), null, 2)}
                    </pre>
                  </details>
                </Alert>
              )}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, py: 1.4, fontWeight: "bold", fontSize: "1.1rem" }}
                type="submit"
              >
                Save Revision
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // UI: Table
  return (
    <Container maxWidth="lg" sx={{ pt: 5, minHeight: "100vh" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Revision Quizzes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            fontWeight: "bold",
            fontSize: "1rem",
            boxShadow: 2,
            px: 3,
            py: 1,
            textTransform: "none",
          }}
          onClick={() => setShowAddRevision(true)}
        >
          Add Revision
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
          boxShadow: 3,
          background: "#fff",
          maxWidth: "95%",
          margin: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                Course
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                Revision Title
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                Level
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : revisions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No revision quizzes found.
                </TableCell>
              </TableRow>
            ) : (
              revisions.map((rev) => (
                <TableRow
                  key={rev.id}
                  hover
                  sx={{ borderBottom: "1px solid #eee" }}
                >
                  <TableCell>{rev.course.title}</TableCell>
                  <TableCell>{rev.revisionTitle}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        background:
                          rev.level === "Core"
                            ? "#e8f5e9"
                            : rev.level === "Advanced"
                            ? "#fce4ec"
                            : "#e3f2fd",
                        color:
                          rev.level === "Core"
                            ? "#388e3c"
                            : rev.level === "Advanced"
                            ? "#d81b60"
                            : "#1976d2",
                        fontWeight: "bold",
                        padding: "4px 18px",
                        borderRadius: 20,
                        fontSize: "1.02rem",
                        display: "inline-block",
                      }}
                    >
                      {rev.level}
                    </span>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" sx={{ mx: 0.5 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="success" sx={{ mx: 0.5 }}>
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton color="error" sx={{ mx: 0.5 }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          px={2}
          py={1}
          fontSize="1rem"
          color="gray"
        >
          Rows per page:&nbsp;
          <select style={{ padding: "4px 12px", borderRadius: 6 }}>
            <option>100</option>
          </select>
          &nbsp;&nbsp;1–{revisions.length} of {revisions.length}
        </Box>
      </TableContainer>
    </Container>
  );
}
