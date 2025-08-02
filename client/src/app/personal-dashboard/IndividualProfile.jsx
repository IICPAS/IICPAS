import React, { useEffect, useState } from "react";

const UserIcon = () => (
  <div
    style={{
      background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
      borderRadius: "50%",
      width: 80,
      height: 80,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 24px #a1c4fd55",
      marginBottom: 18,
    }}
  >
    <svg
      height="48"
      width="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  </div>
);

const Checkmark = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4ade80"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", margin: "0 auto" }}
  >
    <polyline points="20 6 10 18 4 12" />
  </svg>
);

const glassCard = {
  maxWidth: 900,
  margin: "48px auto",
  background: "rgba(255,255,255,0.25)",
  borderRadius: 24,
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  padding: 0,
  border: "1px solid rgba(255,255,255,0.18)",
  animation: "fadeInUp 0.7s cubic-bezier(.23,1.01,.32,1)",
};

const cardContent = {
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  minHeight: 320,
};

const leftCol = {
  flex: "0 0 260px",
  background: "rgba(255,255,255,0.45)",
  borderTopLeftRadius: 24,
  borderBottomLeftRadius: 24,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 24px",
  borderRight: "1px solid #e0e7ef55",
};

const rightCol = {
  flex: 1,
  padding: "40px 32px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1.5px solid #e0e7ef",
  background: "rgba(255,255,255,0.7)",
  fontSize: 16,
  marginBottom: 2,
  outline: "none",
  transition: "border 0.2s, box-shadow 0.2s",
  boxShadow: "0 1px 2px #e0e7ef33",
};

const inputFocus = {
  border: "1.5px solid #60a5fa",
  boxShadow: "0 2px 8px #60a5fa22",
};

const buttonStyle = {
  background: "linear-gradient(90deg, #60a5fa 0%, #38bdf8 100%)",
  color: "#fff",
  padding: "12px 0",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  fontSize: 18,
  width: "100%",
  marginTop: 8,
  boxShadow: "0 2px 8px #60a5fa33",
  cursor: "pointer",
  transition: "background 0.2s, box-shadow 0.2s",
};

const labelStyle = {
  display: "block",
  fontWeight: 600,
  marginBottom: 6,
  color: "#22292f",
  fontSize: 15,
};

const headingStyle = {
  fontWeight: 800,
  fontSize: 22,
  color: "#22292f",
  marginBottom: 2,
  textAlign: "center",
};

const subStyle = {
  color: "#64748b",
  fontSize: 15,
  marginBottom: 2,
  textAlign: "center",
};

const fadeInUpKeyframes = `
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}

@media (max-width: 700px) {
  .profile-card-content {
    flex-direction: column !important;
    min-height: unset !important;
  }
  .profile-left-col {
    border-radius: 24px 24px 0 0 !important;
    border-right: none !important;
    border-bottom: 1px solid #e0e7ef55 !important;
    padding: 32px 16px !important;
  }
  .profile-right-col {
    padding: 32px 16px !important;
  }
}`;

const IndividualProfile = () => {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [focus, setFocus] = useState("");
  const [showCheck, setShowCheck] = useState(false);
  const API =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API + "/v1/individual/profile-valid", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.user) {
          setProfile({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
          });
          setForm({
            name: data.user.name || "",
            phone: data.user.phone || "",
            password: "",
            confirmPassword: "",
          });
        } else {
          setError(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        setError("Error fetching profile");
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => setFocus(field);
  const handleBlur = () => setFocus("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    setShowCheck(false);
    try {
      const res = await fetch("/api/individual/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Profile updated successfully");
        setProfile({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
        });
        setForm({ ...form, password: "", confirmPassword: "" });
        setShowCheck(true);
        setTimeout(() => setShowCheck(false), 1800);
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      setError("Error updating profile");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{fadeInUpKeyframes}</style>
      <div style={glassCard}>
        <div className="profile-card-content" style={cardContent}>
          <div className="profile-left-col" style={leftCol}>
            <UserIcon />
            <div style={headingStyle}>{profile.name || "-"}</div>
            <div style={subStyle}>{profile.email || "-"}</div>
          </div>
          <div className="profile-right-col" style={rightCol}>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus("name")}
                  onBlur={handleBlur}
                  style={
                    focus === "name"
                      ? { ...inputStyle, ...inputFocus }
                      : inputStyle
                  }
                  required
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onFocus={() => handleFocus("phone")}
                  onBlur={handleBlur}
                  style={
                    focus === "phone"
                      ? { ...inputStyle, ...inputFocus }
                      : inputStyle
                  }
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>New Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus("password")}
                  onBlur={handleBlur}
                  style={
                    focus === "password"
                      ? { ...inputStyle, ...inputFocus }
                      : inputStyle
                  }
                  autoComplete="new-password"
                />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => handleFocus("confirmPassword")}
                  onBlur={handleBlur}
                  style={
                    focus === "confirmPassword"
                      ? { ...inputStyle, ...inputFocus }
                      : inputStyle
                  }
                  autoComplete="new-password"
                />
              </div>
              {showCheck && (
                <div
                  style={{
                    marginBottom: 16,
                    textAlign: "center",
                    animation: "fadeInUp 0.5s",
                  }}
                >
                  <Checkmark />
                  <div
                    style={{
                      color: "#4ade80",
                      fontWeight: 700,
                      fontSize: 16,
                      marginTop: 4,
                    }}
                  >
                    Saved!
                  </div>
                </div>
              )}
              {message && !showCheck && (
                <div
                  style={{
                    color: "#4ade80",
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  {message}
                </div>
              )}
              {error && (
                <div
                  style={{
                    color: "#ef4444",
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                style={buttonStyle}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(90deg, #38bdf8 0%, #60a5fa 100%)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(90deg, #60a5fa 0%, #38bdf8 100%)")
                }
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndividualProfile;
