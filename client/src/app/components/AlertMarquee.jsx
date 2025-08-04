"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Marquee from "react-fast-marquee";

const AlertMarquee = ({ showMarquee: externalShowMarquee }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMarquee, setShowMarquee] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  useEffect(() => {
    if (externalShowMarquee !== undefined) {
      setShowMarquee(externalShowMarquee);
    }
  }, [externalShowMarquee]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 60) {
        setShowMarquee(false);
      } else {
        setShowMarquee(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (alerts.length === 0) {
    return null; // Don't show marquee if no active alerts
  }

  return (
    <div
      className={`bg-green-600 text-white font-bold border-b border-yellow-200 fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        showMarquee ? "translate-y-0" : "-translate-y-full"
      }`}
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
