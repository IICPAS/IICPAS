"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Header from "../../components/Header";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function CourseDetailPage() {
  const { slug } = useParams();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("syllabus");
  const [student, setStudent] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const locationOptions = [{ label: "Greater Noida", value: "Greater Noida" }];
  const modeOptions = [
    { label: "Online", value: "Online" },
    { label: "Offline", value: "Offline" },
  ];
  const centerOptions = [{ label: "Greater Noida", value: "Greater Noida" }];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    mode: "Online",
    location: "Greater Noida",
    center: "Greater Noida",
  });

  const clearFormData = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      mode: "Online",
      location: "Greater Noida",
      center: "Greater Noida",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Fetch course
  useEffect(() => {
    const title = slug.replace(/_/g, " ");
    axios.get(`${API}/api/courses`).then((res) => {
      const courses = res.data.courses || res.data;
      const match = courses.find((c) => c.title === title);
      setCourse(match);
    });
  }, [slug]);

  // Check student login
  useEffect(() => {
    axios
      .get(`${API}/api/v1/students/isstudent`, { withCredentials: true })
      .then((res) => setStudent(res.data.student))
      .catch(() => setStudent(null));
  }, []);

  // Add to cart
  const handleAddToCart = async () => {
    if (!student) {
      setShowLoginModal(true);
      return;
    }
    try {
      await axios.post(
        `${API}/api/v1/students/add-to-cart/${student._id}`,
        { courseId: course._id },
        { withCredentials: true }
      );
      toast.success("Course added to cart!");
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${API}/api/v1/students/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );
      setStudent(res.data.student);
      setShowLoginModal(false);
      toast.success("Login successful!");
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      toast.error("Login failed. Check credentials.");
    }
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      return toast.warn("Passwords do not match");
    }
    try {
      await axios.post(`${API}/api/v1/students/register`, formData, {
        withCredentials: true,
      });
      setShowLoginModal(false);
      toast.success("Signup successful!");
    } catch {
      toast.error("Signup failed. Try again.");
    }
  };

  if (!course) return <div className="p-10 text-center">Loading...</div>;

  const discountedPrice =
    course.price - (course.price * (course.discount || 0)) / 100;

  return (
    <>
      <Header />

      <section className="bg-white mt-20 text-[#0b1224]">
        {course ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 px-6 py-12">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <p className="text-sm bg-blue-100 text-blue-700 inline-block px-3 py-1 rounded-full mb-4">
                Individual Course
              </p>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-gray-600 text-lg mb-8">
                {course.seoDescription?.replace(/<[^>]+>/g, "")}
              </p>

              <div className="border-b border-gray-200 flex space-x-8 text-lg font-medium">
                {["syllabus", "caseStudy", "examCert", "live"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 ${
                      activeTab === tab
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {
                      {
                        syllabus: "Syllabus",
                        caseStudy: "Case Studies",
                        examCert: "Exam & Certification",
                        live: "Live Schedule +",
                      }[tab]
                    }
                  </button>
                ))}
              </div>

              <div className="mt-6 prose max-w-none">
                {activeTab === "syllabus" && (
                  <div
                    dangerouslySetInnerHTML={{ __html: course.description }}
                  />
                )}
                {activeTab === "caseStudy" && (
                  <div dangerouslySetInnerHTML={{ __html: course.caseStudy }} />
                )}
                {activeTab === "examCert" && (
                  <div dangerouslySetInnerHTML={{ __html: course.examCert }} />
                )}
                {activeTab === "live" && <p>Live schedule coming soon.</p>}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                <Image
                  className="w-full h-full object-cover"
                  src={API + course.image}
                  height={80}
                  width={80}
                  alt="Course Thumbnail"
                />
              </div>
              <p className="text-sm text-gray-600">
                Get access to this course in <strong>Lab+</strong> &{" "}
                <strong>Lab+ Live</strong>
              </p>
              <div className="border border-orange-600 rounded-lg p-4">
                <h3 className="text-orange-700 font-bold text-lg mb-1">
                  Price:
                </h3>
                <p className="text-xl font-semibold text-orange-900 mb-2">
                  ₹{discountedPrice.toLocaleString()}
                </p>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[80vh] flex justify-center items-center border-black border-[3px]">
            Loading...
          </div>
        )}
      </section>

      {/* Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {authMode === "login" ? "Student Login" : "Student Signup"}
            </h2>

            {authMode === "signup" && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border px-3 py-2 mb-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full border px-3 py-2 mb-2 rounded"
                />

                <div className="mb-2">
                  <Select
                    options={modeOptions}
                    placeholder="Mode"
                    defaultValue={modeOptions[0]}
                    onChange={(selected) =>
                      setFormData({ ...formData, mode: selected.value })
                    }
                  />
                </div>

                <div className="mb-2">
                  <Select
                    options={locationOptions}
                    placeholder="Location"
                    defaultValue={locationOptions[0]}
                    onChange={(selected) =>
                      setFormData({ ...formData, location: selected.value })
                    }
                  />
                </div>

                <div className="mb-2">
                  <Select
                    options={centerOptions}
                    placeholder="Center"
                    defaultValue={centerOptions[0]}
                    onChange={(selected) =>
                      setFormData({ ...formData, center: selected.value })
                    }
                  />
                </div>
              </>
            )}

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border px-3 py-2 mb-2 rounded"
            />

            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full border px-3 py-2 pr-10 rounded"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {authMode === "signup" && (
              <div className="relative mb-2">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 pr-10 rounded"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            )}

            <button
              onClick={authMode === "login" ? handleLogin : handleSignup}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {authMode === "login" ? "Login" : "Register"}
            </button>

            <div className="text-sm text-center mt-4">
              {authMode === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => {
                      setAuthMode("signup");
                      clearFormData();
                    }}
                    className="text-blue-600"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      clearFormData();
                    }}
                    className="text-blue-600"
                  >
                    Login
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-4 text-gray-500 underline text-sm block mx-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
