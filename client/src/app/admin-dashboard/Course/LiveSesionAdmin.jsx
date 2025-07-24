"use client";
import { useState } from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// --- MOCK DATA ---
const mockSessions = [
  {
    _id: "1",
    title: "Basic Accounting & Tally Foundation",
    date: "20 July 2025",
    time: "10:00 AM - 05:00 PM",
    color: "blue",
    ended: true,
  },
  {
    _id: "2",
    title: "Basic Accounting & Tally Foundation",
    date: "11 July 2025",
    time: "01:23 PM - 03:23 PM",
    color: "pink",
    ended: true,
  },
  {
    _id: "3",
    title: "Basic Accounting & Tally Foundation",
    date: "28 June 2025",
    time: "11:43 AM - 03:43 PM",
    color: "orange",
    ended: true,
  },
];

const COLORS = {
  blue: {
    border: "border-l-4 border-blue-400",
    bg: "bg-blue-50",
    text: "text-blue-600",
    time: "bg-blue-100 text-blue-600",
    icon: "text-blue-400",
  },
  pink: {
    border: "border-l-4 border-pink-400",
    bg: "bg-pink-50",
    text: "text-pink-600",
    time: "bg-pink-100 text-pink-600",
    icon: "text-pink-400",
  },
  orange: {
    border: "border-l-4 border-orange-400",
    bg: "bg-orange-50",
    text: "text-orange-600",
    time: "bg-orange-100 text-orange-600",
    icon: "text-orange-400",
  },
};

export default function LiveSessionAdmin() {
  const [tab, setTab] = useState("list"); // "list" or "create"
  const [form, setForm] = useState({
    course: "",
    content: "",
    startTime: "",
    endTime: "",
    date: "",
    link: "",
    price: "",
    image: null,
  });

  // --- UI Start ---
  return (
    <div className="w-[78vw] mx-auto py-10">
      {tab === "list" && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Live Sessions</h1>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: "#0f265c",
                "&:hover": { bgcolor: "#233772" },
                borderRadius: 2,
                fontWeight: 600,
                px: 3,
                textTransform: "none",
              }}
              onClick={() => setTab("create")}
            >
              Add Live Session
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockSessions.map((session) => {
              const c = COLORS[session.color] || COLORS.blue;
              return (
                <div
                  key={session._id}
                  className={`relative ${c.bg} ${c.border} rounded-2xl shadow-sm px-5 py-6 flex flex-col`}
                >
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      bgcolor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px 0 #00000010",
                    }}
                  >
                    <OpenInNewIcon className={`${c.icon}`} />
                  </IconButton>
                  <div className="font-semibold text-lg mb-1">
                    {session.title || "Unknown"}
                  </div>
                  <div className="text-gray-500 text-sm mb-2">
                    {session.date}
                  </div>
                  <div
                    className={`inline-block px-3 py-1 rounded-xl mb-4 font-semibold ${c.time}`}
                  >
                    {session.time}
                  </div>
                  <div className="flex gap-2 items-center mb-3">
                    <Tooltip title="Mark as Ended">
                      <IconButton color="success" size="small" disabled>
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton color="primary" size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                  {session.ended && (
                    <span className="inline-block px-3 py-1 rounded-md bg-pink-500 text-white text-xs font-medium w-max">
                      Session Ended
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* CREATE FORM */}
      {tab === "create" && (
        <div className="bg-white  mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Create Live Session</h2>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#0f265c",
                "&:hover": { bgcolor: "#233772" },
                borderRadius: 2,
                fontWeight: 600,
                px: 3,
                textTransform: "none",
              }}
              onClick={() => setTab("list")}
            >
              View Live Sessions
            </Button>
          </div>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              // ...API call here
              setTab("list");
            }}
          >
            <div>
              <label className="block font-semibold mb-2">Select course</label>
              <select
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 ring-blue-200 outline-none bg-gray-50"
                value={form.course}
                onChange={(e) =>
                  setForm((f) => ({ ...f, course: e.target.value }))
                }
              >
                <option value="">Select Course</option>
                <option value="Course1">
                  Basic Accounting & Tally Foundation
                </option>
                {/* Add dynamic options */}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Image</label>
              <input
                type="file"
                className="w-full border px-4 py-2 rounded-lg bg-gray-50"
                onChange={(e) =>
                  setForm((f) => ({ ...f, image: e.target.files[0] }))
                }
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Content</label>
              <input
                type="text"
                className="w-full border px-4 py-3 rounded-lg bg-gray-50"
                placeholder="Enter the content"
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Date</label>
              <input
                type="date"
                className="w-full border px-4 py-3 rounded-lg bg-gray-50"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Start Time</label>
              <input
                type="time"
                className="w-full border px-4 py-3 rounded-lg bg-gray-50"
                value={form.startTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startTime: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">End Time</label>
              <input
                type="time"
                className="w-full border px-4 py-3 rounded-lg bg-gray-50"
                value={form.endTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endTime: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Link</label>
              <input
                type="text"
                className="w-full border px-4 py-3 rounded-lg bg-gray-50"
                placeholder="Enter the link"
                value={form.link}
                onChange={(e) =>
                  setForm((f) => ({ ...f, link: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">
                Price (In Rupees)
              </label>
              <input
                type="number"
                className="w-full border px-4 py-3 rounded-lg bg-gray-50"
                placeholder="Enter the price"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2 mt-8">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#0f265c",
                  "&:hover": { bgcolor: "#233772" },
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 5,
                  py: 1.8,
                  fontSize: 18,
                  boxShadow: "none",
                  textTransform: "none",
                  letterSpacing: 0,
                }}
                fullWidth
              >
                Create
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
