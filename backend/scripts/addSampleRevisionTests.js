import mongoose from "mongoose";
import dotenv from "dotenv";
import RevisionTest from "../models/Content/RevisionTest.js";
import Course from "../models/Content/Course.js";

dotenv.config();

// Function to generate questions based on level and difficulty
const generateQuestionsForLevel = (courseTitle, level, difficulty) => {
  // Pro level questions (most advanced)
  if (level === "Pro") {
    return [
      {
        question: `What is the most sophisticated application of ${courseTitle} in professional practice?`,
        options: ["Basic implementation", "Standard procedures", "Cutting-edge innovations", "Simple techniques"],
        correctAnswer: "Cutting-edge innovations",
        explanation: "Pro level focuses on the most advanced and innovative applications in the field."
      },
      {
        question: `Which expert-level skill is required for Pro level mastery?`,
        options: ["Basic understanding", "Intermediate analysis", "Strategic thinking and leadership", "Simple memorization"],
        correctAnswer: "Strategic thinking and leadership",
        explanation: "Pro level requires strategic thinking and leadership capabilities in the subject area."
      },
      {
        question: `What type of challenges are presented in Pro level assessments?`,
        options: ["Standard problems", "Complex multi-faceted scenarios", "Basic exercises", "Simple case studies"],
        correctAnswer: "Complex multi-faceted scenarios",
        explanation: "Pro level presents complex, multi-dimensional challenges requiring expert-level solutions."
      },
      {
        question: `How should you approach Pro level strategic questions?`,
        options: ["Quick decisions", "Surface analysis", "Comprehensive strategic analysis", "Basic problem solving"],
        correctAnswer: "Comprehensive strategic analysis",
        explanation: "Pro level requires comprehensive strategic analysis and expert-level decision making."
      },
      {
        question: `What is the ultimate goal of Pro level competency?`,
        options: ["Basic proficiency", "Intermediate skills", "Industry leadership and innovation", "Simple understanding"],
        correctAnswer: "Industry leadership and innovation",
        explanation: "Pro level aims to develop industry leaders capable of innovation and strategic advancement."
      }
    ];
  }

  const baseQuestions = {
    "Normal": [
      {
        question: `What is the primary focus of ${courseTitle}?`,
        options: ["Basic concepts", "Advanced techniques", "Complex theories", "Expert applications"],
        correctAnswer: "Basic concepts",
        explanation: "This level focuses on fundamental concepts and basic understanding."
      },
      {
        question: `Which skill is most important for beginners in ${courseTitle}?`,
        options: ["Memorization", "Understanding basics", "Advanced analysis", "Expert judgment"],
        correctAnswer: "Understanding basics",
        explanation: "Beginners should focus on understanding the basic principles first."
      },
      {
        question: `What is the recommended study approach for beginners?`,
        options: ["Quick reading", "Thorough understanding", "Advanced practice", "Expert analysis"],
        correctAnswer: "Thorough understanding",
        explanation: "Beginners require careful study and understanding of fundamentals."
      },
      {
        question: `How many hours per week should beginners study?`,
        options: ["1-2 hours", "3-5 hours", "6-8 hours", "10+ hours"],
        correctAnswer: "3-5 hours",
        explanation: "Beginners require moderate study time to build strong foundations."
      },
      {
        question: `What is the main goal for beginners in ${courseTitle}?`,
        options: ["Master advanced topics", "Build strong foundation", "Become expert", "Skip basics"],
        correctAnswer: "Build strong foundation",
        explanation: "Beginners should aim to establish a solid foundation for further learning."
      }
    ],
    "Hard": [
      {
        question: `Which advanced concept is introduced in ${courseTitle}?`,
        options: ["Basic definitions", "Intermediate applications", "Simple examples", "Elementary principles"],
        correctAnswer: "Intermediate applications",
        explanation: "This level builds upon basic concepts by introducing practical applications."
      },
      {
        question: `What type of analysis is required for intermediate questions?`,
        options: ["Simple recall", "Critical thinking", "Basic understanding", "Memorization"],
        correctAnswer: "Critical thinking",
        explanation: "This level requires students to analyze and think critically about concepts."
      },
      {
        question: `Which skill becomes more important at this level?`,
        options: ["Rote learning", "Problem solving", "Basic reading", "Simple memorization"],
        correctAnswer: "Problem solving",
        explanation: "This level emphasizes practical problem-solving skills."
      },
      {
        question: `What is the complexity level of intermediate scenarios?`,
        options: ["Very simple", "Moderately complex", "Extremely basic", "Completely easy"],
        correctAnswer: "Moderately complex",
        explanation: "This level presents moderately complex scenarios requiring analysis."
      },
      {
        question: `How should you approach intermediate case studies?`,
        options: ["Skip them", "Read quickly", "Analyze thoroughly", "Memorize answers"],
        correctAnswer: "Analyze thoroughly",
        explanation: "Intermediate case studies require detailed analysis and understanding."
      }
    ],
    "Hardest": [
      {
        question: `What is the most challenging aspect of Advanced level in ${courseTitle}?`,
        options: ["Basic concepts", "Simple applications", "Complex problem solving", "Easy memorization"],
        correctAnswer: "Complex problem solving",
        explanation: "Advanced level requires sophisticated problem-solving skills and complex analysis."
      },
      {
        question: `Which analytical skill is essential for Advanced level?`,
        options: ["Simple recall", "Basic understanding", "Advanced synthesis", "Elementary thinking"],
        correctAnswer: "Advanced synthesis",
        explanation: "Advanced level requires synthesizing multiple concepts and advanced analytical skills."
      },
      {
        question: `What type of scenarios are presented in Advanced level?`,
        options: ["Simple examples", "Basic cases", "Complex real-world situations", "Easy problems"],
        correctAnswer: "Complex real-world situations",
        explanation: "Advanced level presents complex, real-world scenarios requiring expert-level analysis."
      },
      {
        question: `How should you approach Advanced level questions?`,
        options: ["Quick guessing", "Surface reading", "Deep analysis and reasoning", "Simple memorization"],
        correctAnswer: "Deep analysis and reasoning",
        explanation: "Advanced level requires thorough analysis, reasoning, and expert-level thinking."
      },
      {
        question: `What is the expected outcome of Advanced level mastery?`,
        options: ["Basic knowledge", "Intermediate skills", "Expert-level competency", "Simple understanding"],
        correctAnswer: "Expert-level competency",
        explanation: "Advanced level aims to develop expert-level competency in the subject area."
      }
    ]
  };

  return baseQuestions[difficulty] || baseQuestions["Normal"];
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const addSampleRevisionTests = async () => {
  try {
    // Get all courses
    const courses = await Course.find({ status: "Active" });
    console.log(`Found ${courses.length} active courses`);

    if (courses.length === 0) {
      console.log("No active courses found. Please create courses first.");
      return;
    }

    const sampleTests = [];

    // Create revision tests for each course
    for (const course of courses) {
      const levels = [
        { level: "Level 1", difficulty: "Normal" },
        { level: "Level 2", difficulty: "Hard" },
        { level: "Pro", difficulty: "Hardest" }
      ];
      
      for (const { level, difficulty } of levels) {
        const test = {
          course: course._id,
          level: level,
          title: `${course.title} - ${level}`,
          timeLimit: level === "Level 1" ? 10 : level === "Level 2" ? 15 : 20, // More time for higher levels
          difficulty: difficulty,
          questions: generateQuestionsForLevel(course.title, level, difficulty),
          status: "active"
        };
        
        sampleTests.push(test);
      }
    }

    // Clear existing revision tests
    await RevisionTest.deleteMany({});
    console.log("Cleared existing revision tests");

    // Insert new revision tests
    const insertedTests = await RevisionTest.insertMany(sampleTests);
    console.log(`✅ Added ${insertedTests.length} revision tests with different difficulty levels`);

    // Display summary
    for (const course of courses) {
      const courseTests = insertedTests.filter(test => test.course.toString() === course._id.toString());
      console.log(`📚 ${course.title}: ${courseTests.length} tests`);
      courseTests.forEach(test => {
        console.log(`   - ${test.level} (${test.difficulty}): ${test.questions.length} questions, ${test.timeLimit} min`);
      });
    }

  } catch (error) {
    console.error("❌ Error adding sample revision tests:", error);
  }
};

const main = async () => {
  await connectDB();
  await addSampleRevisionTests();
  mongoose.connection.close();
  console.log("✅ Script completed");
};

main();
