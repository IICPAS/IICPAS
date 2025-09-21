// Add Demo Centers Data
import mongoose from 'mongoose';
import Center from './models/Center.js';

async function addDemoCenters() {
  try {
    await mongoose.connect('mongodb://localhost:27017/iicpas');
    console.log('Connected to MongoDB');

    const demoCenters = [
      {
        name: "IICPA Delhi Center",
        address: "123, Connaught Place, New Delhi",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110001",
        phone: "+91-11-23456789",
        email: "delhi@iicpa.in",
        manager: {
          name: "Rajesh Kumar",
          phone: "+91-9876543210",
          email: "rajesh.delhi@iicpa.in"
        },
        facilities: ["Air Conditioning", "WiFi", "Projector", "Whiteboard", "Parking", "Cafeteria"],
        courses: ["68cba03ff6d6e18d9a7588f1", "68d02d9650e72fd791996223"],
        capacity: 100,
        description: "Our flagship center in Delhi with state-of-the-art facilities and experienced instructors.",
        status: "active",
        timings: {
          monday: { open: "09:00", close: "18:00" },
          tuesday: { open: "09:00", close: "18:00" },
          wednesday: { open: "09:00", close: "18:00" },
          thursday: { open: "09:00", close: "18:00" },
          friday: { open: "09:00", close: "18:00" },
          saturday: { open: "09:00", close: "18:00" },
          sunday: { open: "10:00", close: "16:00" }
        },
        createdBy: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "IICPA Mumbai Center",
        address: "456, Bandra Kurla Complex, Mumbai",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400051",
        phone: "+91-22-23456789",
        email: "mumbai@iicpa.in",
        manager: {
          name: "Priya Sharma",
          phone: "+91-9876543211",
          email: "priya.mumbai@iicpa.in"
        },
        facilities: ["Air Conditioning", "WiFi", "Projector", "Computer Lab", "Library", "Parking"],
        courses: ["68cba03ff6d6e18d9a7588f1"],
        capacity: 75,
        description: "Modern center in Mumbai's business district with excellent connectivity and facilities.",
        status: "active",
        timings: {
          monday: { open: "09:00", close: "18:00" },
          tuesday: { open: "09:00", close: "18:00" },
          wednesday: { open: "09:00", close: "18:00" },
          thursday: { open: "09:00", close: "18:00" },
          friday: { open: "09:00", close: "18:00" },
          saturday: { open: "09:00", close: "18:00" },
          sunday: { open: "10:00", close: "16:00" }
        },
        createdBy: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "IICPA Bangalore Center",
        address: "789, Electronic City, Bangalore",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560100",
        phone: "+91-80-23456789",
        email: "bangalore@iicpa.in",
        manager: {
          name: "Suresh Reddy",
          phone: "+91-9876543212",
          email: "suresh.bangalore@iicpa.in"
        },
        facilities: ["Air Conditioning", "WiFi", "Projector", "Auditorium", "Meeting Rooms", "Cafeteria"],
        courses: ["68d02d9650e72fd791996223"],
        capacity: 120,
        description: "Tech-focused center in Bangalore with modern infrastructure and expert faculty.",
        status: "active",
        timings: {
          monday: { open: "09:00", close: "18:00" },
          tuesday: { open: "09:00", close: "18:00" },
          wednesday: { open: "09:00", close: "18:00" },
          thursday: { open: "09:00", close: "18:00" },
          friday: { open: "09:00", close: "18:00" },
          saturday: { open: "09:00", close: "18:00" },
          sunday: { open: "10:00", close: "16:00" }
        },
        createdBy: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Clear existing centers
    await Center.deleteMany({});
    console.log('Cleared existing centers');

    // Add demo centers
    await Center.insertMany(demoCenters);
    console.log('✅ Demo centers added successfully');

    console.log('\n📊 Summary:');
    console.log(`- Total centers: ${demoCenters.length}`);
    console.log('- Delhi Center: 100 capacity, 2 courses');
    console.log('- Mumbai Center: 75 capacity, 1 course');
    console.log('- Bangalore Center: 120 capacity, 1 course');

    console.log('\n🧪 Test URLs:');
    console.log('1. Admin Dashboard: http://localhost:3000/admin-dashboard');
    console.log('2. Center Management API: http://localhost:8080/api/v1/centers');
    console.log('3. Public Centers API: http://localhost:8080/api/v1/centers/public');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addDemoCenters();
}

export { addDemoCenters };
