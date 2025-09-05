// Random data generator for AccountingExperimentCard simulations

const accountTypes = ["Debit", "Credit"];
const accountOptions = [
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
];

const transactionTemplates = [
  {
    statement:
      "Paid wages to employees for the first two weeks of January, aggregating Rs.{amount}.",
    correctEntries: [
      {
        type: "Debit",
        particulars: "Salary A/c",
        debit: "{amount}",
        credit: "",
      },
      {
        type: "Credit",
        particulars: "Cash A/c",
        debit: "",
        credit: "{amount}",
      },
    ],
  },
  {
    statement:
      "Insurance premium of Rs.{amount} paid to LIC. Rs.{amount1} related to current FY and balance is towards next FY.",
    correctEntries: [
      {
        type: "Debit",
        particulars: "Insurance A/c",
        debit: "{amount1}",
        credit: "",
      },
      {
        type: "Debit",
        particulars: "Prepaid A/c",
        debit: "{amount2}",
        credit: "",
      },
      {
        type: "Credit",
        particulars: "Cash A/c",
        debit: "",
        credit: "{amount}",
      },
    ],
  },
  {
    statement:
      "Investment by Ms. {name1} & Mr. {name2} (Rs. {amount} each as capital by cheque).",
    correctEntries: [
      { type: "Debit", particulars: "Bank A/c", debit: "{total}", credit: "" },
      {
        type: "Credit",
        particulars: "Capital A/c",
        debit: "",
        credit: "{total}",
      },
    ],
  },
  {
    statement: "Purchase of goods worth Rs.{amount} paid through SBI bank.",
    correctEntries: [
      {
        type: "Debit",
        particulars: "Purchase A/c",
        debit: "{amount}",
        credit: "",
      },
      {
        type: "Credit",
        particulars: "Bank A/c",
        debit: "",
        credit: "{amount}",
      },
    ],
  },
  {
    statement:
      "Purchase of equipment on credit worth Rs.{amount} from {company}.",
    correctEntries: [
      {
        type: "Debit",
        particulars: "Equipment A/c",
        debit: "{amount}",
        credit: "",
      },
      {
        type: "Credit",
        particulars: "Creditors A/c",
        debit: "",
        credit: "{amount}",
      },
    ],
  },
  {
    statement: "Cash sale of goods worth Rs.{amount} to Mr. {name}.",
    correctEntries: [
      { type: "Debit", particulars: "Cash A/c", debit: "{amount}", credit: "" },
      {
        type: "Credit",
        particulars: "Sales A/c",
        debit: "",
        credit: "{amount}",
      },
    ],
  },
  {
    statement: "Credit sale of goods worth Rs.{amount} to Mr. {name}.",
    correctEntries: [
      {
        type: "Debit",
        particulars: "Debtors A/c",
        debit: "{amount}",
        credit: "",
      },
      {
        type: "Credit",
        particulars: "Sales A/c",
        debit: "",
        credit: "{amount}",
      },
    ],
  },
  {
    statement:
      "Professional charges paid Rs.{amount} through SBI bank to Mr. {name}.",
    correctEntries: [
      {
        type: "Debit",
        particulars: "Professional Charges A/c",
        debit: "{amount}",
        credit: "",
      },
      {
        type: "Credit",
        particulars: "Bank A/c",
        debit: "",
        credit: "{amount}",
      },
    ],
  },
  {
    statement: "Salary advance paid Rs.{amount} to Mr. {name}.",
    correctEntries: [
      {
        type: "Debit",
        particulars: "Advance A/c",
        debit: "{amount}",
        credit: "",
      },
      {
        type: "Credit",
        particulars: "Cash A/c",
        debit: "",
        credit: "{amount}",
      },
    ],
  },
  {
    statement:
      "Services provided worth Rs.{amount} with Rs.{amount1} cash received and balance receivable after 3 months.",
    correctEntries: [
      {
        type: "Debit",
        particulars: "Cash A/c",
        debit: "{amount1}",
        credit: "",
      },
      {
        type: "Debit",
        particulars: "Debtors A/c",
        debit: "{amount2}",
        credit: "",
      },
      {
        type: "Credit",
        particulars: "Sales A/c",
        debit: "",
        credit: "{amount}",
      },
    ],
  },
];

const names = [
  "Kousalya",
  "Raghuram",
  "Vinay",
  "Raghu",
  "Raman",
  "Naveen",
  "Keshav",
  "Priya",
  "Arjun",
  "Sneha",
  "Rajesh",
  "Anita",
  "Vikram",
  "Deepa",
];

const companies = [
  "QuickEquip",
  "TechCorp",
  "FinancePlus",
  "BusinessHub",
  "ServiceMax",
  "ProSolutions",
  "EliteServices",
  "PrimeCorp",
  "ApexLtd",
  "MegaCorp",
];

// Generate random amount between min and max
function generateAmount(min = 1000, max = 100000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random name
function generateName() {
  return names[Math.floor(Math.random() * names.length)];
}

// Generate random company
function generateCompany() {
  return companies[Math.floor(Math.random() * companies.length)];
}

// Replace placeholders in template
function replacePlaceholders(template, values) {
  let result = template;
  Object.keys(values).forEach((key) => {
    const regex = new RegExp(`{${key}}`, "g");
    result = result.replace(regex, values[key]);
  });
  return result;
}

// Generate random simulation data
export function generateSimulationData(experimentNumber = 1) {
  const template =
    transactionTemplates[
      Math.floor(Math.random() * transactionTemplates.length)
    ];

  // Generate random values
  const amount = generateAmount();
  const amount1 = Math.floor(amount * 0.6); // 60% of main amount
  const amount2 = amount - amount1; // Remaining amount
  const total = amount * 2; // For investment scenarios

  const values = {
    amount: amount.toString(),
    amount1: amount1.toString(),
    amount2: amount2.toString(),
    total: total.toString(),
    name: generateName(),
    name1: generateName(),
    name2: generateName(),
    company: generateCompany(),
  };

  // Generate statement
  const statement = replacePlaceholders(template.statement, values);

  // Generate correct entries
  const correctEntries = template.correctEntries.map((entry) => ({
    id: Math.random().toString(36).substr(2, 9),
    date: "",
    type: entry.type,
    particulars: entry.particulars,
    debit: replacePlaceholders(entry.debit, values),
    credit: replacePlaceholders(entry.credit, values),
  }));

  return {
    experimentNumber,
    statement,
    correctEntries,
  };
}

// Generate multiple simulations for a chapter
export function generateMultipleSimulations(count = 3) {
  const simulations = [];
  for (let i = 1; i <= count; i++) {
    simulations.push(generateSimulationData(i));
  }
  return simulations;
}

// Generate assessment questions
export function generateAssessmentQuestions() {
  const questionTemplates = [
    {
      question:
        "What financial element increased as a result of the investment made by the partners?",
      options: ["Assets & Liability", "Liabilities", "Asset", "Expenses"],
      correctAnswer: "Assets & Liability",
      explanation:
        "Investment increases both assets (cash/bank) and liabilities (capital)",
    },
    {
      question:
        "Which ledger should be recognized for the payment transaction?",
      options: ["Cash", "Bank", "Creditors", "Debtors"],
      correctAnswer: "Cash",
      explanation: "Cash payments are recorded in the Cash ledger",
    },
    {
      question:
        "What is the type of transaction for equipment purchase on credit?",
      options: ["Expense", "Asset", "Liability", "Income"],
      correctAnswer: "Asset",
      explanation:
        "Equipment purchase increases assets and creates a liability to creditors",
    },
    {
      question: "How should credit sales be recorded?",
      options: [
        "Debit Sales, Credit Cash",
        "Debit Debtors, Credit Sales",
        "Debit Cash, Credit Sales",
        "Debit Sales, Credit Debtors",
      ],
      correctAnswer: "Debit Debtors, Credit Sales",
      explanation: "Credit sales increase debtors (asset) and sales (income)",
    },
    {
      question: "What happens when salary advance is paid?",
      options: [
        "Expense increases",
        "Asset increases",
        "Liability increases",
        "Income increases",
      ],
      correctAnswer: "Asset increases",
      explanation:
        "Salary advance creates an asset (advance receivable) and reduces cash",
    },
  ];

  // Return random selection of questions
  const shuffled = questionTemplates.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).map((q, index) => ({
    id: `q${index + 1}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    type: "multiple_choice",
  }));
}

export default {
  generateSimulationData,
  generateMultipleSimulations,
  generateAssessmentQuestions,
};
