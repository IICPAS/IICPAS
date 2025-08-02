import React, { useState, useEffect } from "react";

const EVENTS = [
  { date: "2025-08-01", time: "7a", title: "GST Invoice preparation" },
  { date: "2025-08-01", time: "7p", title: "Payroll in TallyPrime" },
  { date: "2025-08-03", time: "7a", title: "GST Invoice preparation" },
  { date: "2025-08-04", time: "7a", title: "Debit Note & Credit Note" },
  { date: "2025-08-05", time: "7a", title: "E-Way Bill", isNew: true },
  { date: "2025-08-07", time: "7a", title: "Concept of RCM, TDS" },
  { date: "2025-08-13", time: "7a", title: "GST Return Filing", isNew: true },
  { date: "2025-08-14", time: "7a", title: "GST Return Filing", isNew: true },
  { date: "2025-08-21", time: "7p", title: "TDS on Salary", isNew: true },
  { date: "2025-08-28", time: "7a", title: "Basic Accounting", isNew: true },
  // Add more events as needed
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevMonthLastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const daysInPrevMonth = prevMonthLastDay.getDate();
  const startDay = firstDay.getDay();
  const matrix = [];
  let day = 1;
  let nextMonthDay = 1;
  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < startDay) {
        week.push({
          day: daysInPrevMonth - startDay + j + 1,
          isCurrentMonth: false,
          date: new Date(year, month - 1, daysInPrevMonth - startDay + j + 1),
        });
      } else if (day > daysInMonth) {
        week.push({
          day: nextMonthDay,
          isCurrentMonth: false,
          date: new Date(year, month + 1, nextMonthDay++),
        });
      } else {
        week.push({
          day,
          isCurrentMonth: true,
          date: new Date(year, month, day++),
        });
      }
    }
    matrix.push(week);
    if (day > daysInMonth && nextMonthDay > 7) break;
  }
  return matrix;
}

export default function CustomCalendar() {
  const [current, setCurrent] = useState(new Date(2025, 7, 1)); // August 2025
  const [today] = useState(new Date());

  const year = current.getFullYear();
  const month = current.getMonth();
  const matrix = getMonthMatrix(year, month);

  useEffect(() => {
    // Notification if today has an event
    const todayStr = today.toISOString().slice(0, 10);
    const hasEvent = EVENTS.some((e) => e.date === todayStr);
    if (hasEvent) {
      setTimeout(() => {
        alert("You have an event today!");
      }, 500);
    }
  }, [today]);

  const handlePrev = () => {
    setCurrent(new Date(year, month - 1, 1));
  };
  const handleNext = () => {
    setCurrent(new Date(year, month + 1, 1));
  };

  return (
    <div className="custom-calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrev} className="nav-btn">
          &#8592;
        </button>
        <h2>
          {current.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button onClick={handleNext} className="nav-btn">
          &#8594;
        </button>
      </div>
      <div className="calendar-grid">
        {WEEKDAYS.map((d) => (
          <div key={d} className="weekday">
            {d}
          </div>
        ))}
        {matrix.flat().map((cell, idx) => {
          const dateStr = cell.date.toISOString().slice(0, 10);
          const events = EVENTS.filter((e) => e.date === dateStr);
          const isToday =
            cell.isCurrentMonth &&
            cell.date.toDateString() === today.toDateString();
          return (
            <div
              key={idx}
              className={`calendar-cell${
                cell.isCurrentMonth ? "" : " not-current"
              }${isToday ? " today" : ""}`}
            >
              <div className="cell-date">{cell.day}</div>
              <div className="cell-events-text">
                {events.map((ev, i) => (
                  <div key={i} className="event-text-line">
                    <span className="event-dot">●</span>
                    <span className="event-time">{ev.time}</span>
                    {ev.isNew && <span className="event-new-text">New</span>}
                    <span className="event-title-text">{ev.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .custom-calendar-container {
          max-width: 950px;
          margin: 40px auto;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 32px #0001;
          padding: 32px 18px 24px 18px;
        }
        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin-bottom: 18px;
        }
        .calendar-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e40af;
          margin: 0 18px;
        }
        .nav-btn {
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 1.3rem;
          padding: 6px 16px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .nav-btn:hover {
          background: #1e40af;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .weekday {
          font-weight: 700;
          color: #2563eb;
          text-align: center;
          padding: 8px 0 10px 0;
          background: #f1f5ff;
          border-radius: 8px;
          font-size: 1.1rem;
        }
        .calendar-cell {
          min-height: 90px;
          background: #f8fafc;
          border-radius: 10px;
          box-shadow: 0 1px 4px #2563eb11;
          padding: 7px 6px 4px 6px;
          position: relative;
          font-size: 1.05rem;
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
        }
        .calendar-cell.not-current {
          background: #f3f4f6;
          color: #b6b6b6;
          opacity: 0.7;
        }
        .calendar-cell.today {
          border: 2px solid #2563eb;
          box-shadow: 0 0 0 2px #60a5fa33;
        }
        .cell-date {
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2px;
        }
        .cell-events-text {
          margin-top: 2px;
        }
        .event-text-line {
          display: flex;
          align-items: center;
          font-size: 0.98em;
          font-weight: 500;
          margin-bottom: 2px;
          gap: 4px;
        }
        .event-dot {
          color: #2563eb;
          font-size: 1.1em;
          margin-right: 2px;
        }
        .event-time {
          font-weight: 700;
          color: #2563eb;
          margin-right: 2px;
        }
        .event-new-text {
          background: #ef4444;
          color: #fff;
          font-size: 0.8em;
          font-weight: 700;
          border-radius: 4px;
          padding: 1px 6px;
          margin-right: 4px;
          margin-left: 2px;
          letter-spacing: 0.5px;
        }
        .event-title-text {
          color: #1e293b;
          margin-left: 2px;
        }
        @media (max-width: 900px) {
          .custom-calendar-container {
            padding: 10px 2px 18px 2px;
          }
          .calendar-header h2 {
            font-size: 1.2rem;
          }
          .calendar-cell {
            min-height: 60px;
            font-size: 0.95rem;
          }
        }
        @media (max-width: 600px) {
          .custom-calendar-container {
            padding: 2px 0 8px 0;
          }
          .calendar-header h2 {
            font-size: 1rem;
          }
          .calendar-cell {
            min-height: 38px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
