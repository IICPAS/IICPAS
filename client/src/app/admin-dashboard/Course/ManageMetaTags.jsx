import { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SearchIcon from "@mui/icons-material/Search";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import axios from "axios";

export default function ManageMetatags() {
  const [mode, setMode] = useState("list");
  const [metatags, setMetatags] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    keywords: "",
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMetatags();
  }, []);

  const fetchMetatags = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/metatags`);
    setMetatags(res.data);
    setFiltered(res.data);
  };

  const handleSearch = (value) => {
    setSearch(value);
    const filtered = metatags.filter((item) =>
      item.type.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/metatags/${editId}`,
        formData
      );
    } else {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/metatags`, formData);
    }
    resetForm();
    fetchMetatags();
    setMode("list");
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item._id);
    setMode("edit");
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This metatag will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/metatags/${id}`);
        fetchMetatags();
        Swal.fire("Deleted!", "Metatag has been removed.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Something went wrong!", "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({ type: "", title: "", description: "", keywords: "" });
    setEditId(null);
  };

  const handleExcelChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      const formatted = data.map((item) => ({
        type: item.Type || "",
        title: item.Title || "",
        description: item.Description || "",
        keywords: item.Keywords || "",
      }));

      try {
        for (const entry of formatted) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/metatags`,
            entry
          );
        }
        alert("Imported successfully!");
        fetchMetatags();
      } catch (err) {
        console.error(err);
        alert("Failed to import.");
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6">
      {mode === "list" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Manage Meta Tags</h2>
            <div className="flex gap-3">
              <label htmlFor="excel-upload">
                <input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  hidden
                  onChange={handleExcelChange}
                />
                <Button
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                  component="span"
                >
                  Import Excel
                </Button>
              </label>
              <Button variant="contained" onClick={() => setMode("add")}>
                Add Meta Tag
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <TextField
              placeholder="Search by type..."
              fullWidth
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="overflow-auto rounded-md bg-white">
            <Table>
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell>Sr. No.</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Keywords</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.keywords}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleEdit(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item._id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {(mode === "add" || mode === "edit") && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-6 w-full max-w-6xl"
        >
          <h2 className="text-xl font-semibold mb-6">
            {mode === "add" ? "Add New" : "Edit"} Meta Tag
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Type"
              required
              fullWidth
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            />
            <TextField
              label="Title"
              required
              fullWidth
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="mt-6">
            <TextField
              label="Description"
              required
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="mt-6">
            <TextField
              label="Keywords (comma-separated)"
              required
              fullWidth
              value={formData.keywords}
              onChange={(e) =>
                setFormData({ ...formData, keywords: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="submit" variant="contained" color="primary">
              {mode === "edit" ? "Update" : "Submit"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                resetForm();
                setMode("list");
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
