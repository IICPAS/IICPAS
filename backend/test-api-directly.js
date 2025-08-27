import axios from "axios";

const API_BASE = "http://localhost:8080/api";

async function testAPIDirectly() {
  console.log("🧪 Testing API endpoints directly...\n");

  // Test 1: Test the debug endpoint
  try {
    console.log("1️⃣ Testing debug endpoint...");
    const debugResponse = await axios.post(`${API_BASE}/audit/debug`, {
      test: "data",
      userId: "test@example.com",
      route: "/test",
      duration: 100,
    });
    console.log("✅ Debug endpoint works:", debugResponse.data);
  } catch (error) {
    console.log(
      "❌ Debug endpoint failed:",
      error.response?.data || error.message
    );
  }

  // Test 2: Test with minimal required data
  try {
    console.log("\n2️⃣ Testing with minimal data...");
    const minimalResponse = await axios.post(`${API_BASE}/audit/track`, {
      userId: "test@example.com",
      route: "/test-route",
      duration: 120,
    });
    console.log("✅ Minimal data test passed:", minimalResponse.data);
  } catch (error) {
    console.log(
      "❌ Minimal data test failed:",
      error.response?.data || error.message
    );
  }

  // Test 3: Test with full data (what SDK might send)
  try {
    console.log("\n3️⃣ Testing with full data...");
    const fullResponse = await axios.post(`${API_BASE}/audit/track`, {
      userId: "test@example.com",
      route: "/test-route",
      duration: 120,
      ip: "192.168.1.100",
      city: "Test City",
      region: "Test Region",
      country: "Test Country",
      timestamp: new Date().toISOString(),
      sessionId: "test-session-123",
      userAgent: "Mozilla/5.0 (Test Browser)",
      referrer: "https://test.com",
      deviceType: "desktop",
      browser: "Chrome",
      os: "Windows",
    });
    console.log("✅ Full data test passed:", fullResponse.data);
  } catch (error) {
    console.log(
      "❌ Full data test failed:",
      error.response?.data || error.message
    );
  }

  // Test 4: Test the audit-log endpoint specifically
  try {
    console.log("\n4️⃣ Testing audit-log endpoint...");
    const auditLogResponse = await axios.post(`${API_BASE}/audit/audit-log`, {
      userId: "test@example.com",
      route: "/test-route",
      duration: 120,
    });
    console.log("✅ Audit-log endpoint works:", auditLogResponse.data);
  } catch (error) {
    console.log(
      "❌ Audit-log endpoint failed:",
      error.response?.data || error.message
    );
  }
}

testAPIDirectly().catch(console.error);
