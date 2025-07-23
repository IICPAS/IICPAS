"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  UserPlus,
  Mail,
  Smartphone,
  MessageCircle,
  List as ListIcon,
  PlusCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// BASIC COMPONENTS
const Button = ({ className = "", children, ...props }) => (
  <button
    className={
      "px-4 py-2 rounded-xl font-semibold focus:outline-none transition-all " +
      className
    }
    {...props}
  >
    {children}
  </button>
);

const Input = React.forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={
      "peer block w-full p-4 pt-6 rounded-xl border border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-500 transition-all " +
      className
    }
    {...props}
  />
));
Input.displayName = "Input";

const Label = ({ htmlFor, floating, active, className = "", children }) => (
  <label
    htmlFor={htmlFor}
    className={`
      absolute left-4 bg-white px-1 rounded pointer-events-none transition-all
      text-gray-500
      ${
        floating
          ? "peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs"
          : ""
      }
      ${active ? "-top-2 text-xs" : "top-4 text-base"}
      ${className}
    `}
  >
    {children}
  </label>
);

const getWhatsAppLink = (phone) => `https://wa.me/${phone.replace(/\D/g, "")}`;

const initialState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  location: "",
  course: "",
  teacher: "",
};

function AddStudentForm({ onSuccess }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_BASE + "/student/register",
        form,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSuccess("Student registered successfully!");
      setForm(initialState);
      if (onSuccess) onSuccess(res.data.student);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong"
      );
    }
    setLoading(false);
  };

  return (
    <motion.div
      key="add"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full"
    >
      <div className="backdrop-blur-xl bg-white/70 border border-indigo-100 shadow-2xl rounded-2xl w-full">
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <UserPlus className="text-indigo-500" size={26} />
            <h2 className="text-xl font-bold tracking-tight">Add Student</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Name", name: "name", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Phone", name: "phone", type: "tel" },
              { label: "Password", name: "password", type: "password" },
              { label: "Location", name: "location", type: "text" },
              { label: "Course", name: "course", type: "text" },
              { label: "Teacher", name: "teacher", type: "text" },
            ].map((field) => (
              <div key={field.name} className="relative">
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder=" "
                  required
                  autoComplete="off"
                  value={form[field.name]}
                  onChange={handleChange}
                  disabled={loading}
                />
                <Label
                  htmlFor={field.name}
                  floating
                  active={!!form[field.name]}
                >
                  {field.label}
                </Label>
              </div>
            ))}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm rounded p-2 bg-red-50 border border-red-100"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-600 text-sm rounded p-2 bg-green-50 border border-green-100"
              >
                {success}
              </motion.div>
            )}
            <Button
              type="submit"
              className="w-full rounded-2xl text-lg font-semibold gap-2 bg-gradient-to-r from-indigo-500 to-sky-400 hover:from-indigo-600 hover:to-blue-500 text-white shadow-md flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Adding...
                </>
              ) : (
                <>Add Student</>
              )}
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

function StudentsTable({ students }) {
  if (!students?.length)
    return (
      <div className="text-gray-500 text-center py-12">
        No students registered yet.
      </div>
    );

  return (
    <motion.div
      key="list"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="overflow-x-auto"
    >
      <div className="backdrop-blur-xl bg-white/80 border border-indigo-100 shadow-xl rounded-2xl mt-2">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-indigo-700">
            Registered Students
          </h3>
          <table className="min-w-full text-left text-base">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Teacher</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Contact</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="hover:bg-indigo-50/30 transition">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3">{s.course}</td>
                  <td className="px-4 py-3">{s.teacher}</td>
                  <td className="px-4 py-3">{s.location}</td>
                  <td className="px-4 py-3 flex gap-3 items-center">
                    <a
                      href={`mailto:${s.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Send Email"
                      className="text-indigo-500 hover:text-indigo-700"
                    >
                      <Mail size={20} />
                    </a>
                    <a
                      href={getWhatsAppLink(s.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="WhatsApp"
                      className="text-green-500 hover:text-green-700"
                    >
                      <MessageCircle size={20} />
                    </a>
                    <a
                      href={`tel:${s.phone}`}
                      title="Call Mobile"
                      className="text-sky-500 hover:text-sky-700"
                    >
                      <Smartphone size={20} />
                    </a>
                    <span className="text-gray-800 text-xs ml-2">
                      {s.phone}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default function StudentsTab() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("add"); // "add" or "list"

  useEffect(() => {
    if (activeTab === "list") {
      setLoading(true);
      axios
        .get(process.env.NEXT_PUBLIC_API_BASE + "/student")
        .then((res) => setStudents(res.data.students || []))
        .catch(() => setStudents([]))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  const handleStudentAdded = () => {
    setActiveTab("list");
    setLoading(true);
    axios
      .get(process.env.NEXT_PUBLIC_API_BASE + "/student")
      .then((res) => setStudents(res.data.students || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 min-h-screen">
      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <Button
          onClick={() => setActiveTab("add")}
          className={`flex items-center gap-2 ${
            activeTab === "add"
              ? "bg-indigo-500 text-white shadow"
              : "bg-white text-indigo-700 border border-indigo-200"
          }`}
        >
          <PlusCircle size={18} />
          Add Student
        </Button>
        <Button
          onClick={() => setActiveTab("list")}
          className={`flex items-center gap-2 ${
            activeTab === "list"
              ? "bg-indigo-500 text-white shadow"
              : "bg-white text-indigo-700 border border-indigo-200"
          }`}
        >
          <ListIcon size={18} />
          View Students
        </Button>
      </div>
      {/* Tab panels */}
      <div className="min-h-[450px]">
        <AnimatePresence mode="wait">
          {activeTab === "add" && (
            <AddStudentForm key="addform" onSuccess={handleStudentAdded} />
          )}
          {activeTab === "list" &&
            (loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-64"
              >
                <Loader2 className="animate-spin text-indigo-500" size={36} />
              </motion.div>
            ) : (
              <StudentsTable key="studentstable" students={students} />
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
