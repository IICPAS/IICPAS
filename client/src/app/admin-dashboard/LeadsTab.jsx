"use client";

import { useEffect, useState } from "react";
import { FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const API = process.env.NEXT_PUBLIC_API_BASE + "/leads";

const SOURCE_OPTIONS = [
  "enquiries",
  "JustDial",
  "IndiaMart",
  "Facebook",
  "Instagram",
  "LinkedIn",
  "GoogleAds",
  "Referral",
  "Walk-in",
  "Website",
  "Email",
  "Cold Call",
];

export default function LeadsTab() {
  const [leads, setLeads] = useState([]);
  const [sourceFilter, setSourceFilter] = useState("enquiries");

  const fetchLeads = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      const filtered = data.leads.filter((lead) => lead.type === sourceFilter);
      setLeads(filtered);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [sourceFilter]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header + Filter */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-3">
        <h2 className="text-3xl font-bold text-gray-800">📋 Leads</h2>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
        >
          {SOURCE_OPTIONS.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="text-left px-4 py-3 border-b">Name</th>
              <th className="text-left px-4 py-3 border-b">Phone</th>
              <th className="text-left px-4 py-3 border-b">Email</th>
              <th className="text-left px-4 py-3 border-b">Message</th>
              <th className="text-left px-4 py-3 border-b">Source</th>
              <th className="text-left px-4 py-3 border-b">Date</th>
              <th className="text-left px-4 py-3 border-b">Contact</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {leads.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-4 italic text-gray-500"
                >
                  No leads found.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{lead.name}</td>
                  <td className="px-4 py-3 border-b">{lead.phone}</td>
                  <td className="px-4 py-3 border-b">{lead.email}</td>
                  <td className="px-4 py-3 border-b max-w-xs truncate">
                    {lead.message || "-"}
                  </td>
                  <td className="px-4 py-3 border-b capitalize">{lead.type}</td>
                  <td className="px-4 py-3 border-b">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex gap-3 text-blue-600">
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          title="Email"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FiMail className="text-lg hover:text-blue-800 transition-colors" />
                        </a>
                      )}
                      {lead.phone && (
                        <a
                          href={`https://wa.me/${lead.phone.replace(
                            /\D/g,
                            ""
                          )}`}
                          title="WhatsApp"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaWhatsapp className="text-lg hover:text-green-600 transition-colors" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
