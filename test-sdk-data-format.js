// Test script to understand the data format sent by triostack-audit-sdk
const { createAuditClient } = require("triostack-audit-sdk");

async function testSDKDataFormat() {
  console.log("🧪 Testing triostack-audit-sdk data format...");

  try {
    // Create a mock audit client to see what it sends
    const auditClient = createAuditClient({
      baseUrl: "http://localhost:8080/api/audit",
      userId: "test-user@example.com",
      includeGeo: true,
      onError: (error) => {
        console.log("❌ SDK Error:", error);
      },
    });

    console.log("✅ Audit client created successfully");
    console.log("📊 Client configuration:", {
      baseUrl: "http://localhost:8080/api/audit",
      userId: "test-user@example.com",
      includeGeo: true,
    });

    // Try to manually track to see the data format
    try {
      const result = await auditClient.track({
        route: "/test-route",
        duration: 120,
      });
      console.log("✅ Manual track result:", result);
    } catch (error) {
      console.log("❌ Manual track error:", error.message);
    }

    // Cleanup
    auditClient.cleanup();
  } catch (error) {
    console.error("❌ Failed to create audit client:", error);
  }
}

// Run the test
testSDKDataFormat();
