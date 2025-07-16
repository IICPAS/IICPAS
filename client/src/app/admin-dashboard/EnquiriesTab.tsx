"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope, FaPhoneAlt, FaUser } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface ContactEntry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export default function EnquiriesTab() {
  const [enquiries, setEnquiries] = useState<ContactEntry[]>([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/contact`);
        setEnquiries(res.data);
      } catch (err) {
        toast.error("Failed to fetch enquiries");
      }
    };

    fetchEnquiries();
  }, [API_BASE_URL]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Contact Enquiries</h2>
      {enquiries.length === 0 ? (
        <p className="text-gray-500">No enquiries found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enquiries.map((entry) => (
            <div
              key={entry._id}
              className="bg-white shadow-md rounded-xl p-5 border border-gray-100"
            >
              <div className="mb-2 flex items-center gap-2 text-blue-600 font-semibold">
                <FaUser />
                {entry.name}
              </div>
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-700">
                <FaEnvelope />
                {entry.email}
              </div>
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-700">
                <FaPhoneAlt />
                {entry.phone}
              </div>
              <p className="text-gray-800 mt-3 text-sm">{entry.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                Submitted on {new Date(entry.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
