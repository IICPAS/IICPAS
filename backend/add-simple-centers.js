// Simple Demo Centers Addition
import mongoose from 'mongoose';

async function addCenters() {
  try {
    await mongoose.connect('mongodb://localhost:27017/iicpas');
    console.log('Connected to MongoDB');

    const Center = mongoose.model('Center', new mongoose.Schema({
      name: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
      email: String,
      manager: {
        name: String,
        phone: String,
        email: String
      },
      facilities: [String],
      courses: [String],
      capacity: Number,
      description: String,
      status: String,
      createdBy: mongoose.Schema.Types.ObjectId,
      createdAt: Date,
      updatedAt: Date
    }));

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
        facilities: ["Air Conditioning", "WiFi", "Projector", "Whiteboard", "Parking"],
        courses: ["68cba03ff6d6e18d9a7588f1"],
        capacity: 100,
        description: "Our flagship center in Delhi with state-of-the-art facilities.",
        status: "active",
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
        facilities: ["Air Conditioning", "WiFi", "Projector", "Computer Lab"],
        courses: ["68d02d9650e72fd791996223"],
        capacity: 75,
        description: "Modern center in Mumbai's business district.",
        status: "active",
        createdBy: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await Center.insertMany(demoCenters);
    console.log('✅ Demo centers added successfully');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

addCenters();
