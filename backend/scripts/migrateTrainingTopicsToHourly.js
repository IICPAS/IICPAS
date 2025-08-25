import mongoose from "mongoose";
import Topics_Trainings from "../models/Trainings/TopicsTraining.js";
import dotenv from "dotenv";

dotenv.config();

const migrateTrainingTopicsToHourly = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find all training topics that don't have pricePerHour field
    const topics = await Topics_Trainings.find({ pricePerHour: { $exists: false } });
    
    console.log(`Found ${topics.length} topics to migrate`);

    // Update each topic to set pricePerHour to the existing price value
    for (const topic of topics) {
      await Topics_Trainings.findByIdAndUpdate(
        topic._id,
        { 
          pricePerHour: topic.price,
          // Keep the existing price field for backward compatibility
        },
        { new: true }
      );
      console.log(`Migrated topic: ${topic.title} - Price: ₹${topic.price} -> Price per Hour: ₹${topic.price}`);
    }

    console.log("Migration completed successfully!");
    
    // Verify the migration
    const allTopics = await Topics_Trainings.find();
    console.log(`Total topics after migration: ${allTopics.length}`);
    
    allTopics.forEach(topic => {
      console.log(`${topic.title}: ₹${topic.pricePerHour}/hour`);
    });

  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the migration
migrateTrainingTopicsToHourly();
