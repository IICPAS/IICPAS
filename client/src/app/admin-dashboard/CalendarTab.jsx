import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";
const MySwal = withReactContent(Swal);

const CalendarTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch all bookings (admin)
  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/bookings`);
      setBookings(res.data || []);
    } catch (err) {
      setBookings([]);
      toast.error("Failed to fetch bookings.");
    }
    setLoading(false);
  };

  // Admin schedule/approve
  const handleSchedule = async (id) => {
    try {
      await axios.patch(
        `${API}/bookings/${id}/approve`,
        {},
        { withCredentials: true }
      );
      toast.success("Scheduled!");
      fetchBookings();
    } catch (err) {
      toast.error("Failed to schedule");
    }
  };

  // Admin reject/cancel with SweetAlert2 confirmation
  const handleCancel = async (id) => {
    const result = await MySwal.fire({
      title: "Cancel this booking?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    try {
      await axios.patch(
        `${API}/bookings/${id}/reject`,
        {},
        { withCredentials: true }
      );
      toast.success("Booking cancelled!");
      fetchBookings();
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  // Calendar logic
  const bookedEvents = bookings.filter((b) => b.status === "booked");
  const calendarTileContent = ({ date }) => {
    const found = bookedEvents.find(
      (b) => b.date && new Date(b.date).toDateString() === date.toDateString()
    );
    return found ? (
      <span
        className="block text-center mt-1"
        style={{ fontSize: "1.3em", lineHeight: "1em", color: "#232323" }}
        title={found.title}
      >
        📌
      </span>
    ) : null;
  };

  const eventsForSelected = bookedEvents.filter(
    (b) =>
      b.date && new Date(b.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 pb-8">
      {/* All Bookings Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          All Bookings (Admin)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl shadow-sm">
            <thead>
              <tr className="bg-blue-100 text-blue-900 text-sm">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">By</th>
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
                  <td colSpan={9} className="text-center text-gray-400 py-8">
                    No bookings found.
                  </td>
                </tr>
              )}
              {bookings.map((b) => (
                <tr key={b._id} className="border-t hover:bg-blue-50 text-sm">
                  <td className="px-4 py-2">{b.title}</td>
                  <td className="px-4 py-2">{b.type}</td>
                  <td className="px-4 py-2">{b.by}</td>
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
                  <td className="px-4 py-2 text-center flex gap-2 justify-center">
                    {b.status === "pending" && (
                      <button
                        onClick={() => handleSchedule(b._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                      >
                        Admin Schedule
                      </button>
                    )}
                    {(b.status === "pending" || b.status === "booked") && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        className="px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center justify-center"
                        title="Cancel booking"
                      >
                        <X size={18} />
                      </button>
                    )}
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
        style={{ width: "80vw", maxWidth: 950, minWidth: 340 }}
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
          color: #232323;
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
          color: #232323 !important;
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
};

export default CalendarTab;
