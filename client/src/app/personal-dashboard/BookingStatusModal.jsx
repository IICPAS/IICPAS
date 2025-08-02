import React from "react";
import Stepper from "./Stepper";

const LaptopIcon = () => (
  <svg
    width="38"
    height="38"
    fill="none"
    stroke="#387ff7"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="4" width="18" height="12" rx="2" ry="2"></rect>
    <path d="M2 20h20"></path>
  </svg>
);

const BookingStatusModal = ({ modalOpen, setModalOpen, selectedBooking }) => {
  if (!modalOpen || !selectedBooking) return null;

  return (
    <div className="modal-bg-blur">
      <div className="bg-white rounded-md shadow-lg p-8 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={() => setModalOpen(false)}
        >
          ×
        </button>
        <div className="flex justify-center mb-4">
          <LaptopIcon />
        </div>
        <h3 className="text-xl font-bold mb-8 text-blue-700 text-center">
          Booking Status
        </h3>
        <Stepper selectedBooking={selectedBooking} />
      </div>
    </div>
  );
};

export default BookingStatusModal;
