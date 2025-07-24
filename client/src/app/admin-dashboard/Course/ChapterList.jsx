"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function ChapterList({
  courseId,
  courseName,
  onViewCourse,
  onViewTopics,
  onEditChapter,
}) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [addingChapter, setAddingChapter] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchChapters = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/chapters/by-course/${courseId}`)
      .then((res) => setChapters(res.data))
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    if (courseId) fetchChapters();
  }, [courseId, fetchChapters]);

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this chapter!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE}/chapters/${id}`);
        fetchChapters();
        MySwal.fire("Deleted!", "Chapter has been deleted.", "success");
      } catch {
        MySwal.fire("Error!", "Failed to delete chapter", "error");
      }
    }
  };

  const filteredChapters = chapters.filter((ch) =>
    ch.title.toLowerCase().includes(search.toLowerCase())
  );

  // Columns definition WITHOUT status
  const columns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      width: 80,
      valueGetter: (params) => {
        if (!params || !params.row) return null;
        return (
          filteredChapters.findIndex((ch) => ch._id === params.row._id) + 1
        );
      },
      sortable: false,
      filterable: false,
    },
    {
      field: "courseName",
      headerName: "Course Name",
      flex: 1,
      valueGetter: () => courseName,
    },
    { field: "title", headerName: "Chapter Name", flex: 1 },
    {
      field: "actions",
      headerName: "Action",
      width: 220,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => onViewTopics(params.row)}
          >
            Topics
          </Button>

          <Tooltip title="Edit Chapter">
            <IconButton
              color="info"
              size="small"
              onClick={() => onEditChapter(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Chapter">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDelete(params.row._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const handleAddChapter = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSaving(true);
    try {
      await axios.post(`${API_BASE}/chapters/by-course/${courseId}`, {
        courseId,
        title: newTitle.trim(),
      });
      setNewTitle("");
      setAddingChapter(false);
      fetchChapters();
      MySwal.fire("Success!", "Chapter added successfully", "success");
    } catch (error) {
      MySwal.fire("Error!", "Failed to add chapter", "error");
    }
    setSaving(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5" fontWeight={700}>
          Chapters for "{courseName}"
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {!addingChapter && (
            <Button
              variant="contained"
              sx={{
                bgcolor: "#1a237e",
                textTransform: "none",
                fontWeight: 600,
                fontSize: 14,
                px: 3,
                py: 1.2,
                borderRadius: 1.5,
                "&:hover": { bgcolor: "#283593" },
              }}
              onClick={() => setAddingChapter(true)}
            >
              + Add Chapter
            </Button>
          )}

          <Button variant="outlined" onClick={onViewCourse}>
            View Course
          </Button>
        </Stack>
      </Stack>

      {addingChapter && (
        <Box
          component="form"
          onSubmit={handleAddChapter}
          sx={{
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: 480,
            mb: 3,
          }}
        >
          <Stack spacing={2}>
            <TextField
              label="Chapter Title"
              required
              fullWidth
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => {
                  setAddingChapter(false);
                  setNewTitle("");
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Adding..." : "Add Chapter"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      <Box sx={{ bgcolor: "white", borderRadius: 3, boxShadow: 2, p: 2 }}>
        <DataGrid
          autoHeight
          rows={filteredChapters.map((ch) => ({ ...ch, id: ch._id }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          loading={loading}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            fontSize: 15,
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #e0e0e0",
            },
            "& .MuiDataGrid-columnHeaders": {
              background: "#f6f8fa",
              fontWeight: 700,
              fontSize: 15,
            },
          }}
        />
      </Box>
    </Box>
  );
}
