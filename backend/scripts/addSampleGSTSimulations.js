import mongoose from "mongoose";
import GSTSimulation from "../models/GSTSimulation.js";
import dotenv from "dotenv";

dotenv.config();

const addSampleGSTSimulations = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Sample GST Simulations
    const sampleSimulations = [
      {
        invoiceNumber: "INV20241201001",
        invoiceDate: new Date(),
        supplier: {
          name: "Tech Solutions Pvt Ltd",
          gstin: "22AAAAA0000A1Z5",
          address: {
            street: "123 Business Park, Sector 5",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            country: "India",
          },
          contact: {
            phone: "+91-9876543210",
            email: "info@techsolutions.com",
          },
        },
        recipient: {
          name: "ABC Manufacturing Ltd",
          gstin: "29BBBBB0000B2Z6",
          address: {
            street: "456 Industrial Area",
            city: "Bangalore",
            state: "Karnataka",
            pincode: "560001",
            country: "India",
          },
          contact: {
            phone: "+91-9876543211",
            email: "purchase@abcmanufacturing.com",
          },
        },
        items: [
          {
            itemName: "Laptop Computer",
            description: "Dell Inspiron 15 3000 Series",
            hsnCode: "8471",
            quantity: 5,
            unit: "NOS",
            unitPrice: 45000,
            taxableAmount: 225000,
            cgstRate: 0,
            sgstRate: 0,
            igstRate: 18,
            cessRate: 0,
            cgstAmount: 0,
            sgstAmount: 0,
            igstAmount: 40500,
            cessAmount: 0,
            totalAmount: 265500,
          },
          {
            itemName: "Office Chair",
            description: "Ergonomic Office Chair",
            hsnCode: "9401",
            quantity: 10,
            unit: "NOS",
            unitPrice: 8000,
            taxableAmount: 80000,
            cgstRate: 0,
            sgstRate: 0,
            igstRate: 18,
            cessRate: 0,
            cgstAmount: 0,
            sgstAmount: 0,
            igstAmount: 14400,
            cessAmount: 0,
            totalAmount: 94400,
          },
        ],
        taxSummary: {
          totalTaxableAmount: 305000,
          totalCgstAmount: 0,
          totalSgstAmount: 0,
          totalIgstAmount: 54900,
          totalCessAmount: 0,
          totalTaxAmount: 54900,
          grandTotal: 359900,
        },
        simulationConfig: {
          isSimulation: true,
          difficulty: "BEGINNER",
          hints: [
            {
              field: "supplier.gstin",
              hint: "GSTIN format: 2 digits (state code) + 10 characters (PAN) + 1 character (entity number) + 1 character (Z) + 1 character (checksum)",
              order: 1,
            },
            {
              field: "items.hsnCode",
              hint: "HSN code should be 4-8 digits. For computers use 8471, for furniture use 9401",
              order: 2,
            },
            {
              field: "taxRates",
              hint: "For interstate transactions, use IGST. For intrastate, use CGST + SGST (half rate each)",
              order: 3,
            },
          ],
          validationRules: {
            requiredFields: [
              "supplier.name",
              "supplier.gstin",
              "recipient.name",
              "items",
            ],
            autoCalculate: true,
            showErrors: true,
          },
        },
        learningProgress: {
          completedSteps: [],
          currentStep: "supplier_details",
          score: 0,
          timeSpent: 0,
          attempts: 0,
        },
        chapterId: new mongoose.Types.ObjectId(), // You'll need to replace with actual chapter ID
        createdBy: new mongoose.Types.ObjectId(), // You'll need to replace with actual user ID
      },
      {
        invoiceNumber: "INV20241201002",
        invoiceDate: new Date(),
        supplier: {
          name: "Delhi Electronics",
          gstin: "07CCCCC0000C3Z7",
          address: {
            street: "789 Nehru Place",
            city: "New Delhi",
            state: "Delhi",
            pincode: "110019",
            country: "India",
          },
          contact: {
            phone: "+91-9876543212",
            email: "sales@delhielectronics.com",
          },
        },
        recipient: {
          name: "Mumbai Retail Store",
          gstin: "27DDDDD0000D4Z8",
          address: {
            street: "321 Linking Road",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400050",
            country: "India",
          },
          contact: {
            phone: "+91-9876543213",
            email: "orders@mumbairetail.com",
          },
        },
        items: [
          {
            itemName: "Smartphone",
            description: "Samsung Galaxy S23",
            hsnCode: "8517",
            quantity: 20,
            unit: "NOS",
            unitPrice: 35000,
            taxableAmount: 700000,
            cgstRate: 0,
            sgstRate: 0,
            igstRate: 18,
            cessRate: 0,
            cgstAmount: 0,
            sgstAmount: 0,
            igstAmount: 126000,
            cessAmount: 0,
            totalAmount: 826000,
          },
        ],
        taxSummary: {
          totalTaxableAmount: 700000,
          totalCgstAmount: 0,
          totalSgstAmount: 0,
          totalIgstAmount: 126000,
          totalCessAmount: 0,
          totalTaxAmount: 126000,
          grandTotal: 826000,
        },
        simulationConfig: {
          isSimulation: true,
          difficulty: "INTERMEDIATE",
          hints: [
            {
              field: "recipient.gstin",
              hint: "For B2B transactions, recipient GSTIN is mandatory",
              order: 1,
            },
            {
              field: "items.hsnCode",
              hint: "For mobile phones, use HSN code 8517",
              order: 2,
            },
          ],
          validationRules: {
            requiredFields: [
              "supplier.name",
              "supplier.gstin",
              "recipient.name",
              "recipient.gstin",
              "items",
            ],
            autoCalculate: true,
            showErrors: true,
          },
        },
        learningProgress: {
          completedSteps: [],
          currentStep: "supplier_details",
          score: 0,
          timeSpent: 0,
          attempts: 0,
        },
        chapterId: new mongoose.Types.ObjectId(), // You'll need to replace with actual chapter ID
        createdBy: new mongoose.Types.ObjectId(), // You'll need to replace with actual user ID
      },
      {
        invoiceNumber: "INV20241201003",
        invoiceDate: new Date(),
        supplier: {
          name: "Chennai Textiles",
          gstin: "33EEEEE0000E5Z9",
          address: {
            street: "456 T. Nagar",
            city: "Chennai",
            state: "Tamil Nadu",
            pincode: "600017",
            country: "India",
          },
          contact: {
            phone: "+91-9876543214",
            email: "sales@chennaitextiles.com",
          },
        },
        recipient: {
          name: "Individual Customer",
          gstin: "", // B2C transaction
          address: {
            street: "123 Residential Area",
            city: "Chennai",
            state: "Tamil Nadu",
            pincode: "600001",
            country: "India",
          },
          contact: {
            phone: "+91-9876543215",
            email: "customer@email.com",
          },
        },
        items: [
          {
            itemName: "Cotton Shirt",
            description: "Men's Formal Cotton Shirt",
            hsnCode: "6205",
            quantity: 2,
            unit: "NOS",
            unitPrice: 1200,
            taxableAmount: 2400,
            cgstRate: 9,
            sgstRate: 9,
            igstRate: 0,
            cessRate: 0,
            cgstAmount: 216,
            sgstAmount: 216,
            igstAmount: 0,
            cessAmount: 0,
            totalAmount: 2832,
          },
          {
            itemName: "Cotton Trousers",
            description: "Men's Formal Cotton Trousers",
            hsnCode: "6203",
            quantity: 1,
            unit: "NOS",
            unitPrice: 1800,
            taxableAmount: 1800,
            cgstRate: 9,
            sgstRate: 9,
            igstRate: 0,
            cessRate: 0,
            cgstAmount: 162,
            sgstAmount: 162,
            igstAmount: 0,
            cessAmount: 0,
            totalAmount: 2124,
          },
        ],
        taxSummary: {
          totalTaxableAmount: 4200,
          totalCgstAmount: 378,
          totalSgstAmount: 378,
          totalIgstAmount: 0,
          totalCessAmount: 0,
          totalTaxAmount: 756,
          grandTotal: 4956,
        },
        simulationConfig: {
          isSimulation: true,
          difficulty: "ADVANCED",
          hints: [
            {
              field: "recipient.gstin",
              hint: "For B2C transactions, recipient GSTIN is optional",
              order: 1,
            },
            {
              field: "taxRates",
              hint: "For intrastate transactions, use CGST + SGST (half rate each)",
              order: 2,
            },
            {
              field: "items.hsnCode",
              hint: "For clothing items, use HSN codes 6203-6205",
              order: 3,
            },
          ],
          validationRules: {
            requiredFields: [
              "supplier.name",
              "supplier.gstin",
              "recipient.name",
              "items",
            ],
            autoCalculate: true,
            showErrors: true,
          },
        },
        learningProgress: {
          completedSteps: [],
          currentStep: "supplier_details",
          score: 0,
          timeSpent: 0,
          attempts: 0,
        },
        chapterId: new mongoose.Types.ObjectId(), // You'll need to replace with actual chapter ID
        createdBy: new mongoose.Types.ObjectId(), // You'll need to replace with actual user ID
      },
    ];

    // Clear existing simulations (optional)
    await GSTSimulation.deleteMany({});
    console.log("Cleared existing GST simulations");

    // Insert sample simulations
    const insertedSimulations = await GSTSimulation.insertMany(
      sampleSimulations
    );
    console.log(
      `Successfully added ${insertedSimulations.length} GST simulations`
    );

    // Display summary
    console.log("\n=== GST Simulations Added ===");
    insertedSimulations.forEach((sim, index) => {
      console.log(
        `${index + 1}. ${sim.invoiceNumber} - ${sim.supplier.name} to ${
          sim.recipient.name
        }`
      );
      console.log(`   Difficulty: ${sim.simulationConfig.difficulty}`);
      console.log(`   Items: ${sim.items.length}`);
      console.log(
        `   Total Amount: ₹${sim.taxSummary.grandTotal.toLocaleString()}`
      );
      console.log(
        `   Transaction Type: ${
          sim.supplier.address.state === sim.recipient.address.state
            ? "Intrastate"
            : "Interstate"
        }`
      );
      console.log("");
    });
  } catch (error) {
    console.error("Error adding sample GST simulations:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
addSampleGSTSimulations();
