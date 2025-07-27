import React, { useState } from "react";
// import your API data fetching hook here

// Dummy event data (replace with API)
const eventData = [
  {
    date: "2025-07-02",
    time: "7:00pm",
    label: "Faculty Assessment",
    color: "pink",
    type: "month",
  },
  {
    date: "2025-07-03",
    time: "7:00pm",
    label: "[VIVA] Faculty Assessment",
    color: "pink",
    type: "month",
  },
  {
    date: "2025-07-27",
    time: "7:00am",
    label: "TDS on Other than Salary",
    color: "blue",
    type: "week",
  },
  {
    date: "2025-07-28",
    time: "7:00am",
    label: "Job Readiness Program",
    color: "red",
    type: "week",
    badge: "New",
  },
  {
    date: "2025-07-29",
    time: "7:00am",
    label: "GST Basics",
    color: "blue",
    type: "week",
    badge: "New",
  },
  // ...add more demo events for each view type
];

const VIEWS = ["month", "week", "day", "list"];

const formatDate = (date) => {
  // "2025-07-28" => {day: 28, weekday: "Monday"}
  const d = new Date(date);
  return {
    day: d.getDate(),
    weekday: d.toLocaleString("en-US", { weekday: "long" }),
    dateStr: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
};

export default function CalendarTab() {
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date("2025-07-27"));

  // Here, replace with API call and filter to current month/week/day/list based on UI state
  const events = eventData;

  // Month grid: just render dummy rows, highlight event dates with colored text and "New" badge
  const renderMonthView = () => (
    <div className="w-full bg-white rounded shadow border mt-3 overflow-x-auto">
      <div className="py-6 text-center text-3xl font-semibold">July 2025</div>
      <div className="grid grid-cols-7 border-b bg-gray-50 text-blue-900 font-bold">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div className="py-2 text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-xs" style={{ minHeight: 400 }}>
        {Array(35)
          .fill()
          .map((_, i) => {
            // Assume July starts on Tue, so offset
            const offset = 2;
            const day = i - offset + 1;
            const cellDate =
              day > 0 && day <= 31
                ? `2025-07-${String(day).padStart(2, "0")}`
                : null;
            const dayEvents = cellDate
              ? events.filter((e) => e.date === cellDate && e.type === "month")
              : [];
            return (
              <div
                className={`border p-2 h-20 relative ${
                  i % 7 === 0 ? "bg-gray-50" : ""
                }`}
              >
                {day > 0 && day <= 31 && (
                  <>
                    <div className="font-semibold text-blue-900">{day}</div>
                    <div className="space-y-1">
                      {dayEvents.map((e, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <span
                            className={`inline-block w-2 h-2 rounded-full`}
                            style={{ background: e.color }}
                          />
                          <span
                            className={`text-xs font-semibold ${
                              e.color === "red"
                                ? "text-red-600"
                                : "text-blue-700"
                            }`}
                          >
                            {e.label}
                          </span>
                          {e.badge && (
                            <span className="ml-1 px-1 rounded bg-red-500 text-white text-[10px]">
                              {e.badge}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );

  // Week view: time columns, events as blocks
  const renderWeekView = () => (
    <div className="w-full bg-white rounded shadow border mt-3 overflow-x-auto">
      <div className="py-6 text-center text-2xl font-semibold">
        Jul 27 – Aug 2, 2025
      </div>
      <div className="grid grid-cols-8 border-b bg-gray-50 text-blue-900 font-bold">
        <div className="py-2 text-center"></div>
        {[
          "Sun 7/27",
          "Mon 7/28",
          "Tue 7/29",
          "Wed 7/30",
          "Thu 7/31",
          "Fri 8/1",
          "Sat 8/2",
        ].map((d) => (
          <div className="py-2 text-center">{d}</div>
        ))}
      </div>
      {/* time slots 6am - 2pm */}
      <div>
        {Array(9)
          .fill()
          .map((_, i) => (
            <div className="grid grid-cols-8 border-b h-12" key={i}>
              <div className="bg-yellow-100 border-r text-xs text-center pt-2">
                {6 + i}am
              </div>
              {Array(7)
                .fill()
                .map((__, j) => {
                  // For demo, show events at 7am in the right slot
                  const thisDay = new Date("2025-07-27");
                  thisDay.setDate(thisDay.getDate() + j);
                  const cellDate = thisDay.toISOString().slice(0, 10);
                  const slotTime = `${6 + i}:00am`;
                  const cellEvents = events.filter(
                    (e) => e.date === cellDate && e.time.startsWith(`${6 + i}`)
                  );
                  return (
                    <div className="relative" key={j}>
                      {cellEvents.map((e, idx) => (
                        <div
                          className={`absolute top-1 left-1 right-1 px-2 py-1 rounded text-white text-xs font-semibold ${
                            e.color === "red" ? "bg-red-500" : "bg-blue-600"
                          }`}
                          style={{ zIndex: 1 }}
                          key={idx}
                        >
                          {e.badge && (
                            <span className="inline-block bg-red-500 rounded px-1 mr-1 text-white text-[10px]">
                              {e.badge}
                            </span>
                          )}
                          {e.label}
                        </div>
                      ))}
                    </div>
                  );
                })}
            </div>
          ))}
      </div>
    </div>
  );

  // Day view: just one column, all time slots
  const renderDayView = () => (
    <div className="w-full bg-white rounded shadow border mt-3 overflow-x-auto">
      <div className="py-6 text-center text-2xl font-semibold">
        July 27, 2025
      </div>
      <div className="grid grid-cols-2 border-b bg-gray-50 text-blue-900 font-bold">
        <div className="py-2 text-center">all-day</div>
        <div className="py-2 text-center text-blue-700 font-bold">Sunday</div>
      </div>
      {Array(9)
        .fill()
        .map((_, i) => (
          <div className="grid grid-cols-2 border-b h-12" key={i}>
            <div className="bg-yellow-100 border-r text-xs text-center pt-2">
              {6 + i}am
            </div>
            <div className="relative"></div>
          </div>
        ))}
    </div>
  );

  // List view: events grouped by date, all details
  const renderListView = () => {
    // Example grouped events (you’d group by date in real data)
    const days = [
      {
        date: "Monday",
        full: "July 28, 2025",
        items: [
          { time: "7:00am", label: "TDS on Other than Salary", color: "blue" },
          { time: "7:00pm", label: "Appointment Procedure", color: "blue" },
          {
            time: "7:00pm",
            label: "Income Tax Computation of a Business Entity",
            color: "blue",
          },
        ],
      },
      {
        date: "Tuesday",
        full: "July 29, 2025",
        items: [
          { time: "7:00am", label: "Job Readiness Program", color: "red" },
          {
            time: "7:00pm",
            label: "Income Tax Computation of a Business Entity",
            color: "blue",
          },
          { time: "7:00pm", label: "Preparation of Payroll", color: "blue" },
        ],
      },
      {
        date: "Wednesday",
        full: "July 30, 2025",
        items: [
          { time: "7:00am", label: "Job Readiness Program", color: "red" },
          {
            time: "7:00pm",
            label: "Income Tax Computation of a Business Entity",
            color: "blue",
          },
          { time: "7:00pm", label: "Preparation of Payroll", color: "blue" },
        ],
      },
      {
        date: "Thursday",
        full: "July 31, 2025",
        items: [
          { time: "7:00am", label: "Job Readiness Program", color: "red" },
          {
            time: "7:00pm",
            label: "Income Tax Computation of a Business Entity",
            color: "blue",
          },
          { time: "7:00pm", label: "Preparation of Payroll", color: "blue" },
        ],
      },
      {
        date: "Friday",
        full: "August 01, 2025",
        items: [
          { time: "7:00am", label: "Job Readiness Program", color: "red" },
          {
            time: "7:00pm",
            label: "Income Tax Computation of a Business Entity",
            color: "blue",
          },
          { time: "7:00pm", label: "Preparation of Payroll", color: "blue" },
        ],
      },
      {
        date: "Saturday",
        full: "August 02, 2025",
        items: [
          { time: "7:00am", label: "Job Readiness Program", color: "red" },
          {
            time: "7:00pm",
            label: "Income Tax Computation of a Business Entity",
            color: "blue",
          },
          { time: "7:00pm", label: "Preparation of Payroll", color: "blue" },
        ],
      },
      {
        date: "Sunday",
        full: "August 03, 2025",
        items: [
          { time: "7:00am", label: "Job Readiness Program", color: "red" },
          {
            time: "7:00pm",
            label: "Income Tax Computation of a Business Entity",
            color: "blue",
          },
          { time: "7:00pm", label: "Preparation of Payroll", color: "blue" },
        ],
      },
      // ...repeat for all week days
    ];
    return (
      <div className="w-full bg-white rounded shadow border mt-3 overflow-x-auto">
        <div className="py-6 text-center text-2xl font-semibold">
          Jul 27 – Aug 2, 2025
        </div>
        <div>
          {days.map((d, idx) => (
            <div key={idx} className="mb-6">
              <div className="text-blue-900 font-bold text-lg border-b pb-1 mb-2 flex justify-between">
                {d.date}
                <span className="text-blue-700">{d.full}</span>
              </div>
              {d.items.map((e, i) => (
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full`}
                    style={{ background: e.color }}
                  />
                  <span className="text-xs text-gray-800">{e.time}</span>
                  <span
                    className={`font-semibold ${
                      e.color === "red" ? "text-red-600" : "text-blue-700"
                    }`}
                  >
                    {e.label}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ---- Main render ----
  return (
    <div className="flex-1 min-h-screen bg-gray-100 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-blue-700 font-bold text-2xl">Calendar</span>
          <span className="ml-2 text-blue-600 text-xl cursor-pointer">🔗</span>
        </div>
        <div className="flex gap-2 items-center">
          <button className="bg-blue-500 text-white px-4 py-2 rounded font-semibold">
            ADD NEW EVENT
          </button>
          <span className="font-semibold text-blue-700">GNAAGBN</span>
        </div>
      </div>

      {/* View controls */}
      <div className="flex gap-2 mb-2">
        <button className="bg-gray-200 text-gray-800 rounded px-4 py-1">
          {"<"}
        </button>
        <button className="bg-gray-400 text-white rounded px-4 py-1 font-semibold">
          today
        </button>
        <div className="flex-1"></div>
        {VIEWS.map((v) => (
          <button
            key={v}
            onClick={() => setCurrentView(v)}
            className={`px-4 py-1 rounded font-bold text-sm ${
              currentView === v
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-800"
            } ml-2`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Main calendar */}
      {currentView === "month" && renderMonthView()}
      {currentView === "week" && renderWeekView()}
      {currentView === "day" && renderDayView()}
      {currentView === "list" && renderListView()}
    </div>
  );
}
