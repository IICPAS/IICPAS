const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:3001";

async function testMultiUploadEndpoints() {
  console.log("🧪 Testing Static-Backend Multi-Upload Endpoints...\n");

  try {
    // Test welcome route
    console.log("1. Testing welcome route...");
    const welcomeRes = await axios.get(`${BASE_URL}/`);
    console.log("✅ Welcome response:", welcomeRes.data.message);
    console.log(
      "📋 Available endpoints:",
      Object.keys(welcomeRes.data.endpoints).length
    );
    console.log("");

    // Test health check
    console.log("2. Testing health check...");
    const healthRes = await axios.get(`${BASE_URL}/health`);
    console.log("✅ Health check:", healthRes.data.status);
    console.log("");

    // Test get files (should be empty initially)
    console.log("3. Testing get files...");
    const filesRes = await axios.get(`${BASE_URL}/files`);
    console.log(
      "✅ Files response:",
      `Found ${filesRes.data.data.length} files`
    );
    console.log("");

    // Test get images
    console.log("4. Testing get images...");
    const imagesRes = await axios.get(`${BASE_URL}/files/images`);
    console.log(
      "✅ Images response:",
      `Found ${imagesRes.data.data.length} images`
    );
    console.log("");

    // Test get videos
    console.log("5. Testing get videos...");
    const videosRes = await axios.get(`${BASE_URL}/files/videos`);
    console.log(
      "✅ Videos response:",
      `Found ${videosRes.data.data.length} videos`
    );
    console.log("");

    console.log("🎉 All basic endpoints tested successfully!");
    console.log("\n📝 Next steps for testing uploads:");
    console.log("1. Test single image upload: POST /upload/image");
    console.log("2. Test single video upload: POST /upload/video");
    console.log("3. Test multiple images upload: POST /upload/images");
    console.log("4. Test multiple videos upload: POST /upload/videos");
    console.log("5. Test bulk upload (mixed files): POST /upload/bulk");
    console.log("\n💡 Use tools like Postman or curl to test file uploads");
    console.log(
      '💡 Example: curl -X POST -F "images=@file1.jpg" -F "images=@file2.jpg" http://localhost:3001/upload/images'
    );
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Run tests
testMultiUploadEndpoints();
