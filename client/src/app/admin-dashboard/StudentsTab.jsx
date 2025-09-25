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
  Download,
  Edit,
  Trash2,
  UserX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';

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

function StudentsTable({ students, onStudentUpdated }) {
  if (!students?.length)
    return (
      <div className="text-gray-500 text-center py-12">
        No students registered yet.
      </div>
    );

  // Handle edit student
  const handleEditStudent = (student) => {
    // For now, show a toast - you can implement edit modal/form later
    toast.success(`Edit functionality for ${student.name} - Coming soon!`);
  };

  // Handle delete student
  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE}/v1/students/${student._id}`);
        toast.success(`${student.name} has been deleted successfully!`);
        if (onStudentUpdated) onStudentUpdated();
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("Failed to delete student");
      }
    }
  };

  // Handle suspend student
  const handleSuspendStudent = async (student) => {
    const action = student.status === 'suspended' ? 'unsuspend' : 'suspend';
    const actionText = student.status === 'suspended' ? 'Unsuspend' : 'Suspend';
    
    if (window.confirm(`Are you sure you want to ${action} ${student.name}?`)) {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_API_BASE}/v1/students/${student._id}/status`, {
          status: student.status === 'suspended' ? 'active' : 'suspended'
        });
        toast.success(`${student.name} has been ${action}ed successfully!`);
        if (onStudentUpdated) onStudentUpdated();
      } catch (error) {
        console.error(`Error ${action}ing student:`, error);
        toast.error(`Failed to ${action} student`);
      }
    }
  };

  // Export students to Excel
  const exportToExcel = () => {
    if (students.length === 0) {
      toast.error("No students to export");
      return;
    }

    try {
      // Prepare data for Excel export
      const excelData = students.map((student, index) => ({
        'S.No': index + 1,
        'Name': student.name || '',
        'Email': student.email || '',
        'Phone': student.phone || '',
        'Location': student.location || '',
        'Center': student.center || '',
        'Status': student.mode || 'Not specified',
        'Courses': student.course && student.course.length > 0 
          ? student.course.map(course => course.title || course).join(', ') 
          : 'No courses',
        'Live Sessions': student.enrolledLiveSessions && student.enrolledLiveSessions.length > 0 
          ? `${student.enrolledLiveSessions.length} session(s)` 
          : 'No sessions',
        'Registered Date': student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '',
        'Registered Time': student.createdAt ? new Date(student.createdAt).toLocaleTimeString() : '',
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = [
        { wch: 8 },   // S.No
        { wch: 20 },  // Name
        { wch: 30 },  // Email
        { wch: 15 },  // Phone
        { wch: 20 },  // Location
        { wch: 20 },  // Center
        { wch: 12 },  // Status
        { wch: 40 },  // Courses
        { wch: 20 },  // Live Sessions
        { wch: 15 },  // Registered Date
        { wch: 15 },  // Registered Time
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Students');

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `students_export_${currentDate}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      toast.success(`${students.length} students exported to Excel successfully!`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export students to Excel");
    }
  };

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
          <div className="flex items-center">
            <Button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <Download size={16} />
              Export Excel
            </Button>
          </div>
        </div>
        
        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0 mr-3">
                        {student.name?.charAt(0)?.toUpperCase() || 'S'}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {student.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.location}
                      {student.center && (
                        <div className="text-xs text-gray-500">{student.center}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.mode === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {student.mode || 'Not specified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.course && student.course.length > 0 ? (
                        <div className="space-y-1">
                          {student.course.slice(0, 2).map((course, index) => (
                            <div key={index} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                              {course.title || course}
                            </div>
                          ))}
                          {student.course.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{student.course.length - 2} more
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No courses</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-wrap gap-1">
                      {/* Contact Actions */}
                      <a
                        href={`mailto:${student.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Send Email"
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded text-xs transition-colors flex items-center space-x-1"
                      >
                        <Mail size={10} />
                        <span>Email</span>
                      </a>
                      <a
                        href={getWhatsAppLink(student.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="WhatsApp"
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transition-colors flex items-center space-x-1"
                      >
                        <MessageCircle size={10} />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${student.phone}`}
                        title="Call"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors flex items-center space-x-1"
                      >
                        <Smartphone size={10} />
                        <span>Call</span>
                      </a>
                      
                      {/* Management Actions */}
                      <button
                        onClick={() => handleEditStudent(student)}
                        title="Edit Student"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs transition-colors flex items-center space-x-1"
                      >
                        <Edit size={10} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleSuspendStudent(student)}
                        title={student.status === 'suspended' ? 'Unsuspend Student' : 'Suspend Student'}
                        className={`px-2 py-1 rounded text-xs transition-colors flex items-center space-x-1 ${
                          student.status === 'suspended' 
                            ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                      >
                        <UserX size={10} />
                        <span>{student.status === 'suspended' ? 'Unsuspend' : 'Suspend'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student)}
                        title="Delete Student"
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors flex items-center space-x-1"
                      >
                        <Trash2 size={10} />
                        <span>Delete</span>
                      </button>
                    </div>
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
              <StudentsTable key="studentstable" students={students} onStudentUpdated={handleStudentAdded} />
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
