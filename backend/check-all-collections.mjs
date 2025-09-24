import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/iicpa"
    );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Check all collections and find footer data
const checkAllCollections = async () => {
  try {
    console.log("🔍 Checking all collections for footer data...");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(
      "📊 Available collections:",
      collections.map((c) => c.name)
    );

    // Check footers collection
    const footersCollection = db.collection("footers");
    const footers = await footersCollection.find({}).toArray();
    console.log(`\n📄 Footers collection has ${footers.length} documents`);

    footers.forEach((footer, index) => {
      console.log(`\n📋 Footer ${index + 1}:`);
      console.log(`   ID: ${footer._id}`);
      console.log(`   Company: ${footer.companyInfo?.name || "N/A"}`);
      console.log(`   Active: ${footer.isActive || false}`);
      console.log(`   Created: ${footer.createdAt}`);
      console.log(`   Updated: ${footer.updatedAt}`);
    });

    // Check if there are any other collections that might contain footer data
    const possibleCollections = ["website", "settings", "config", "footer"];
    for (const collectionName of possibleCollections) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        if (count > 0) {
          console.log(
            `\n📊 Found ${count} documents in ${collectionName} collection`
          );
          const docs = await collection.find({}).limit(3).toArray();
          docs.forEach((doc, index) => {
            console.log(`   Doc ${index + 1}: ${Object.keys(doc).join(", ")}`);
          });
        }
      } catch (error) {
        // Collection doesn't exist, ignore
      }
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Run the check
const runCheck = async () => {
  await connectDB();
  await checkAllCollections();
  await mongoose.disconnect();
  console.log("👋 Disconnected from MongoDB");
};

runCheck();
