import axios from "axios";

// Production API URLs to try
const API_URLS = ["https://api.iicpa.in/api", "https://www.api.iicpa.in/api"];

// Admin user data
const adminData = {
  name: "Admin User",
  email: "admin@iicpa.com",
  password: "admin123",
  role: "Admin",
  status: "Active",
};

async function createAdminDirect() {
  console.log("🚀 Attempting to create admin user on production...");

  for (const API_BASE of API_URLS) {
    console.log(`\n📡 Trying API: ${API_BASE}`);

    try {
      // First, try to login to see if admin already exists
      try {
        console.log("🔍 Checking if admin already exists...");
        const loginResponse = await axios.post(`${API_BASE}/employees/login`, {
          email: adminData.email,
          password: adminData.password,
        });

        if (loginResponse.data) {
          console.log("✅ Admin user already exists and can login!");
          console.log("📧 Email:", adminData.email);
          console.log("🔑 Password: admin123");
          console.log("👤 Role: Admin");
          console.log("🌐 Login URL: https://www.iicpa.in/admin");
          console.log("🎯 Dashboard URL: https://www.iicpa.in/admin-dashboard");
          return;
        }
      } catch (loginError) {
        console.log("ℹ️ Admin doesn't exist or can't login, proceeding...");
      }

      // Try different endpoints for admin creation
      const endpoints = [
        "/employees/register-admin",
        "/admin/register",
        "/employees",
        "/auth/register-admin",
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`🔧 Trying endpoint: ${API_BASE}${endpoint}`);

          const response = await axios.post(
            `${API_BASE}${endpoint}`,
            adminData,
            {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: 10000,
            }
          );

          if (response.status === 201 || response.status === 200) {
            console.log("✅ Admin user created successfully!");
            console.log("📧 Email:", adminData.email);
            console.log("🔑 Password: admin123");
            console.log("👤 Role: Admin");
            console.log("✅ Status: Active");
            console.log("🌐 Login URL: https://www.iicpa.in/admin");
            console.log(
              "🎯 Dashboard URL: https://www.iicpa.in/admin-dashboard"
            );
            return;
          }
        } catch (endpointError) {
          console.log(
            `❌ ${endpoint}: ${
              endpointError.response?.data?.message || endpointError.message
            }`
          );
        }
      }
    } catch (error) {
      console.log(
        `❌ API ${API_BASE} failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  console.log("\n⚠️ Could not create admin user through API.");
  console.log("🔧 Alternative options:");
  console.log("1. Create admin user directly in database");
  console.log("2. Use backend admin panel if available");
  console.log("3. Contact server administrator");
  console.log("\n📋 Default admin credentials to try:");
  console.log("📧 Email: admin@iicpa.com");
  console.log("🔑 Password: admin123");
}

// Run the script
createAdminDirect();
