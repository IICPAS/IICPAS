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
        process.env.NEXT_PUBLIC_API_BASE + "/v1/students/register",
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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <UserPlus className="text-indigo-500" size={28} />
          <h2 className="text-2xl font-bold tracking-tight text-gray-800">Add New Student</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Full Name", name: "name", type: "text" },
              { label: "Email Address", name: "email", type: "email" },
              { label: "Phone Number", name: "phone", type: "tel" },
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
                  className="w-full"
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
          </div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm rounded-lg p-4 bg-red-50 border border-red-200"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600 text-sm rounded-lg p-4 bg-green-50 border border-green-200"
            >
              {success}
            </motion.div>
          )}
          
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="px-8 py-3 rounded-xl text-lg font-semibold gap-2 bg-gradient-to-r from-indigo-500 to-sky-400 hover:from-indigo-600 hover:to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Adding Student...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Add Student
                </>
              )}
            </Button>
          </div>
        </form>
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
      className="w-full"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Registered Students
            </h2>
            <p className="text-gray-600 mt-1">
              Total: {students.length} students enrolled
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Last updated</div>
            <div className="text-sm font-medium text-gray-700">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
        
        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {students.map((student) => (
            <div
              key={student._id}
              className="bg-gradient-to-br from-white to-indigo-50 border border-indigo-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Student Header */}
              <div className="mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                    {student.name?.charAt(0)?.toUpperCase() || 'S'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-800 text-lg truncate">
                      {student.name}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">{student.email}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.mode === 'online' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {student.mode || 'Not specified'}
                  </span>
                </div>
              </div>

              {/* Student Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Smartphone size={16} className="text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{student.phone}</span>
                </div>
                
                {student.location && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 text-gray-500 flex-shrink-0">📍</div>
                    <span className="text-sm text-gray-700">{student.location}</span>
                  </div>
                )}
                
                {student.center && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 text-gray-500 flex-shrink-0">🏢</div>
                    <span className="text-sm text-gray-700">{student.center}</span>
                  </div>
                )}
              </div>

              {/* Enrolled Courses */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Enrolled Courses:</h5>
                {student.course && student.course.length > 0 ? (
                  <div className="space-y-1">
                    {student.course.slice(0, 3).map((course, index) => (
                      <div key={index} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                        {course.title || course}
                      </div>
                    ))}
                    {student.course.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{student.course.length - 3} more courses
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">No courses enrolled</div>
                )}
              </div>

              {/* Live Sessions */}
              {student.enrolledLiveSessions && student.enrolledLiveSessions.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Live Sessions:</h5>
                  <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    {student.enrolledLiveSessions.length} session(s) enrolled
                  </div>
                </div>
              )}

              {/* Contact Actions */}
              <div className="flex space-x-2 pt-3 border-t border-gray-200">
                <a
                  href={`mailto:${student.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Send Email"
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
                >
                  <Mail size={14} />
                  <span>Email</span>
                </a>
                <a
                  href={getWhatsAppLink(student.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WhatsApp"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${student.phone}`}
                  title="Call"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
                >
                  <Smartphone size={14} />
                  <span>Call</span>
                </a>
              </div>

              {/* Registration Date */}
              <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
                Registered: {new Date(student.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
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
        .get(process.env.NEXT_PUBLIC_API_BASE + "/v1/students")
        .then((res) => setStudents(res.data.students || []))
        .catch((err) => {
          console.error("Error fetching students:", err);
          setStudents([]);
        })
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  const handleStudentAdded = () => {
    setActiveTab("list");
    setLoading(true);
    axios
      .get(process.env.NEXT_PUBLIC_API_BASE + "/v1/students")
      .then((res) => setStudents(res.data.students || []))
      .catch((err) => {
        console.error("Error fetching students:", err);
        setStudents([]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full px-4 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Management</h1>
        <p className="text-gray-600">Manage and view all enrolled students</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <Button
          onClick={() => setActiveTab("add")}
          className={`flex items-center gap-2 px-6 py-3 ${
            activeTab === "add"
              ? "bg-indigo-500 text-white shadow-lg"
              : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
          }`}
        >
          <PlusCircle size={18} />
          Add Student
        </Button>
        <Button
          onClick={() => setActiveTab("list")}
          className={`flex items-center gap-2 px-6 py-3 ${
            activeTab === "list"
              ? "bg-indigo-500 text-white shadow-lg"
              : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
          }`}
        >
          <ListIcon size={18} />
          View Students
        </Button>
      </div>

      {/* Tab panels */}
      <div className="w-full">
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
