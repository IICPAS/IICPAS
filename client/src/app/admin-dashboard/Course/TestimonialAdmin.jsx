import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from "sweetalert2";

export default function TestimonialsAdmin() {
  const [mode, setMode] = useState("list"); // list | add | edit
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    message: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/testimonials`
    );
    setTestimonials(res.data);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This testimonial will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}`
      );
      fetchTestimonials();
      Swal.fire("Deleted!", "Testimonial has been deleted.", "success");
    }
  };

  const handleStatusToggle = async (id, status) => {
    await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}`, {
      status: !status,
    });
    fetchTestimonials();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${editId}`,
        formData
      );
    } else {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonials`,
        formData
      );
    }
    resetForm();
    fetchTestimonials();
    setMode("list");
  };

  const handleEdit = (data) => {
    setFormData(data);
    setEditId(data._id);
    setMode("edit");
  };

  const resetForm = () => {
    setFormData({ name: "", designation: "", message: "" });
    setEditId(null);
  };

  return (
    <div className="p-6">
      {mode === "list" && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Testimonials</h2>
            <Button variant="contained" onClick={() => setMode("add")}>
              Add Testimonial
            </Button>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testimonials.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.designation}</TableCell>
                  <TableCell>{item.message}</TableCell>
                  <TableCell>
                    {item.status ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-gray-500">Inactive</span>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleStatusToggle(item._id, item.status)}
                    >
                      {item.status ? <CancelIcon /> : <CheckCircleIcon />}
                    </IconButton>
                    <IconButton onClick={() => handleDelete(item._id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {(mode === "add" || mode === "edit") && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-6 max-w-full"
        >
          <h2 className="text-xl font-semibold mb-6">
            {mode === "add" ? "Add New" : "Edit"} Testimonial
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Name"
              required
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextField
              label="Designation"
              required
              fullWidth
              value={formData.designation}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
            />
          </div>

          <div className="mt-6">
            <TextField
              label="Message"
              multiline
              rows={4}
              required
              fullWidth
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
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
