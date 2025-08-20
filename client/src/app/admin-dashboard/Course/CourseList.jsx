"use client";

import React, { useEffect, useState, useRef, forwardRef } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from "@/contexts/AuthContext";

const MySwal = withReactContent(Swal);
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const CourseList = forwardRef(
  (
    { onAddCourse, onEditCourse, onAddChapter, onDeleteCourse, onToggleStatus },
    ref
  ) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const { hasPermission } = useAuth();

    const statusColors = {
      Active: "success",
      Inactive: "error",
    };

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE}/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        MySwal.fire("Error!", "Failed to fetch courses", "error");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchCourses();
    }, []);

    // Expose fetchCourses to parent component
    React.useImperativeHandle(ref, () => ({
      fetchCourses,
    }));

    const handleToggleStatus = async (course) => {
      try {
        await axios.put(`${API_BASE}/courses/${course._id}/toggle-status`);
        await onToggleStatus(course);
        fetchCourses();
      } catch (error) {
        console.error("Error toggling status:", error);
        MySwal.fire("Error!", "Failed to toggle status", "error");
      }
    };

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
            sx={{
              fontWeight: 600,
              fontSize: "0.75rem",
              borderRadius: "12px",
            }}
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
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ height: "100%" }}
            >
              {hasPermission("course", "read") && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => onAddChapter(course)}
                  sx={{
                    px: 2,
                    py: 0.75,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    borderRadius: "8px",
                    textTransform: "none",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    height: 32,
                    minWidth: "auto",
                    "&:hover": {
                      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  Chapters
                </Button>
              )}

              {hasPermission("course", "update") && (
                <Tooltip title="Edit Course" arrow>
                  <IconButton
                    size="small"
                    onClick={() => onEditCourse(course)}
                    sx={{
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                      "&:hover": {
                        bgcolor: "#bbdefb",
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {hasPermission("course", "read") && (
                <Tooltip title="View Course" arrow>
                  <IconButton
                    size="small"
                    onClick={() => onEditCourse(course)}
                    sx={{
                      bgcolor: "#e8f5e8",
                      color: "#2e7d32",
                      "&:hover": {
                        bgcolor: "#c8e6c9",
                      },
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {hasPermission("course", "delete") && (
                <Tooltip title="Delete Course" arrow>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteCourse(course, fetchCourses)}
                    sx={{
                      bgcolor: "#ffebee",
                      color: "#d32f2f",
                      "&:hover": {
                        bgcolor: "#ffcdd2",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          );
        },
      },
    ];

    return (
      <Box sx={{}}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography variant="h5" fontWeight={700} sx={{ color: "#1a237e" }}>
            Courses
          </Typography>
          {hasPermission("course", "add") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddCourse}
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                borderRadius: "8px",
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                  boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                },
              }}
            >
              ADD COURSE
            </Button>
          )}
        </Stack>
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            p: 2,
            border: "1px solid #e8eaf6",
          }}
        >
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
              width: "72vw",
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-columnHeaders": {
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                fontWeight: 700,
                width: "72vw",
                fontSize: 15,
                borderBottom: "2px solid #dee2e6",
              },
              "& .MuiDataGrid-row": {
                minHeight: "60px !important",
                "&:hover": {
                  backgroundColor: "#f8f9fa",
                },
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
            }}
          />
        </Box>
      </Box>
    );
  }
);

export default CourseList;
