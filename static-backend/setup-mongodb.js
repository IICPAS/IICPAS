const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './config.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/static_backend';
const DB_NAME = process.env.MONGODB_DB_NAME || 'static_backend';

async function setupMongoDB() {
  console.log('🔧 Setting up MongoDB for Static-Backend Microservice...\n');

  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const filesCollection = db.collection('files');

    // Create indexes for better performance
    console.log('📊 Creating database indexes...');
    
    try {
      await filesCollection.createIndex({ file_type: 1 });
      console.log('✅ Created index on file_type');
    } catch (error) {
      console.log('ℹ️  Index on file_type already exists');
    }

    try {
      await filesCollection.createIndex({ upload_date: -1 });
      console.log('✅ Created index on upload_date');
    } catch (error) {
      console.log('ℹ️  Index on upload_date already exists');
    }

    try {
      await filesCollection.createIndex({ filename: 1 });
      console.log('✅ Created index on filename');
    } catch (error) {
      console.log('ℹ️  Index on filename already exists');
    }

    // Create a unique index on filename to prevent duplicates
    try {
      await filesCollection.createIndex({ filename: 1 }, { unique: true });
      console.log('✅ Created unique index on filename');
    } catch (error) {
      console.log('ℹ️  Unique index on filename already exists');
    }

    // Check if collection is empty
    const count = await filesCollection.countDocuments();
    console.log(`📁 Files collection contains ${count} documents`);

    console.log('\n🎉 MongoDB setup completed successfully!');
    console.log(`📊 Database: ${DB_NAME}`);
    console.log(`🔗 Connection: ${MONGODB_URI}`);

    await client.close();
    console.log('✅ MongoDB connection closed');

  } catch (error) {
    console.error('❌ MongoDB setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setupMongoDB();
