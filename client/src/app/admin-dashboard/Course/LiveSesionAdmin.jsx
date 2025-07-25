"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function LiveSessionAdmin() {
  const [tab, setTab] = useState("list");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    startTime: "",
    endTime: "",
    date: "",
    link: "",
    price: "",
  });

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

  return (
    <div className="w-[75vw] mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl lg:text-3xl font-bold">Live Sessions</h1>
        {tab === "list" ? (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: "#0f265c", borderRadius: 2, fontWeight: 600, px: 3 }}
            onClick={() => {
              setTab("create");
              resetForm();
            }}
          >
            Add Live Session
          </Button>
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
                href={s.link.startsWith("http") ? s.link : `https://${s.link}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>

              <div className="text-lg font-semibold mb-1">{s.title}</div>
              <div className="text-sm text-gray-500">
                {new Date(s.date).toDateString()}, {formatTimeRange(s.time)}
              </div>
              {/* <div className="text-sm text-blue-600 my-2">{s.time}</div> */}
              <div className="text-sm mb-3">Link: {s.link}</div>
              <div className="text-sm mb-3">Price: ₹{s.price}</div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
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
