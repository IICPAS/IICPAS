"use client";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

const MySwal = withReactContent(Swal);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function CourseCategoryExcelGrid() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({
    category: "",
    status: "Active",
    title: "",
    keywords: "",
    description: "",
  });

  // Fetch data
  const loadRows = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      setRows(
        res.data.map((row, idx) => ({
          ...row,
          id: row._id || idx + 1, // DataGrid needs id property
        }))
      );
    } catch {
      setRows([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!showForm) loadRows();
    // eslint-disable-next-line
  }, [showForm]);

  // Form handlers
  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleAdd = () => {
    setEditRow(null);
    setForm({
      category: "",
      status: "Active",
      title: "",
      keywords: "",
      description: "",
    });
    setShowForm(true);
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setForm({
      category: row.category || "",
      status: row.status || "Active",
      title: row.title || "",
      keywords: row.keywords || "",
      description: row.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${API_BASE}/categories/${id}`);
        loadRows();
        MySwal.fire("Deleted!", "Category has been deleted.", "success");
      }
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editRow) {
        await axios.put(`${API_BASE}/categories/${editRow._id}`, form);
        MySwal.fire("Updated!", "Category updated.", "success");
      } else {
        await axios.post(`${API_BASE}/categories`, form);
        MySwal.fire("Created!", "Category created.", "success");
      }
      setShowForm(false);
      setEditRow(null);
      setForm({
        category: "",
        status: "Active",
        title: "",
        keywords: "",
        description: "",
      });
      loadRows();
    } catch {
      MySwal.fire("Error", "Failed to save category.", "error");
    }
  };

  // Grid columns
  const columns = [
    {
      field: "category",
      headerName: "Category Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span
          style={{
            color: "#059669",
            background: "#ECFDF5",
            borderRadius: 15,
            padding: "4px 14px",
            border: "1px solid #6ee7b7",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {params.value}
        </span>
      ),
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          gap={1.5}
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          <Tooltip title="Edit Category" arrow>
            <IconButton
              onClick={() => handleEdit(params.row)}
              size="small"
              sx={{
                bgcolor: "#e3f2fd",
                color: "#1976d2",
                "&:hover": {
                  bgcolor: "#bbdefb",
                },
                width: 32,
                height: 32,
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle Status" arrow>
            <IconButton
              size="small"
              disabled
              sx={{
                bgcolor: "#e8f5e8",
                color: "#2e7d32",
                opacity: 0.5,
                width: 32,
                height: 32,
              }}
            >
              <CheckCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Category" arrow>
            <IconButton
              onClick={() => handleDelete(params.row._id)}
              size="small"
              sx={{
                bgcolor: "#ffebee",
                color: "#d32f2f",
                "&:hover": {
                  bgcolor: "#ffcdd2",
                },
                width: 32,
                height: 32,
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: "1200px", mx: "auto", mt: 4, px: 2 }}>
      <Box sx={{ bgcolor: "#fff", borderRadius: 3, overflow: "hidden" }}>
        {!showForm ? (
          <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
              mt={2}
            >
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: 0,
                }}
              ></h1>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                  },
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  fontSize: 16,
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                  textTransform: "none",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                  },
                }}
                onClick={handleAdd}
              >
                ADD COURSE CATEGORY
              </Button>
            </Box>
            <div style={{ width: "100%", height: 420, overflow: "auto" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 100]}
                disableRowSelectionOnClick
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    background:
                      "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                    fontWeight: 700,
                    fontSize: 15,
                    borderBottom: "2px solid #dee2e6",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #f0f0f0",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiDataGrid-row": {
                    fontSize: 15,
                    minHeight: "60px !important",
                    "&:hover": {
                      backgroundColor: "#f8f9fa",
                    },
                  },
                  "& .MuiDataGrid-cell:focus": {
                    outline: "none",
                  },
                  border: "1px solid #e8eaf6",
                  borderRadius: 2,
                }}
                getRowHeight={() => 60}
                autoHeight
              />
            </div>
          </>
        ) : (
          // ----- FORM SECTION -----
          <form
            onSubmit={handleFormSubmit}
            style={{
              maxWidth: "100%",
              margin: "0 auto",
              background: "transparent",
              padding: "20px",
              overflow: "hidden",
            }}
          >
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                marginBottom: 20,
                marginTop: 8,
                letterSpacing: 0,
              }}
            >
              Course Categories
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 26,
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <h2 style={{ fontSize: 23, fontWeight: 500, margin: 0 }}>
                {editRow ? "Edit Course Category" : ""}
              </h2>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#0f265c",
                  "&:hover": { bgcolor: "#233772" },
                  fontWeight: 600,
                  px: 3,
                  fontSize: 16,
                  borderRadius: 2,
                  boxShadow: "none",
                  textTransform: "none",
                }}
                onClick={() => {
                  setShowForm(false);
                  setEditRow(null);
                  setForm({
                    category: "",
                    status: "Active",
                    title: "",
                    keywords: "",
                    description: "",
                  });
                }}
              >
                View List
              </Button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 24,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  Category Name
                </label>
                <input
                  type="text"
                  name="category"
                  style={{
                    width: "100%",
                    border: "1.5px solid #ccc",
                    borderRadius: 6,
                    padding: "11px 13px",
                    fontSize: 12,
                    outline: "none",
                    marginBottom: 10,
                  }}
                  value={form.category}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  Status
                </label>
                <select
                  name="status"
                  style={{
                    width: "100%",
                    border: "1.5px solid #ccc",
                    borderRadius: 6,
                    padding: "11px 13px",
                    fontSize: 16,
                    outline: "none",
                    marginBottom: 10,
                  }}
                  value={form.status}
                  onChange={handleFormChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  style={{
                    width: "100%",
                    border: "1.5px solid #ccc",
                    borderRadius: 6,
                    padding: "11px 13px",
                    fontSize: 17,
                    outline: "none",
                    marginBottom: 10,
                  }}
                  value={form.title}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  Keywords
                </label>
                <input
                  type="text"
                  name="keywords"
                  style={{
                    width: "100%",
                    border: "1.5px solid #ccc",
                    borderRadius: 6,
                    padding: "11px 13px",
                    fontSize: 17,
                    outline: "none",
                    marginBottom: 10,
                  }}
                  value={form.keywords}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                Description
              </label>
              <textarea
                name="description"
                style={{
                  width: "100%",
                  border: "1.5px solid #ccc",
                  borderRadius: 6,
                  padding: "11px 13px",
                  fontSize: 17,
                  outline: "none",
                  marginBottom: 10,
                  minHeight: 84,
                  resize: "vertical",
                }}
                value={form.description}
                onChange={handleFormChange}
              />
            </div>
            <div style={{ marginTop: 24, textAlign: "left" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#0f265c",
                  "&:hover": { bgcolor: "#233772" },
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: 15,
                  borderRadius: 2,
                  boxShadow: "none",
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                {editRow ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        )}
      </Box>
    </Box>
  );
}
