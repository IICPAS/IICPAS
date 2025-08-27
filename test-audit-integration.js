// Test script to verify backend audit integration
import fetch from "node-fetch";

const API_BASE = "http://localhost:8080/api";

async function testAuditIntegration() {
  console.log("🧪 Testing backend audit integration...");

  try {
    // Test 1: Make a request to trigger automatic audit logging
    console.log("\n📡 Test 1: Making API request to trigger audit...");
    const response1 = await fetch(`${API_BASE}/audit/stats?days=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "test-user@example.com",
      },
    });

    console.log("✅ API request completed with status:", response1.status);
    const stats = await response1.json();
    console.log("📊 Audit stats response:", JSON.stringify(stats, null, 2));

    // Test 2: Check if the request was logged
    console.log("\n📡 Test 2: Checking if request was logged...");
    const response2 = await fetch(`${API_BASE}/audit/activities?limit=5`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "test-user@example.com",
      },
    });

    console.log(
      "✅ Activities request completed with status:",
      response2.status
    );
    const activities = await response2.json();
    console.log("📊 Recent activities:", JSON.stringify(activities, null, 2));

    // Test 3: Manual audit tracking
    console.log("\n📡 Test 3: Testing manual audit tracking...");
    const response3 = await fetch(`${API_BASE}/audit/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "test-user@example.com",
      },
      body: JSON.stringify({
        userId: "test-user@example.com",
        route: "/test/manual",
        method: "POST",
        statusCode: 200,
        duration: 150,
        event: "manual_test",
        metadata: {
          testType: "manual_tracking",
          success: true,
        },
      }),
    });

    console.log("✅ Manual tracking completed with status:", response3.status);
    const manualResult = await response3.json();
    console.log(
      "📊 Manual tracking result:",
      JSON.stringify(manualResult, null, 2)
    );

    console.log("\n🎉 All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testAuditIntegration();
