"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
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

export default function TopicList({
  chapterId,
  chapterName,
  onViewChapters,
  onAddTopic,
  onEditTopic, // <-- NEW!
}) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchTopics = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/topics/by-chapter/${chapterId}`)
      .then((res) => setTopics((res.data || []).filter(Boolean)))
      .finally(() => setLoading(false));
  }, [chapterId]);

  useEffect(() => {
    if (chapterId) fetchTopics();
  }, [chapterId, fetchTopics]);

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this topic!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE}/topics/${id}`);
        fetchTopics();
        MySwal.fire("Deleted!", "Topic has been deleted.", "success");
      } catch {
        MySwal.fire("Error!", "Failed to delete topic", "error");
      }
    }
  };

  const filteredTopics = (topics || []).filter(
    (topic) =>
      topic &&
      topic.title &&
      topic.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: "title", headerName: "Topic Name", flex: 1 },
    {
      field: "actions",
      headerName: "Action",
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit Topic">
            <IconButton
              color="info"
              size="small"
              onClick={() => onEditTopic && onEditTopic(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Topic">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDelete(params.row?._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight={700}>
          Topics for "{chapterName}"
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={onViewChapters}>
            View Chapters
          </Button>
          <Button variant="contained" onClick={onAddTopic}>
            + Add Topic
          </Button>
        </Stack>
      </Stack>

      <TextField
        placeholder="Search..."
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Box sx={{ bgcolor: "white", borderRadius: 3, boxShadow: 2, p: 2 }}>
        <DataGrid
          autoHeight
          rows={filteredTopics
            .filter(Boolean)
            .map((t) => ({ ...t, id: t._id }))}
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
