import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
    trim: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["video", "text", "rich"],
    default: "text",
  },
  videoUrl: String,
  videoBase64: String,
  textContent: String,
  richTextContent: String,
  order: {
    type: Number,
    default: 0,
  },
});

const simulationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["accounting", "financial", "custom", "gst"],
    default: "accounting",
  },
  title: String,
  description: String,
  config: {
    accountTypes: [String],
    accountOptions: [String],
    columns: [String],
    validationRules: Object,
    // GST specific config
    gstConfig: {
      difficulty: {
        type: String,
        enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
        default: "BEGINNER",
      },
      hints: [
        {
          field: String,
          hint: String,
          order: Number,
        },
      ],
      autoCalculate: {
        type: Boolean,
        default: true,
      },
      showErrors: {
        type: Boolean,
        default: true,
      },
    },
  },
  isOptional: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const questionSetSchema = new mongoose.Schema({
  name: String,
  description: String,
  excelFile: String,
  excelBase64: String,
  questions: [
    {
      question: String,
      context: String,
      type: String,
      options: [String],
      correctAnswer: String,
      explanation: String,
    },
  ],
  totalQuestions: Number,
  timeLimit: Number,
  passingScore: Number,
  order: {
    type: Number,
    default: 0,
  },
});

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter",
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  tasks: [taskSchema],
  content: [contentSchema],
  simulations: [simulationSchema],
  questionSets: [questionSetSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

assignmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Assignment", assignmentSchema);
