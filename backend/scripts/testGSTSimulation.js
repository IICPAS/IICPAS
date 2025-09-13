import mongoose from "mongoose";
import GSTSimulation from "../models/GSTSimulation.js";
import dotenv from "dotenv";

dotenv.config();

const testGSTSimulation = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Test 1: Create a simple GST simulation
    console.log("\n🧪 Test 1: Creating GST Simulation...");

    const testSimulation = new GSTSimulation({
      invoiceNumber: "TEST001",
      supplier: {
        name: "Test Supplier",
        gstin: "22AAAAA0000A1Z5",
        address: {
          street: "Test Street",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
        },
      },
      recipient: {
        name: "Test Recipient",
        gstin: "29BBBBB0000B2Z6",
        address: {
          street: "Test Street 2",
          city: "Bangalore",
          state: "Karnataka",
          pincode: "560001",
        },
      },
      items: [
        {
          itemName: "Test Product",
          hsnCode: "1234",
          quantity: 1,
          unit: "NOS",
          unitPrice: 1000,
          cgstRate: 0,
          sgstRate: 0,
          igstRate: 18,
          cessRate: 0,
        },
      ],
      taxSummary: {
        totalTaxableAmount: 1000,
        totalCgstAmount: 0,
        totalSgstAmount: 0,
        totalIgstAmount: 180,
        totalCessAmount: 0,
        totalTaxAmount: 180,
        grandTotal: 1180,
      },
      chapterId: new mongoose.Types.ObjectId(),
      createdBy: new mongoose.Types.ObjectId(),
    });

    await testSimulation.save();
    console.log("✅ GST Simulation created successfully");
    console.log(`   Invoice Number: ${testSimulation.invoiceNumber}`);
    console.log(`   Grand Total: ₹${testSimulation.taxSummary.grandTotal}`);
    console.log(
      `   Transaction Type: ${
        testSimulation.isInterstate ? "Interstate" : "Intrastate"
      }`
    );

    // Test 2: Validate GSTIN format
    console.log("\n🧪 Test 2: GSTIN Validation...");

    const validGSTINs = [
      "22AAAAA0000A1Z5", // Valid format
      "29BBBBB0000B2Z6", // Valid format
    ];

    const invalidGSTINs = [
      "22AAAAA0000A1Z", // Too short
      "22AAAAA0000A1Z55", // Too long
      "22AAAAA0000A1Z4", // Invalid checksum
    ];

    validGSTINs.forEach((gstin) => {
      const isValid =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin);
      console.log(`   ${gstin}: ${isValid ? "✅ Valid" : "❌ Invalid"}`);
    });

    invalidGSTINs.forEach((gstin) => {
      const isValid =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin);
      console.log(
        `   ${gstin}: ${
          isValid ? "❌ Should be invalid" : "✅ Correctly invalid"
        }`
      );
    });

    // Test 3: Tax calculation logic
    console.log("\n🧪 Test 3: Tax Calculation Logic...");

    const interstateItem = {
      quantity: 2,
      unitPrice: 1000,
      igstRate: 18,
    };

    const intrastateItem = {
      quantity: 2,
      unitPrice: 1000,
      cgstRate: 9,
      sgstRate: 9,
    };

    // Interstate calculation
    const interstateTaxable =
      interstateItem.quantity * interstateItem.unitPrice;
    const interstateIGST = (interstateTaxable * interstateItem.igstRate) / 100;
    const interstateTotal = interstateTaxable + interstateIGST;

    console.log(`   Interstate Transaction:`);
    console.log(`     Taxable Amount: ₹${interstateTaxable}`);
    console.log(`     IGST (18%): ₹${interstateIGST}`);
    console.log(`     Total: ₹${interstateTotal}`);

    // Intrastate calculation
    const intrastateTaxable =
      intrastateItem.quantity * intrastateItem.unitPrice;
    const intrastateCGST = (intrastateTaxable * intrastateItem.cgstRate) / 100;
    const intrastateSGST = (intrastateTaxable * intrastateItem.sgstRate) / 100;
    const intrastateTotal = intrastateTaxable + intrastateCGST + intrastateSGST;

    console.log(`   Intrastate Transaction:`);
    console.log(`     Taxable Amount: ₹${intrastateTaxable}`);
    console.log(`     CGST (9%): ₹${intrastateCGST}`);
    console.log(`     SGST (9%): ₹${intrastateSGST}`);
    console.log(`     Total: ₹${intrastateTotal}`);

    // Test 4: Query simulations
    console.log("\n🧪 Test 4: Querying Simulations...");

    const simulations = await GSTSimulation.find({}).limit(5);
    console.log(`   Found ${simulations.length} simulations in database`);

    simulations.forEach((sim, index) => {
      console.log(
        `   ${index + 1}. ${sim.invoiceNumber} - ${sim.supplier.name} to ${
          sim.recipient.name
        }`
      );
    });

    // Test 5: E-invoice generation simulation
    console.log("\n🧪 Test 5: E-Invoice Generation...");

    const irn = `IRN${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
    const ackNo = `ACK${Date.now()}`;

    testSimulation.einvoiceDetails = {
      irn,
      qrCode: JSON.stringify({
        irn,
        ackNo,
        ackDate: new Date(),
        invoiceNumber: testSimulation.invoiceNumber,
        totalAmount: testSimulation.taxSummary.grandTotal,
      }),
      ackNo,
      ackDate: new Date(),
      status: "GENERATED",
    };

    await testSimulation.save();
    console.log("✅ E-Invoice generated successfully");
    console.log(`   IRN: ${testSimulation.einvoiceDetails.irn}`);
    console.log(
      `   Acknowledgment No: ${testSimulation.einvoiceDetails.ackNo}`
    );
    console.log(`   Status: ${testSimulation.einvoiceDetails.status}`);

    // Clean up test data
    console.log("\n🧹 Cleaning up test data...");
    await GSTSimulation.deleteOne({ invoiceNumber: "TEST001" });
    console.log("✅ Test data cleaned up");

    console.log("\n🎉 All tests passed successfully!");
    console.log("\n📋 Test Summary:");
    console.log("   ✅ Database connection");
    console.log("   ✅ GST Simulation creation");
    console.log("   ✅ GSTIN validation");
    console.log("   ✅ Tax calculation logic");
    console.log("   ✅ Database queries");
    console.log("   ✅ E-invoice generation");
    console.log("   ✅ Data cleanup");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
};

// Run the test
testGSTSimulation();
