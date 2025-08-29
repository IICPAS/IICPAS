"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { useAuth } from "@/contexts/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function LiveSesionAdmin() {
  const [tab, setTab] = useState("list");
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    startTime: "",
    endTime: "",
    date: "",
    link: "",
    price: "",
  });
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API}/api/live-sessions`);
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      title: form.title,
      time: `${form.startTime} - ${form.endTime}`,
      date: form.date,
      link: form.link,
      price: Number(form.price),
    };

    const res = await fetch(
      `${API}/api/live-sessions${editId ? `/${editId}` : ""}`,
      {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      await fetchSessions();
      resetForm();
      setTab("list");
    } else {
      Swal.fire("Error", "Failed to save session", "error");
    }
    setLoading(false);
  };

  const formatTimeRange = (timeRange) => {
    if (!timeRange) return "";
    const [start, end] = timeRange.split(" - ");
    return `${formatTime(start)} – ${formatTime(end)}`;
  };

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleEdit = (id) => {
    const session = sessions.find((s) => s._id === id);
    if (session) {
      const [startTime, endTime] = session.time.split(" - ");
      setForm({
        title: session.title,
        startTime,
        endTime,
        date: session.date.split("T")[0],
        link: session.link,
        price: session.price,
      });
      setEditId(id);
      setTab("create");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this session?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (confirm.isConfirmed) {
      const res = await fetch(`${API}/api/live-sessions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchSessions();
        Swal.fire("Deleted!", "Session deleted.", "success");
      }
    }
  };

  const toggleStatus = async (id) => {
    const res = await fetch(`${API}/api/live-sessions/toggle/${id}`, {
      method: "PATCH",
    });
    if (res.ok) fetchSessions();
  };

  const resetForm = () => {
    setForm({
      title: "",
      startTime: "",
      endTime: "",
      date: "",
      link: "",
      price: "",
    });
    setEditId(null);
  };

  // Bulk export functionality
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedSessions(sessions.map((s) => s._id));
    } else {
      setSelectedSessions([]);
    }
  };

  const handleSelectSession = (sessionId) => {
    setSelectedSessions((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const exportToCSV = () => {
    if (selectedSessions.length === 0) {
      Swal.fire("Warning", "Please select sessions to export", "warning");
      return;
    }

    const selectedData = sessions.filter((s) =>
      selectedSessions.includes(s._id)
    );

    // Create CSV content
    const headers = ["Title", "Date", "Time", "Link", "Price", "Status"];
    const csvContent = [
      headers.join(","),
      ...selectedData.map((session) =>
        [
          `"${session.title}"`,
          new Date(session.date).toDateString(),
          `"${session.time}"`,
          `"${session.link}"`,
          session.price,
          session.status,
        ].join(",")
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `live-sessions-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    Swal.fire("Success", "Sessions exported successfully!", "success");
  };

  const bulkDelete = async () => {
    if (selectedSessions.length === 0) {
      Swal.fire("Warning", "Please select sessions to delete", "warning");
      return;
    }

    const confirm = await Swal.fire({
      title: `Delete ${selectedSessions.length} session(s)?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (confirm.isConfirmed) {
      try {
        const deletePromises = selectedSessions.map((id) =>
          fetch(`${API}/api/live-sessions/${id}`, { method: "DELETE" })
        );

        await Promise.all(deletePromises);
        await fetchSessions();
        setSelectedSessions([]);
        Swal.fire(
          "Deleted!",
          `${selectedSessions.length} session(s) deleted.`,
          "success"
        );
      } catch (error) {
        Swal.fire("Error", "Failed to delete some sessions", "error");
      }
    }
  };

  return (
    <div className="w-[75vw] mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl lg:text-3xl font-bold">Live Sessions</h1>
        {tab === "list" ? (
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Tooltip title="Card View">
                <IconButton
                  onClick={() => setViewMode("cards")}
                  sx={{
                    bgcolor: viewMode === "cards" ? "#0f265c" : "transparent",
                    color: viewMode === "cards" ? "white" : "gray",
                    "&:hover": {
                      bgcolor:
                        viewMode === "cards" ? "#0f265c" : "rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <ViewModuleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Table View">
                <IconButton
                  onClick={() => setViewMode("table")}
                  sx={{
                    bgcolor: viewMode === "table" ? "#0f265c" : "transparent",
                    color: viewMode === "table" ? "white" : "gray",
                    "&:hover": {
                      bgcolor:
                        viewMode === "table" ? "#0f265c" : "rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <ViewListIcon />
                </IconButton>
              </Tooltip>
            </div>

            {/* Bulk Actions */}
            {viewMode === "table" && selectedSessions.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={exportToCSV}
                  sx={{ borderColor: "#0f265c", color: "#0f265c" }}
                >
                  Export ({selectedSessions.length})
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={bulkDelete}
                >
                  Delete ({selectedSessions.length})
                </Button>
              </div>
            )}

            {hasPermission("manage_live_sessions") && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: "#0f265c",
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 3,
                }}
                onClick={() => {
                  setTab("create");
                  resetForm();
                }}
              >
                Add Live Session
              </Button>
            )}
          </div>
        ) : (
          <Button
            variant="contained"
            sx={{ bgcolor: "#0f265c", borderRadius: 2, fontWeight: 600, px: 3 }}
            onClick={() => {
              setTab("list");
              resetForm();
            }}
          >
            ← Back to Sessions
          </Button>
        )}
      </div>

      {tab === "list" && (
        <>
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sessions.map((s) => (
                <div
                  key={s._id}
                  className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-400 relative"
                >
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      bgcolor: "#f4f4f4",
                    }}
                    component="a"
                    href={
                      s.link.startsWith("http") ? s.link : `https://${s.link}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>

                  <div className="text-lg font-semibold mb-1">{s.title}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(s.date).toDateString()}, {formatTimeRange(s.time)}
                  </div>
                  <div className="text-sm mb-3">Link: {s.link}</div>
                  <div className="text-sm mb-3">Price: ₹{s.price}</div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {hasPermission("manage_live_sessions") && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleEdit(s._id)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleDelete(s._id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Switch
                        checked={s.status === "active"}
                        onChange={() => toggleStatus(s._id)}
                        color="success"
                      />
                      <span className="text-xs font-medium">
                        {s.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={
                          selectedSessions.length === sessions.length &&
                          sessions.length > 0
                        }
                        indeterminate={
                          selectedSessions.length > 0 &&
                          selectedSessions.length < sessions.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Link</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session._id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedSessions.includes(session._id)}
                          onChange={() => handleSelectSession(session._id)}
                        />
                      </TableCell>
                      <TableCell>{session.title}</TableCell>
                      <TableCell>
                        {new Date(session.date).toDateString()}
                      </TableCell>
                      <TableCell>{formatTimeRange(session.time)}</TableCell>
                      <TableCell>
                        <a
                          href={
                            session.link.startsWith("http")
                              ? session.link
                              : `https://${session.link}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {session.link}
                        </a>
                      </TableCell>
                      <TableCell>₹{session.price}</TableCell>
                      <TableCell>
                        <Switch
                          checked={session.status === "active"}
                          onChange={() => toggleStatus(session._id)}
                          color="success"
                          size="small"
                        />
                        <span className="ml-2 text-xs">
                          {session.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {hasPermission("manage_live_sessions") && (
                            <>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(session._id)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(session._id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {tab === "create" && (
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {["title", "date", "startTime", "endTime", "link", "price"].map(
            (name) => {
              const label =
                name === "title"
                  ? "Title"
                  : name === "date"
                  ? "Date"
                  : name === "startTime"
                  ? "Start Time"
                  : name === "endTime"
                  ? "End Time"
                  : name === "link"
                  ? "Link"
                  : "Price (In Rupees)";
              const type =
                name === "date" || name.includes("Time")
                  ? name.includes("Time")
                    ? "time"
                    : "date"
                  : name === "price"
                  ? "number"
                  : "text";
              return (
                <div key={name}>
                  <label className="block font-semibold mb-2">{label}</label>
                  <input
                    type={type}
                    className="w-full border px-4 py-3 rounded-lg bg-gray-50"
                    placeholder={label}
                    value={form[name]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [name]: e.target.value }))
                    }
                  />
                </div>
              );
            }
          )}

          <div className="md:col-span-2 mt-8">
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#0f265c",
                borderRadius: 2,
                fontWeight: 600,
                px: 5,
                py: 1.8,
                fontSize: 18,
              }}
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : editId ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
