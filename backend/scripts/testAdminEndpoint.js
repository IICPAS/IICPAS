import axios from "axios";

const API_BASE = "http://localhost:8080/api";

const adminData = {
  name: "Test Admin",
  email: "testadmin@iicpa.com",
  password: "test123"
};

async function testAdminEndpoint() {
  try {
    console.log("🧪 Testing public admin registration endpoint...");
    console.log(`📡 URL: ${API_BASE}/employees/register-admin`);
    console.log(`📦 Data:`, adminData);

    const response = await axios.post(`${API_BASE}/employees/register-admin`, adminData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ Success!");
    console.log("📊 Response:", response.data);
    console.log("🔑 Token:", response.data.token);
    
  } catch (error) {
    console.log("❌ Error:", error.response?.data || error.message);
    
    if (error.response?.status === 400 && error.response?.data?.message === "Admin already exists") {
      console.log("ℹ️ Admin already exists - this is expected if admin was created before");
    }
  }
}

testAdminEndpoint();
