"use client";
import { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import QuillEditor from "../components/QuillEditor";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function AboutUsAdmin() {
  const [mode, setMode] = useState("view");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [aboutList, setAboutList] = useState([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/about`
      );
      setAboutList(res.data);
    } catch (err) {
      console.error("Failed to fetch content", err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/about/${editId}`,
          { content }
        );
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/about`, {
          content,
        });
      }
      resetForm();
      fetchContent();
      setMode("view");
    } catch (err) {
      console.error("Error saving content", err);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setContent(item.content);
    setMode("edit");
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the content.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/about/${id}`
        );
        fetchContent();
        MySwal.fire("Deleted!", "The content has been removed.", "success");
      } catch (err) {
        console.error("Delete failed", err);
        MySwal.fire("Error!", "Failed to delete content.", "error");
      }
    }
  };

  const resetForm = () => {
    setEditId(null);
    setContent("");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">About Us</h2>
        <div className="flex gap-2">
          <Button
            variant={mode === "edit" ? "contained" : "outlined"}
            onClick={() => {
              resetForm();
              setMode("edit");
            }}
          >
            Add About Content
          </Button>
          <Button
            variant={mode === "view" ? "contained" : "outlined"}
            onClick={() => setMode("view")}
          >
            View About Content
          </Button>
        </div>
      </div>

      {mode === "edit" && (
        <div className="bg-white rounded-md p-1 w-full max-w-6xl">
          <QuillEditor value={content} onChange={setContent} height={300} />
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="contained" onClick={handleSubmit}>
              {editId ? "Update" : "Submit"}
            </Button>
            <Button variant="outlined" onClick={() => setMode("view")}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {mode === "view" && (
        <div className="bg-white rounded-md p-1 w-full max-w-6xl">
          {aboutList.length === 0 ? (
            <p>No About Us content added yet.</p>
          ) : (
            aboutList.map((item) => (
              <div key={item._id} className="border-b py-4 relative">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <IconButton onClick={() => handleEdit(item)} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(item._id)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
