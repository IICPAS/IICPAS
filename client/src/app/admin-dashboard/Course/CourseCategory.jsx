"use client";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, IconButton } from "@mui/material";
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
        <Box display="flex" gap={1} justifyContent="center">
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton color="success" size="small" disabled>
            <CheckCircleIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row._id)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "76vw", mx: "auto", mt: 4 }}>
      <Box sx={{ bgcolor: "#fff", borderRadius: 3 }}>
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
                  bgcolor: "#0f265c",
                  "&:hover": { bgcolor: "#233772" },
                  fontWeight: 600,
                  px: 3,
                  fontSize: 16,
                  borderRadius: 2,
                  boxShadow: "none",
                  textTransform: "none",
                }}
                onClick={handleAdd}
              >
                Add Course Category
              </Button>
            </Box>
            <div style={{ width: "100%", height: 420 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 100]}
                disableRowSelectionOnClick
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f3f4f6",
                    fontWeight: "bold",
                    fontSize: 15,
                  },
                  "& .MuiDataGrid-cell": {
                    border: "1px solid #e5e7eb",
                  },
                  "& .MuiDataGrid-row": {
                    fontSize: 15,
                  },
                  border: "1.5px solid #cbd5e1",
                  borderRadius: 2,
                }}
                getRowHeight={() => 46}
                autoHeight
              />
            </div>
          </>
        ) : (
          // ----- FORM SECTION -----
          <form
            onSubmit={handleFormSubmit}
            style={{
              maxWidth: 900,
              margin: "0 auto",
              background: "transparent",
              padding: "0",
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
                gridTemplateColumns: "1fr 1fr",
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
