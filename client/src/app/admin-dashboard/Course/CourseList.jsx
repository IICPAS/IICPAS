"use client";
import React, { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Typography,
  Stack,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const statusColors = {
  Active: "success",
  Inactive: "default",
};

export default function CourseList({
  onAddCourse,
  onEditCourse,
  onAddChapter, // passed from parent
  onToggleStatus,
}) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/courses`)
      .then((res) => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Delete confirmation omitted for brevity, add your existing handleDelete here

  const columns = [
    { field: "category", headerName: "Category", flex: 1, minWidth: 120 },
    { field: "title", headerName: "Course Name", flex: 1.5, minWidth: 150 },
    { field: "level", headerName: "Level", flex: 1, minWidth: 100 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 110,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColors[params.value] || "default"}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 2,
      minWidth: 300,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const course = params.row;
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => onAddChapter(course)}
              sx={{ px: 2, py: 1, fontSize: "0.875rem", fontWeight: 600 }}
            >
              Chapters
            </Button>

            <Tooltip title="Edit Course">
              <IconButton
                color="info"
                size="small"
                onClick={() => onEditCourse(course)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Toggle Status">
              <IconButton
                color="success"
                size="small"
                onClick={() => onToggleStatus(course)}
              >
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Course">
              <IconButton color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5" fontWeight={700}>
          Courses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddCourse}
          sx={{ background: "#0d244b" }}
        >
          Add Course
        </Button>
      </Stack>

      <Box sx={{ bgcolor: "white", borderRadius: 3, boxShadow: 2, p: 2 }}>
        <DataGrid
          autoHeight
          rows={courses.map((c) => ({ ...c, id: c._id }))}
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
