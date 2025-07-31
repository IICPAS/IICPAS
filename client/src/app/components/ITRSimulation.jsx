// pages/itr-simulation.js
import { useState } from "react";

export default function ITRSimulation() {
  const [step, setStep] = useState(1);
  const [userID, setUserID] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleContinue = () => {
    if (userID.trim()) {
      setSubmitted(true);
      setStep(2);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        padding: "32px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
        >
          Income Tax Return Filing (ITR-1) Simulation
        </h1>

        {step === 1 && (
          <div style={{ display: "flex", gap: "32px" }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: "600", marginBottom: "8px" }}>
                Enter your User ID <span style={{ color: "red" }}>*</span>
              </p>
              <input
                type="text"
                placeholder="PAN/ Aadhaar/ Other User ID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  marginBottom: "12px",
                }}
              />
              <button
                onClick={handleContinue}
                disabled={!userID.trim()}
                style={{
                  padding: "10px 20px",
                  backgroundColor: userID.trim() ? "#0070f3" : "#aaa",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: userID.trim() ? "pointer" : "not-allowed",
                }}
              >
                Continue
              </button>

              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={() => alert("Net Banking simulation coming soon")}
                  style={{
                    border: "1px solid #0070f3",
                    backgroundColor: "transparent",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    color: "#0070f3",
                    cursor: "pointer",
                  }}
                >
                  ⬛ Net Banking
                </button>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: "600", marginBottom: "12px" }}>
                Know about your{" "}
                <span style={{ fontWeight: "bold" }}>User ID</span>
              </p>
              <ul style={{ lineHeight: "1.6" }}>
                <li>
                  <strong>PAN</strong> (Permanent Account Number)
                  <br />
                  For Individuals (Salaried employee, Senior citizen,
                  Self-employed, NRI)
                  <br />
                  For Other Than Individuals (Company, Trust, AOP, BOI, etc.)
                </li>
                <li style={{ marginTop: "12px" }}>
                  <strong>Aadhaar Number</strong>
                  <br />
                  For Individuals (Salaried employee, Senior citizen,
                  Self-employed, NRI)
                </li>
                <li style={{ marginTop: "12px" }}>
                  <strong>Other User ID</strong>
                  <br />
                  For Chartered Accountant, Tax Deductor, e-Return Intermediary,
                  etc.
                  <br />
                  (e.g., ITDREIN, ARCA, TAN)
                </li>
              </ul>
            </div>
          </div>
        )}

        {step === 2 && submitted && (
          <div>
            <p
              style={{ color: "green", fontWeight: "600", marginBottom: "8px" }}
            >
              Welcome, user {userID}! ✅
            </p>
            <p>You are now logged in. Continue to file your ITR-1 return.</p>
            <button
              onClick={() => setStep(3)}
              style={{
                marginTop: "16px",
                padding: "10px 20px",
                backgroundColor: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Proceed to Form
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <p style={{ fontWeight: "600" }}>[Form UI Placeholder]</p>
            <p>
              Here you would enter salary details, deductions, and preview your
              return.
            </p>
            <button
              onClick={() => setStep(4)}
              style={{
                marginTop: "16px",
                padding: "10px 20px",
                backgroundColor: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Submit Return
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <p style={{ color: "#1e40af", fontWeight: "600" }}>
              Your ITR has been submitted successfully! 🎉
            </p>
            <p>A confirmation will be sent to your registered email.</p>
          </div>
        )}
      </div>
    </div>
  );
}
