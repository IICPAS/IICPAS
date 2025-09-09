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
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("syllabus");
  const [student, setStudent] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentRecordId, setPaymentRecordId] = useState(null);
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
      console.log("Course data:", match);
      console.log("Course image:", match?.image);
      console.log("API URL:", API);
      console.log(
        "Full image URL:",
        match?.image ? `${API}${match.image}` : "No image"
      );
      setCourse(match);
    });
  }, [slug]);

  // Check student login
  useEffect(() => {
    console.log("Checking student login with API:", API);
    axios
      .get(`${API}/api/v1/students/isstudent`, { withCredentials: true })
      .then((res) => {
        console.log("Student login check response:", res.data);
        setStudent(res.data.student);
      })
      .catch((error) => {
        console.log("Student login check failed:", error);
        setStudent(null);
      });
  }, [API]);

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

  // Handle Buy Now
  const handleBuyNow = (cartItem) => {
    if (!student) {
      setShowLoginModal(true);
      return;
    }
    setSelectedCartItem(cartItem);
    setShowPaymentModal(true);
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${API}/api/v1/students/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setStudent(res.data.student);
      setShowLoginModal(false);
      toast.success("Login successful!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Login error:", error);
      console.error("Login error response:", error.response?.data);
      const errorMessage =
        error.response?.data?.message || "Login failed. Check credentials.";
      toast.error(errorMessage);
    }
  };

  const handleSignup = async () => {
    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      return toast.error("Please fill in all required fields");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.warn("Passwords do not match");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return toast.error("Please enter a valid email address");
    }

    // Validate phone number (basic validation)
    if (formData.phone.length < 10) {
      return toast.error("Please enter a valid phone number");
    }

    // Prepare data for registration (remove confirmPassword as it's not needed on backend)
    const registrationData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password,
      mode: formData.mode || "Online",
      location: formData.location || "Greater Noida",
      center: formData.center || "Greater Noida",
    };

    console.log("Registration data:", registrationData);
    console.log("API URL:", API);
    console.log("Full registration URL:", `${API}/api/v1/students/register`);

    try {
      const response = await axios.post(
        `${API}/api/v1/students/register`,
        registrationData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Registration response:", response.data);
      setShowLoginModal(false);
      clearFormData();
      toast.success("Signup successful! Please login to continue.");
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Signup failed. Try again.";
      toast.error(errorMessage);
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
                {course.image ? (
                  <Image
                    className="w-full h-full object-cover"
                    src={API + course.image}
                    height={300}
                    width={400}
                    alt="Course Thumbnail"
                    onError={(e) => {
                      console.error(
                        "Image failed to load:",
                        API + course.image
                      );
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <Image
                    className="w-full h-full object-cover"
                    src="/images/default-course.jpg"
                    height={300}
                    width={400}
                    alt="Default Course Image"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                )}
                <div
                  className="w-full h-full bg-gray-200 flex items-center justify-center"
                  style={{ display: "none" }}
                >
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📚</div>
                    <p className="text-sm">No image available</p>
                  </div>
                </div>
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
                <div className="space-y-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700"
                  >
                    Add To Cart
                  </button>
                  <button
                    onClick={() =>
                      handleBuyNow({
                        title: course.title,
                        price: discountedPrice,
                      })
                    }
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                  >
                    Buy Now
                  </button>
                </div>
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

      {/* Payment Modal */}
      {showPaymentModal && selectedCartItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Complete Your Payment</h2>
                  <p className="text-blue-100 mt-1">
                    Secure UPI payment for your course
                  </p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Course Details & Payment Info */}
                <div className="space-y-6">
                  {/* Course Details */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedCartItem.title}
                        </h3>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{selectedCartItem.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* UPI Payment Details */}
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 text-green-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      UPI Payment Details
                    </h3>

                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Holder
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          Lokesh Gupta
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          UPI ID
                        </label>
                        <div className="flex items-center space-x-2">
                          <p className="text-lg font-mono bg-white border border-gray-300 rounded px-3 py-2 flex-1">
                            8810380146@ptaxis
                          </p>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText("8810380146@ptaxis")
                            }
                            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Instructions */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      How to Pay
                    </h4>
                    <ol className="text-sm text-blue-800 space-y-2">
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                          1
                        </span>
                        Open any UPI app (Paytm, PhonePe, Google Pay, BHIM)
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                          2
                        </span>
                        Scan the QR code or enter UPI ID: 8810380146@ptaxis
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                          3
                        </span>
                        Enter amount: ₹{selectedCartItem.price.toLocaleString()}
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                          4
                        </span>
                        Complete the payment and take a screenshot
                      </li>
                    </ol>
                  </div>
                </div>

                {/* Right Column - QR Code & Upload */}
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm text-center">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">
                      Scan QR Code
                    </h4>
                    <div className="bg-white border-2 border-gray-300 rounded-xl p-3 inline-block shadow-lg">
                      <Image
                        src="/images/qr.jpeg"
                        alt="UPI QR Code"
                        width={150}
                        height={150}
                        className="mx-auto rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      Scan with any UPI app to pay instantly
                    </p>
                  </div>

                  {/* Payment Screenshot Upload */}
                  {paymentRecordId && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                      <h4 className="font-bold text-green-900 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Upload Payment Proof
                      </h4>
                      <div className="space-y-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setPaymentScreenshot(e.target.files[0])
                          }
                          className="w-full border-2 border-dashed border-green-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors cursor-pointer"
                        />
                        {paymentScreenshot && (
                          <button
                            onClick={async () => {
                              const uploadToast = toast.loading(
                                "Uploading screenshot...",
                                {
                                  duration: 0,
                                }
                              );

                              try {
                                const formData = new FormData();
                                formData.append(
                                  "screenshot",
                                  paymentScreenshot
                                );

                                await axios.post(
                                  `${API}/api/v1/payments/upload-screenshot/${paymentRecordId}`,
                                  formData,
                                  {
                                    withCredentials: true,
                                    headers: {
                                      "Content-Type": "multipart/form-data",
                                    },
                                  }
                                );
                                toast.dismiss(uploadToast);
                                toast.success(
                                  "Payment screenshot uploaded successfully!",
                                  { duration: 5000 }
                                );
                              } catch (error) {
                                console.error(
                                  "Error uploading screenshot:",
                                  error
                                );
                                toast.dismiss(uploadToast);
                                toast.error(
                                  "Failed to upload screenshot. Please try again.",
                                  { duration: 5000 }
                                );
                              }
                            }}
                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg"
                          >
                            Upload Screenshot
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={async () => {
                        if (paymentRecordId) return; // Prevent multiple clicks

                        const processingToast = toast.loading(
                          "Processing payment...",
                          {
                            duration: 0, // Keep it until manually dismissed
                          }
                        );

                        try {
                          const response = await axios.post(
                            `${API}/api/v1/payments/create`,
                            {
                              courseId: course._id,
                              amount: selectedCartItem.price,
                            },
                            { withCredentials: true }
                          );
                          setPaymentRecordId(response.data.payment._id);
                          toast.dismiss(processingToast);
                          toast.success(
                            "Payment record created! Please upload your payment screenshot.",
                            { duration: 5000 }
                          );
                        } catch (error) {
                          console.error(
                            "Error creating payment record:",
                            error
                          );
                          toast.dismiss(processingToast);
                          toast.error(
                            "Failed to create payment record. Please try again.",
                            { duration: 5000 }
                          );
                        }
                      }}
                      disabled={paymentRecordId}
                      className={`w-full py-4 rounded-xl transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl ${
                        paymentRecordId
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      } text-white`}
                    >
                      {paymentRecordId
                        ? "Payment Record Created ✓"
                        : "I've Made Payment"}
                    </button>

                    <button
                      onClick={() => {
                        setShowPaymentModal(false);
                        setPaymentRecordId(null);
                        setPaymentScreenshot(null);
                      }}
                      className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
