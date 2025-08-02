import React from "react";
import { Check } from "lucide-react";

const BookingForm = ({ form, setForm, handleAddBooking, loading }) => {
  return (
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
        <input
          className="border rounded px-3 py-2"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
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
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          required
        >
          <option value="onsite">Onsite</option>
          <option value="live">Live</option>
          <option value="recorded">Recorded</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-7 py-2 rounded font-semibold hover:bg-blue-700"
        disabled={loading}
        style={{ height: 44, flex: 1, minWidth: 120, marginTop: 24 }}
      >
        {loading ? (
          "Booking..."
        ) : (
          <>
            <Check className="inline" size={18} /> Book
          </>
        )}
      </button>
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
  );
};

export default BookingForm;
