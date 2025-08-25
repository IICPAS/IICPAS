"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Plus, Check, X as XIcon, Laptop } from "lucide-react";
import Select from "react-select";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";
const URL = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8080";

export default function CompanyBookingsMainArea() {
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", hrs: 1, category: "onsite" });
  const [trainings, setTrainings] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingReceipt, setBookingReceipt] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`${API}/companies/iscompany`, {
          withCredentials: true,
        });
        setEmail(res.data.company.email);
        setName(res.data.company.name);
      } catch {
        toast.error("Unauthorized. Please login.");
        window.location.href = "/placements/hire";
      }
    };
    fetchCompany();
  }, []);

  // Fetch trainings on mount
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await axios.get(`${API}/v1/topics-trainings`);
        setTrainings(res.data || []);
      } catch (err) {
        toast.error("Failed to fetch trainings");
      }
    };
    fetchTrainings();
  }, []);

  useEffect(() => {
    if (email) fetchBookings();
  }, [email]);

  // Only allow booking after successful payment verification and transaction save
  const handlePayAndBook = async () => {
    if (!form.title || !selectedPrice) {
      toast.error("Please select a training");
      return;
    }
    console.log(API + "/payments/create-order");
    const totalPrice = selectedPrice * form.hrs;
    const res = await axios.post(API + "/payments/create-order", {
      price: totalPrice,
      email,
      trainingTitle: form.title,
      category: form.category,
      hrs: form.hrs,
      type: form.type,
    });
    const { orderId, amount, currency, key } = res.data;
    const options = {
      key,
      amount,
      currency,
      name: "LMS Booking",
      description: `Payment for ${form.title}`,
      order_id: orderId,
      handler: async function (response) {
        // Verify payment
        const verifyRes = await axios.post(API + "/payments/verify", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
        if (verifyRes.data.success) {
          toast.success("Payment successful! Transaction saved.");
          // Booking is automatically created on backend after successful payment
          fetchBookings(); // Refresh the bookings list
        } else {
          toast.error("Payment verification failed");
        }
      },
      prefill: { email },
      theme: { color: "#2563eb" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/bookings?by=${email}`, {
        withCredentials: true,
      });
      setBookings(res.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    }
    setLoading(false);
  };

  const fetchBookingReceipt = async (bookingId) => {
    try {
      console.log("Fetching receipt for booking ID:", bookingId);

      // First try to get receipt by booking ID (most accurate)
      try {
        const res = await axios.get(
          `${API}/payments/receipts/booking/${bookingId}`
        );
        console.log("Receipt found by booking ID:", res.data);
        setBookingReceipt(res.data);
        return;
      } catch (error) {
        // If not found by booking ID, fallback to email-based search
        console.log("Receipt not found by booking ID, trying email search...");
      }

      // Fallback: search by email and match by title
      const res = await axios.get(`${API}/payments/receipts?email=${email}`);
      const receipts = res.data || [];
      console.log("All receipts for email:", receipts);

      const receipt = receipts.find(
        (r) => r.bookingId === bookingId || r.for === selectedBooking?.title
      );
      console.log("Found receipt:", receipt);
      setBookingReceipt(receipt || null);
    } catch (error) {
      console.error("Error fetching receipt:", error);
      setBookingReceipt(null);
    }
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();
    if (!form.title || !form.hrs || !form.category)
      return toast.error("Fill all fields");

    const start = new Date(selectedDate);
    start.setHours(10, 0);
    const end = new Date(start.getTime() + form.hrs * 60 * 60 * 1000);

    try {
      await axios.post(
        `${API}/bookings`,
        {
          ...form,
          by: email,
          type: "company",
          date: selectedDate,
          start,
          end,
        },
        { withCredentials: true }
      );
      toast.success("Booking request sent!");
      setForm({ title: "", hrs: 1, category: "onsite" });
      setShowForm(false);
      fetchBookings();
    } catch (err) {
      console.log(err);
    }
  };

  const bookedEvents = bookings.filter((b) => b.status === "booked");
  const eventsForSelected = bookedEvents.filter(
    (b) =>
      b.date && new Date(b.date).toDateString() === selectedDate.toDateString()
  );

  // Stepper modal for tracking booking status (horizontal, with laptop icon, show link for live/recorded)
  const renderStepperModal = () => {
    if (!selectedBooking) return null;
    const status = selectedBooking.status;
    const isLiveOrRecorded =
      selectedBooking.category === "live" ||
      selectedBooking.category === "recorded";
    const formatDate = (dateStr) =>
      dateStr
        ? new Date(dateStr).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        : "-";
    const formatDateParts = (dateStr) => {
      if (!dateStr) return ["-", "-", "-"];
      const d = new Date(dateStr);
      return [
        d.toLocaleDateString("en-US", { weekday: "long" }),
        d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      ];
    };

    let steps = [];
    if (status === "rejected") {
      steps = [
        {
          label: "Requested",
          dateParts: formatDateParts(selectedBooking.createdAt),
          completed: true,
          icon: <Laptop size={22} className="text-blue-600" />,
          extra: null,
        },
        {
          label: "Rejected",
          dateParts: formatDateParts(selectedBooking.updatedAt),
          completed: true,
          icon: <XIcon size={22} className="text-red-600" />,
          extra: null,
        },
      ];
    } else if (status === "booked") {
      steps = [
        {
          label: "Requested",
          dateParts: formatDateParts(selectedBooking.createdAt),
          completed: true,
          icon: <Laptop size={22} className="text-blue-600" />,
          extra: null,
        },
        {
          label: "Booked",
          dateParts: formatDateParts(selectedBooking.start),
          completed: true,
          icon: <Check size={22} className="text-green-600" />,
          extra: (
            <div className="mt-1">
              {isLiveOrRecorded && selectedBooking.link ? (
                <a
                  href={selectedBooking.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-xs block"
                >
                  View Link
                </a>
              ) : null}
              {bookingReceipt && (
                <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                  <div className="text-xs text-green-800 font-semibold mb-1">
                    Receipt
                  </div>
                  <div className="text-xs text-green-700 space-y-0.5">
                    <div>Amount: ₹{bookingReceipt.amount}</div>
                    <div>
                      Order ID:{" "}
                      {bookingReceipt.razorpay_order_id
                        ? bookingReceipt.razorpay_order_id.slice(-8)
                        : "N/A"}
                    </div>
                    {bookingReceipt.receiptLink && (
                      <a
                        href={URL + bookingReceipt.receiptLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline block"
                      >
                        View Receipt PDF
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ),
        },
      ];
    } else {
      steps = [
        {
          label: "Requested",
          dateParts: formatDateParts(selectedBooking.createdAt),
          completed: true,
          icon: <Laptop size={22} className="text-blue-600" />,
          extra: null,
        },
        {
          label: "Pending",
          dateParts: null,
          completed: false,
          icon: <Laptop size={22} className="text-blue-600" />,
          extra: null,
        },
      ];
    }
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => {
            setModalOpen(false);
            setSelectedBooking(null);
          }}
        />
        <div className="relative bg-white rounded-xl shadow-xl p-8 max-w-xl w-full z-10">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            onClick={() => {
              setModalOpen(false);
              setSelectedBooking(null);
              setBookingReceipt(null);
            }}
          >
            <XIcon size={24} />
          </button>
          <h3 className="text-xl font-bold mb-4 text-blue-700 text-center">
            Booking Status
          </h3>
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Booking ID:</strong> #{selectedBooking._id.slice(-8)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Training:</strong> {selectedBooking.title}
            </p>
          </div>
          {/* Stepper Circles and Lines */}
          <div className="mb-6 w-full">
            <div
              className="flex items-center justify-between relative w-full"
              style={{ minHeight: 60 }}
            >
              {steps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center flex-1 min-w-[90px]">
                    <div
                      className={`w-11 h-11 flex items-center justify-center rounded-full border-2 z-10 bg-white
                        ${
                          step.completed
                            ? step.label === "Rejected"
                              ? "border-red-500 bg-red-100"
                              : "border-green-500 bg-green-100"
                            : "border-gray-300 bg-gray-100"
                        }`}
                    >
                      {step.icon}
                    </div>
                  </div>
                  {/* Line between steps */}
                  {idx < steps.length - 1 && (
                    <div
                      className="absolute z-0"
                      style={{
                        top: 32, // half of circle height (44px) + margin
                        left: `calc(${
                          ((idx + 1) / steps.length) * 100
                        }% - 22px)`,
                        right: `calc(100% - ${
                          ((idx + 1) / steps.length) * 100
                        }% - 22px)`,
                        height: 3,
                        background:
                          step.completed && steps[idx + 1].completed
                            ? step.label === "Rejected" ||
                              steps[idx + 1].label === "Rejected"
                              ? "#f87171"
                              : "#22c55e"
                            : "#d1d5db",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            {/* Stepper Labels and Dates */}
            <div className="flex items-start justify-between mt-2 w-full">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center min-w-[90px]"
                >
                  <span className="font-semibold text-gray-800 text-sm text-center">
                    {step.label}
                  </span>
                  {step.dateParts && (
                    <span className="text-xs text-gray-500 mt-0.5 text-center">
                      {step.dateParts[0]}
                      <br />
                      {step.dateParts[1]}
                      <br />
                      {step.dateParts[2]}
                    </span>
                  )}
                  {step.extra}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
            color: "#111",
            userSelect: "none",
          }}
          title={found.title}
        >
          📌
        </span>
      );
    return null;
  };

  return (
    <>
      <div className="w-[79vw] mx-auto space-y-5 pb-8 mt-12">
        <div className="pl-8 pr-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-blue-700">
              Bookings for {name}
            </h2>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
            >
              <Plus size={18} /> {showForm ? "Close" : "Add Booking"}
            </button>
          </div>
        </div>

        {/*For the training session booking form*/}
        {showForm && (
          <form
            onSubmit={handleAddBooking}
            className="add-booking-form bg-blue-50 p-4 rounded-lg mb-6 border"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "flex-end",
              width: "100%",
            }}
          >
            <div
              style={{
                flex: 2,
                minWidth: 180,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label className="mb-1 font-medium text-blue-900">Topic</label>
              <Select
                options={trainings.map((t) => ({
                  value: t.title,
                  label: t.title,
                }))}
                value={
                  form.title ? { value: form.title, label: form.title } : null
                }
                onChange={async (option) => {
                  setForm((f) => ({ ...f, title: option ? option.value : "" }));
                  if (option && option.value) {
                    try {
                      const res = await axios.get(`${API}/v1/topics-trainings`);
                      const allTrainings = res.data || [];
                      const found = allTrainings.find(
                        (t) => t.title === option.value
                      );
                      if (found) {
                        setSelectedPrice(found.pricePerHour || found.price);
                        console.log(
                          "price per hour:",
                          found.pricePerHour || found.price
                        );
                      } else {
                        setSelectedPrice(null);
                      }
                    } catch (err) {
                      setSelectedPrice(null);
                    }
                  } else {
                    setSelectedPrice(null);
                  }
                }}
                placeholder="Select a training..."
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
                required
              />
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 100,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label className="mb-1 font-medium text-blue-900">Hours</label>
              <input
                className="border rounded px-3 py-2"
                type="number"
                min={1}
                max={8}
                value={form.hrs}
                onChange={(e) =>
                  setForm((f) => ({ ...f, hrs: Number(e.target.value) }))
                }
                required
              />
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 120,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label className="mb-1 font-medium text-blue-900">Type</label>
              <select
                className="border rounded px-3 py-2"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                required
              >
                <option value="onsite">Onsite</option>
                <option value="live">Live</option>
                <option value="recorded">Recorded</option>
              </select>
            </div>
            {selectedPrice && (
              <div className="mb-2 text-blue-700 font-semibold">
                Price per Hour: ₹{selectedPrice}
                {form.hrs > 0 && (
                  <div className="text-sm text-gray-600">
                    Total for {form.hrs} hour(s): ₹{selectedPrice * form.hrs}
                  </div>
                )}
              </div>
            )}
            <button
              type="button"
              className="bg-green-600 text-white px-7 py-2 rounded font-semibold hover:bg-green-700"
              style={{ height: 44, flex: 1, minWidth: 120, marginTop: 24 }}
              disabled={loading || !selectedPrice}
              onClick={handlePayAndBook}
            >
              Pay & Book
            </button>
            {/* Only show Pay & Book button, no regular Book button */}
            <style>{`
              @media (max-width: 900px) {
                .add-booking-form {
                  flex-direction: column !important;
                  gap: 10px !important;
                }
                .add-booking-form > div, .add-booking-form > button {
                  min-width: 0 !important;
                  width: 100% !important;
                  margin-top: 0 !important;
                }
              }
            `}</style>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-blue-100 text-blue-900 text-sm">
                <th className="px-4 py-2">Booking ID</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Hours</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Start</th>
                <th className="px-4 py-2">End</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-gray-400 py-8">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="border-t hover:bg-blue-50 text-sm">
                    <td className="px-4 py-2 font-mono text-xs">
                      #{b._id.slice(-8)}
                    </td>
                    <td className="px-4 py-2">{b.title}</td>
                    <td className="px-4 py-2 capitalize">{b.type}</td>
                    <td className="px-4 py-2">{b.hrs}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded font-semibold text-xs shadow"
                        onClick={async () => {
                          setSelectedBooking(b);
                          setModalOpen(true);
                          // Fetch receipt when opening modal
                          await fetchBookingReceipt(b._id);
                        }}
                      >
                        Track
                      </button>
                    </td>
                    <td className="px-4 py-2">{b.category}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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

      {modalOpen && selectedBooking && renderStepperModal()}

      {/* Calendar Styles */}
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
        .calendar-grid .react-calendar__month-view__days {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
      `}</style>
    </>
  );
}
