"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Plus, Check } from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

export default function CollegeBookingsMainArea() {
  const [email, setEmail] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", hrs: 1 });
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch verified college info on mount
  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await axios.get(`${API}/college/isCollege`, {
          withCredentials: true,
        });
        setEmail(res.data.email);
      } catch (err) {
        toast.error("Unauthorized. Please login.");
        window.location.href = "/join/college";
      }
    };
    fetchCollege();
  }, []);

  // Fetch all bookings for this college.email
  useEffect(() => {
    if (email) fetchBookings();
    // eslint-disable-next-line
  }, [email]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/bookings?by=${email}`);
      setBookings(res.data || []);
    } catch (err) {
      setBookings([]);
    }
    setLoading(false);
  };

  // Add booking (inline form)
  const handleAddBooking = async (e) => {
    e.preventDefault();
    if (!form.title || !form.hrs) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await axios.post(`${API}/bookings`, {
        by: email,
        type: "college",
        title: form.title,
        hrs: form.hrs,
      });
      toast.success("Booking request sent!");
      setForm({ title: "", hrs: 1 });
      setShowForm(false);
      fetchBookings();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Booking failed");
    }
  };

  // Calendar event pin logic (PIN IS ALWAYS BLACK)
  const bookedEvents = bookings.filter((b) => b.status === "booked");
  const calendarTileContent = ({ date }) => {
    const found = bookedEvents.find(
      (b) => b.date && new Date(b.date).toDateString() === date.toDateString()
    );
    if (found)
      return (
        <span
          className="block text-center mt-1"
          style={{
            fontSize: "1.3em",
            lineHeight: "1em",
            color: "#111", // Always black pin
            userSelect: "none",
          }}
          title={found.title}
        >
          📌
        </span>
      );
    return null;
  };

  // List events for selected calendar day
  const eventsForSelected = bookedEvents.filter(
    (b) =>
      b.date && new Date(b.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 pb-8">
      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-lg p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-700">Your Bookings</h2>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
          >
            <Plus size={18} /> {showForm ? "Close" : "Add Booking"}
          </button>
        </div>
        {/* Inline Add Booking Form */}
        {showForm && (
          <form
            onSubmit={handleAddBooking}
            className="flex flex-wrap gap-4 bg-blue-50 p-4 rounded-lg mb-6 border items-end"
          >
            <div className="flex flex-col flex-1 min-w-[180px]">
              <label className="mb-1 font-medium text-blue-900">Topic</label>
              <input
                className="border rounded px-3 py-2"
                placeholder="Enter topic"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </div>
            <div className="flex flex-col w-28">
              <label className="mb-1 font-medium text-blue-900">Hours</label>
              <input
                className="border rounded px-3 py-2"
                type="number"
                min={1}
                max={8}
                placeholder="Hours"
                value={form.hrs}
                onChange={(e) =>
                  setForm((f) => ({ ...f, hrs: Number(e.target.value) }))
                }
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 mt-4"
              disabled={loading}
              style={{ height: 44 }}
            >
              {loading ? (
                "Booking..."
              ) : (
                <>
                  <Check className="inline" size={18} /> Book
                </>
              )}
            </button>
          </form>
        )}
        {/* Excel-like Booking Grid */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl shadow-sm">
            <thead>
              <tr className="bg-blue-100 text-blue-900 text-sm">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Hours</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Start</th>
                <th className="px-4 py-2">End</th>

                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-8">
                    No bookings found.
                  </td>
                </tr>
              )}
              {bookings.map((b) => (
                <tr key={b._id} className="border-t hover:bg-blue-50 text-sm">
                  <td className="px-4 py-2">{b.title}</td>
                  <td className="px-4 py-2">{b.type}</td>
                  <td className="px-4 py-2">{b.hrs}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold
                      ${
                        b.status === "booked"
                          ? "bg-green-100 text-green-700"
                          : b.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {b.date ? new Date(b.date).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {b.start
                      ? new Date(b.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {b.end
                      ? new Date(b.end).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bookings Calendar */}
      <div
        className="bg-white rounded-xl shadow p-8 mx-auto"
        style={{ width: "80vw", maxWidth: 900, minWidth: 340 }}
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
          <span style={{ fontSize: "1.5em" }}>📌</span> Bookings Calendar
        </h2>
        <Calendar
          value={selectedDate}
          onChange={(v) => setSelectedDate(v instanceof Date ? v : v[0])}
          className="big-modern-calendar calendar-grid"
          tileContent={calendarTileContent}
          tileClassName={({ date }) => {
            const found = bookedEvents.find(
              (b) =>
                b.date &&
                new Date(b.date).toDateString() === date.toDateString()
            );
            return found
              ? "has-pin bg-blue-50 !rounded-xl font-bold border border-blue-300 shadow"
              : "";
          }}
        />
        <div className="mt-6">
          <div className="font-semibold text-blue-700 flex items-center gap-2 mb-2">
            <span role="img" aria-label="calendar">
              🗓️
            </span>
            Booked on{" "}
            <span className="ml-1">{selectedDate.toLocaleDateString()}</span>
          </div>
          {eventsForSelected.length === 0 ? (
            <div className="text-gray-400 ml-6">No bookings.</div>
          ) : (
            <ul className="space-y-2">
              {eventsForSelected.map((ev) => (
                <li
                  key={ev._id}
                  className="border-l-4 border-green-400 pl-4 py-2 bg-green-50 rounded"
                >
                  <div className="font-medium text-gray-800">
                    {ev.title} ({ev.hrs} hr)
                  </div>
                  <div className="text-xs text-gray-600">
                    {ev.start &&
                      new Date(ev.start).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                    -{" "}
                    {ev.end &&
                      new Date(ev.end).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modern calendar grid styles */}
      <style jsx global>{`
        .big-modern-calendar {
          width: 100% !important;
          font-size: 1.1rem;
          border-radius: 20px !important;
          box-shadow: 0 8px 28px rgba(20, 70, 140, 0.09);
          min-height: 380px;
          background: #fafdff;
          border: 2px solid #e5eaff;
          padding: 8px 0;
        }
        .big-modern-calendar .react-calendar__tile {
          min-height: 52px;
          font-size: 1.15em;
          border-radius: 14px !important;
          border: 1px solid #eef4fc;
          margin: 2px;
          transition: box-shadow 0.15s;
          position: relative;
          background: #fcfcff;
        }
        .big-modern-calendar .react-calendar__tile:enabled:hover,
        .big-modern-calendar .react-calendar__tile--active {
          background: #387ff7 !important;
          color: #fff !important;
          box-shadow: 0 2px 8px #387ff725;
          border-color: #387ff7;
        }
        .big-modern-calendar .react-calendar__tile.has-pin {
          font-weight: 600;
          color: #1a3b6b;
          background: #eaf2ff !important;
          border: 2px solid #387ff7 !important;
          box-shadow: 0 1px 6px #387ff718;
        }
        .big-modern-calendar
          .react-calendar__month-view__days__day--neighboringMonth {
          opacity: 0.33;
        }
        /* Responsive grid columns for big calendar */
        .calendar-grid .react-calendar__month-view__days {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
      `}</style>
    </div>
  );
}
