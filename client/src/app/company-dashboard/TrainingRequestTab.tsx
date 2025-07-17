"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import "react-calendar/dist/Calendar.css";
import { FaUserGraduate, FaEnvelope, FaFileAlt } from "react-icons/fa";

Modal.setAppElement("body");

interface Request {
  id: number;
  student: string;
  email: string;
  training: string;
  category: string;
  resume: string;
  scheduled: string | null;
}

const TrainingRequestTab = () => {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 1,
      student: "Riya Sharma",
      email: "riya@example.com",
      training: "React & Tailwind",
      category: "B.Tech CSE",
      resume: "https://example.com/resume.pdf",
      scheduled: null,
    },
  ]);

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Request | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [trainingDate, setTrainingDate] = useState("");
  const [trainingTime, setTrainingTime] = useState("");

  const todayISO = new Date().toISOString().split("T")[0];

  const openModal = (req: Request) => {
    setSelected(req);
    setModalOpen(true);
  };

  const handleSchedule = () => {
    if (!selected) return;

    const isoDateTime = new Date(
      `${trainingDate}T${trainingTime}`
    ).toISOString();

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selected.id ? { ...r, scheduled: isoDateTime } : r
      )
    );

    setNotes((prev) => ({
      ...prev,
      [trainingDate]: `${selected.student} – ${selected.training}`,
    }));

    setTrainingDate("");
    setTrainingTime("");
    setModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 py-6 mx-auto max-w-screen-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        📋 Training Requests
      </h2>

      {/* Request Cards */}
      <div className="space-y-6 mb-12">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white p-6 rounded-lg shadow flex flex-col sm:flex-row sm:justify-between gap-4"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                <FaUserGraduate className="text-blue-600" />
                {req.student}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FaEnvelope /> {req.email}
              </p>
              <p className="text-sm text-gray-600">
                🧑‍🏫 Training: <span className="font-medium">{req.training}</span>
              </p>
              <p className="text-sm text-gray-600">
                🎓 Category: <span className="font-medium">{req.category}</span>
              </p>
              <a
                href={req.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 underline"
              >
                <FaFileAlt /> View Resume
              </a>
              <p className="text-sm mt-1">
                {req.scheduled ? (
                  <span className="text-green-600 font-medium">
                    ✅ Scheduled: {new Date(req.scheduled).toLocaleString()}
                  </span>
                ) : (
                  <span className="text-yellow-600 font-medium">
                    ⚠️ Not Scheduled
                  </span>
                )}
              </p>
            </div>

            {!req.scheduled && (
              <button
                onClick={() => openModal(req)}
                className="self-start sm:self-center bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded font-medium"
              >
                Approve & Schedule
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-white p-8 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-6 text-gray-700">
          🗓️ Scheduled Training Calendar
        </h3>

        <div className="w-full overflow-x-auto">
          <Calendar
            className="!w-full max-w-full custom-calendar border rounded-xl p-4"
            tileContent={({ date }) => {
              const key = date.toISOString().split("T")[0];
              return notes[key] ? (
                <div className="text-[10px] text-blue-600 mt-1 font-medium truncate max-w-[6rem]">
                  📌 {notes[key]}
                </div>
              ) : null;
            }}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Schedule Training"
        className="bg-white max-w-md mx-auto p-8 rounded-xl shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-6">📅 Schedule Training</h2>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Date</span>
          <input
            type="date"
            value={trainingDate}
            min={todayISO}
            onChange={(e) => setTrainingDate(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium text-gray-700">Time</span>
          <input
            type="time"
            value={trainingTime}
            onChange={(e) => setTrainingTime(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TrainingRequestTab;
