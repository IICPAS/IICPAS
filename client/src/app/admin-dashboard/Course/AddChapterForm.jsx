"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function AddChapterForm({ courseId, onCancel, onAdded }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      Swal.fire("Validation Error", "Chapter title is required.", "warning");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/chapters/by-course/${courseId}`, {
        title: title.trim(),
        status,
      });
      setLoading(false);
      Swal.fire("Success", "Chapter added successfully!", "success");
      onAdded(); // Notify parent to refresh and close the form
    } catch (error) {
      setLoading(false);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to add chapter",
        "error"
      );
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        bgcolor: "white",
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Typography variant="h6" mb={2}>
        Add Chapter
      </Typography>

      <TextField
        label="Chapter Title"
        fullWidth
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Chapter"}
        </Button>
      </Stack>
    </Box>
  );
}
