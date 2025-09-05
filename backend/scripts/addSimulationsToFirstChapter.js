import mongoose from "mongoose";
import Course from "../models/Content/Course.js";
import Chapter from "../models/Content/Chapter.js";
import Assignment from "../models/Assignment.js";
import CaseStudy from "../models/CaseStudy.js";
import {
  generateMultipleSimulations,
  generateAssessmentQuestions,
} from "../utils/simulationDataGenerator.js";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/iicpas"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Add simulations and assessments to first course first chapter
const addSimulationsToFirstChapter = async () => {
  try {
    console.log(
      "Starting to add simulations and assessments to first course first chapter..."
    );

    // Get the first course
    const firstCourse = await Course.findOne({ status: "Active" }).populate(
      "chapters"
    );
    if (!firstCourse) {
      console.log("No active course found");
      return;
    }

    console.log(`Found first course: ${firstCourse.title}`);

    // Get the first chapter
    const firstChapter = firstCourse.chapters[0];
    if (!firstChapter) {
      console.log("No chapters found in the first course");
      return;
    }

    console.log(`Found first chapter: ${firstChapter.title}`);

    // Generate simulation data
    const simulations = generateMultipleSimulations(3);
    console.log(`Generated ${simulations.length} simulations`);

    // Generate assessment questions
    const assessmentQuestions = generateAssessmentQuestions();
    console.log(`Generated ${assessmentQuestions.length} assessment questions`);

    // Create a Case Study with simulations
    const caseStudyData = {
      title: "Accounting Simulations - Chapter 1",
      description:
        "Interactive accounting experiments to practice journal entries",
      chapterId: firstChapter._id,
      order: 1,
      isActive: true,
      tasks: [
        {
          taskName: "Complete Journal Entries",
          instructions:
            "Pass journal entries for the following transactions based on Practical or US accounting rules, keeping in mind the accounting entry process.",
          order: 0,
        },
      ],
      content: [
        {
          type: "text",
          textContent:
            "Practice these accounting simulations to master journal entry concepts.",
          order: 0,
        },
      ],
      simulations: simulations.map((sim, index) => ({
        type: "accounting",
        title: `Experiment ${sim.experimentNumber}`,
        description: sim.statement,
        config: {
          accountTypes: ["Debit", "Credit"],
          accountOptions: [
            "Cash A/c",
            "Bank A/c",
            "Furniture A/c",
            "Capital A/c",
            "Purchase A/c",
            "Sales A/c",
            "Creditors A/c",
            "Debtors A/c",
            "Salary A/c",
            "Rent A/c",
            "Insurance A/c",
            "Equipment A/c",
            "Investment A/c",
            "Loan A/c",
            "Interest A/c",
            "Commission A/c",
            "Professional Charges A/c",
            "Advance A/c",
            "Prepaid A/c",
            "Accrued A/c",
          ],
          columns: ["Date", "Type", "Particulars", "Debit", "Credit"],
          validationRules: {
            requireDate: true,
            requireType: true,
            requireParticulars: true,
            requireAmount: true,
            balanceRequired: true,
          },
          correctEntries: sim.correctEntries,
        },
        isOptional: false,
        order: index,
      })),
      questionSets: [],
    };

    // Create the Case Study
    const caseStudy = new CaseStudy(caseStudyData);
    await caseStudy.save();
    console.log(`Created Case Study: ${caseStudy.title}`);

    console.log(
      "Successfully added simulations to first course first chapter!"
    );
    console.log(`Case Study ID: ${caseStudy._id}`);
    console.log(
      "Note: Assessment questions will be added separately due to schema complexity."
    );
  } catch (error) {
    console.error("Error adding simulations and assessments:", error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await addSimulationsToFirstChapter();
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
  process.exit(0);
};

// Run the script
main().catch(console.error);
