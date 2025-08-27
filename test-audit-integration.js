const axios = require("axios");

const API_BASE = "http://localhost:8080/api";

// Test audit tracking
async function testAuditTracking() {
  try {
    console.log("🧪 Testing audit tracking...");

    const testActivity = {
      userId: "test-user-123",
      route: "/test-route",
      duration: 120,
      ip: "192.168.1.100",
      city: "Test City",
      region: "Test Region",
      country: "Test Country",
      timestamp: new Date().toISOString(),
      sessionId: "test-session-456",
      userAgent: "Mozilla/5.0 (Test Browser)",
      referrer: "https://test.com",
      deviceType: "desktop",
      browser: "Chrome",
      os: "Windows",
    };

    const response = await axios.post(`${API_BASE}/audit/track`, testActivity);

    if (response.data.success) {
      console.log("✅ Audit tracking test passed!");
      console.log("📊 Activity ID:", response.data.data._id);
    } else {
      console.log("❌ Audit tracking test failed:", response.data.message);
    }
  } catch (error) {
    console.error(
      "❌ Audit tracking test error:",
      error.response?.data || error.message
    );
  }
}

// Test audit stats
async function testAuditStats() {
  try {
    console.log("\n🧪 Testing audit stats...");

    const response = await axios.get(`${API_BASE}/audit/stats?days=7`);

    if (response.data.success) {
      console.log("✅ Audit stats test passed!");
      console.log("📊 Total activities:", response.data.data.totalActivities);
      console.log("👥 Unique users:", response.data.data.uniqueUsers);
      console.log("🌐 Unique IPs:", response.data.data.uniqueIPs);
    } else {
      console.log("❌ Audit stats test failed:", response.data.message);
    }
  } catch (error) {
    console.error(
      "❌ Audit stats test error:",
      error.response?.data || error.message
    );
  }
}

// Test audit activities retrieval
async function testAuditActivities() {
  try {
    console.log("\n🧪 Testing audit activities retrieval...");

    const response = await axios.get(`${API_BASE}/audit/activities?limit=5`);

    if (response.data.success) {
      console.log("✅ Audit activities test passed!");
      console.log("📊 Total activities:", response.data.pagination.total);
      console.log("📄 Retrieved activities:", response.data.data.length);
    } else {
      console.log("❌ Audit activities test failed:", response.data.message);
    }
  } catch (error) {
    console.error(
      "❌ Audit activities test error:",
      error.response?.data || error.message
    );
  }
}

// Run all tests
async function runTests() {
  console.log("🚀 Starting audit integration tests...\n");

  await testAuditTracking();
  await testAuditStats();
  await testAuditActivities();

  console.log("\n✨ All tests completed!");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testAuditTracking, testAuditStats, testAuditActivities };

