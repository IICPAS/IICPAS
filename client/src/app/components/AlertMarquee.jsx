"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Marquee from "react-fast-marquee";

const AlertMarquee = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(`${API}/api/alerts`);
        // Filter only active alerts
        const activeAlerts = response.data.filter(
          (alert) => alert.status === "active"
        );
        setAlerts(activeAlerts);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [API]);


  // Removed scroll-based hiding - marquee will always stay visible

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (alerts.length === 0) {
    return null; // Don't show marquee if no active alerts
  }

  return (
    <div
      className="bg-green-600 text-white font-bold border-b border-yellow-200 fixed top-0 left-0 w-full z-50"
      style={{ "--marquee-height": "40px" }}
    >
      <Marquee speed={80} gradient={false} className="py-2 overflow-hidden">
        {alerts.map((alert, index) => (
          <div key={alert._id} className="inline-block mx-8">
            <span className="text-white font-medium text-sm">
              📢 {alert.title}: {alert.message}
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default AlertMarquee;
