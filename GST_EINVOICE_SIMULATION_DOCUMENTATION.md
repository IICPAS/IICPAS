# GST E-Invoice Simulation System

## Overview

The GST E-Invoice Simulation System is a comprehensive educational platform that replicates the real-world GST e-invoice portal experience. It provides students with hands-on practice in creating, validating, and generating GST e-invoices with realistic scenarios and interactive learning features.

## Features

### 🎯 **Core Functionality**

- **Realistic Portal Interface**: Mimics the official e-Invoice 1 Portal design and workflow
- **Interactive Invoice Creation**: Step-by-step invoice generation with validation
- **Tax Calculation Engine**: Automatic CGST/SGST/IGST calculation based on transaction type
- **E-Invoice Generation**: Simulated IRN generation and QR code creation
- **Learning Progress Tracking**: Track student progress and performance
- **Multiple Difficulty Levels**: Beginner, Intermediate, and Advanced scenarios

### 📊 **Invoice Management**

1. **Supplier Details**: Business information, GSTIN validation, address details
2. **Recipient Details**: Customer information with B2B/B2C support
3. **Item Management**: HSN codes, quantities, tax rates, and calculations
4. **Tax Summary**: Comprehensive tax breakdown and totals
5. **E-Invoice Generation**: IRN, acknowledgment, and QR code simulation

### 🏷️ **Transaction Types**

1. **Intrastate**: CGST + SGST (same state transactions)
2. **Interstate**: IGST (different state transactions)
3. **B2B**: Business to Business with GSTIN validation
4. **B2C**: Business to Consumer (GSTIN optional)

## Backend Implementation

### Database Schema (`backend/models/GSTSimulation.js`)

```javascript
{
  // Basic Invoice Details
  invoiceNumber: String (auto-generated),
  invoiceDate: Date,
  dueDate: Date,

  // Supplier Details (Seller)
  supplier: {
    name: String (required),
    gstin: String (validated),
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String (validated),
      country: String (default: India)
    },
    contact: {
      phone: String,
      email: String (validated)
    }
  },

  // Recipient Details (Buyer)
  recipient: {
    name: String (required),
    gstin: String (optional for B2C),
    address: { /* same structure as supplier */ },
    contact: { /* same structure as supplier */ }
  },

  // Invoice Items
  items: [{
    itemName: String (required),
    description: String,
    hsnCode: String (4-8 digits),
    quantity: Number (min: 0.01),
    unit: String (enum: NOS, KGS, LTR, etc.),
    unitPrice: Number (min: 0),
    taxableAmount: Number (calculated),
    cgstRate: Number (0-100),
    sgstRate: Number (0-100),
    igstRate: Number (0-100),
    cessRate: Number (0-100),
    cgstAmount: Number (calculated),
    sgstAmount: Number (calculated),
    igstAmount: Number (calculated),
    cessAmount: Number (calculated),
    totalAmount: Number (calculated)
  }],

  // Tax Summary
  taxSummary: {
    totalTaxableAmount: Number,
    totalCgstAmount: Number,
    totalSgstAmount: Number,
    totalIgstAmount: Number,
    totalCessAmount: Number,
    totalTaxAmount: Number,
    grandTotal: Number
  },

  // E-Invoice Specific Fields
  einvoiceDetails: {
    irn: String, // Invoice Reference Number
    qrCode: String, // QR Code data
    ackNo: String, // Acknowledgment Number
    ackDate: Date,
    status: String (enum: DRAFT, GENERATED, CANCELLED, REJECTED)
  },

  // Simulation Configuration
  simulationConfig: {
    isSimulation: Boolean (default: true),
    difficulty: String (enum: BEGINNER, INTERMEDIATE, ADVANCED),
    hints: [{
      field: String,
      hint: String,
      order: Number
    }],
    validationRules: {
      requiredFields: [String],
      autoCalculate: Boolean,
      showErrors: Boolean
    }
  },

  // Learning Progress
  learningProgress: {
    completedSteps: [String],
    currentStep: String,
    score: Number (0-100),
    timeSpent: Number (minutes),
    attempts: Number
  }
}
```

### API Endpoints (`backend/routes/gstSimulationRoutes.js`)

#### GST Simulation Management

- `POST /api/gst-simulations` - Create new GST simulation
- `GET /api/gst-simulations` - Get all simulations with filtering
- `GET /api/gst-simulations/:id` - Get single simulation
- `PUT /api/gst-simulations/:id` - Update simulation
- `DELETE /api/gst-simulations/:id` - Delete simulation

#### Learning & Validation

- `PATCH /api/gst-simulations/:id/progress` - Update learning progress
- `POST /api/gst-simulations/:id/validate` - Validate specific fields
- `POST /api/gst-simulations/:id/generate-einvoice` - Generate e-invoice

#### Analytics

- `GET /api/gst-simulations/stats` - Get simulation statistics

### Controller Functions (`backend/controllers/gstSimulationController.js`)

#### Core Functions

- `createGSTSimulation` - Create new simulation with validation
- `getGSTSimulations` - Fetch simulations with pagination and filtering
- `getGSTSimulation` - Get single simulation details
- `updateGSTSimulation` - Update simulation data
- `deleteGSTSimulation` - Remove simulation

#### Learning Functions

- `updateLearningProgress` - Track student progress
- `validateGSTSimulation` - Field-specific validation
- `generateEInvoice` - Simulate e-invoice generation

#### Analytics Functions

- `getGSTSimulationStats` - Performance statistics

## Frontend Implementation

### Main Component (`client/src/app/components/GSTSimulation.tsx`)

#### Features

- **Portal-like Design**: Replicates e-Invoice 1 Portal interface
- **Step-by-step Workflow**: Supplier → Recipient → Items → Summary
- **Real-time Validation**: Instant feedback on form inputs
- **Tax Calculation**: Automatic tax computation based on transaction type
- **Progress Tracking**: Visual progress indicators
- **Responsive Design**: Works on desktop and mobile devices

#### Key Components

1. **Header**: Portal branding and progress indicator
2. **Navigation**: Step-by-step form navigation
3. **Supplier Form**: Business details and GSTIN validation
4. **Recipient Form**: Customer information
5. **Items Form**: Product details and tax calculations
6. **Summary**: Tax breakdown and e-invoice generation
7. **Result**: Generated e-invoice with IRN and QR code

### Page Integration (`client/src/app/gst-simulation/page.tsx`)

Simple page wrapper for the GST simulation component.

## Integration with Existing System

### Assignment/Case Study Integration

The GST simulation is integrated into the existing assignment and case study system:

#### Updated Models

- `Assignment.js` - Added "gst" type to simulation schema
- `CaseStudy.js` - Added "gst" type to simulation schema

#### New Configuration Options

```javascript
gstConfig: {
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
  hints: [{ field: String, hint: String, order: Number }],
  autoCalculate: Boolean,
  showErrors: Boolean
}
```

## Sample Data

### Sample Simulations (`backend/scripts/addSampleGSTSimulations.js`)

Three sample simulations with different difficulty levels:

1. **Beginner**: Interstate B2B transaction (Tech Solutions to ABC Manufacturing)
2. **Intermediate**: Interstate B2B transaction (Delhi Electronics to Mumbai Retail)
3. **Advanced**: Intrastate B2C transaction (Chennai Textiles to Individual Customer)

### Running Sample Data

```bash
cd backend
node scripts/addSampleGSTSimulations.js
```

## Usage Examples

### Creating a GST Simulation

```javascript
const simulationData = {
  chapterId: "chapter_id_here",
  supplier: {
    name: "Your Business Name",
    gstin: "22AAAAA0000A1Z5",
    address: {
      street: "123 Business Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
  },
  recipient: {
    name: "Customer Name",
    gstin: "29BBBBB0000B2Z6", // Optional for B2C
    address: {
      street: "456 Customer Street",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
    },
  },
  items: [
    {
      itemName: "Product Name",
      hsnCode: "1234",
      quantity: 1,
      unit: "NOS",
      unitPrice: 1000,
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 18,
    },
  ],
};

// POST /api/gst-simulations
const response = await fetch("/api/gst-simulations", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(simulationData),
});
```

### Validating GSTIN

```javascript
// POST /api/gst-simulations/:id/validate
const validation = await fetch(
  `/api/gst-simulations/${simulationId}/validate`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      field: "supplier.gstin",
      value: "22AAAAA0000A1Z5",
    }),
  }
);
```

### Generating E-Invoice

```javascript
// POST /api/gst-simulations/:id/generate-einvoice
const einvoice = await fetch(
  `/api/gst-simulations/${simulationId}/generate-einvoice`,
  {
    method: "POST",
  }
);
```

## Validation Rules

### GSTIN Validation

- Format: 2 digits (state code) + 10 characters (PAN) + 1 character (entity number) + 1 character (Z) + 1 character (checksum)
- Example: `22AAAAA0000A1Z5`

### HSN Code Validation

- Must be 4-8 digits
- Examples: `1234`, `12345678`

### Pincode Validation

- Must be 6 digits
- First digit cannot be 0
- Example: `400001`

### Email Validation

- Standard email format validation
- Example: `user@example.com`

## Tax Calculation Logic

### Interstate Transactions (Different States)

- IGST = Taxable Amount × IGST Rate
- CGST = 0
- SGST = 0

### Intrastate Transactions (Same State)

- CGST = Taxable Amount × (CGST Rate / 2)
- SGST = Taxable Amount × (SGST Rate / 2)
- IGST = 0

### CESS (if applicable)

- CESS = Taxable Amount × CESS Rate

## Learning Features

### Progress Tracking

- Step completion tracking
- Time spent monitoring
- Attempt counting
- Score calculation

### Hints System

- Field-specific hints
- Contextual help
- Progressive disclosure

### Difficulty Levels

- **Beginner**: Basic scenarios with extensive hints
- **Intermediate**: Moderate complexity with limited hints
- **Advanced**: Complex scenarios with minimal assistance

## Security & Permissions

### Role-based Access

- **Students**: Can create, update, and generate e-invoices
- **Teachers**: Can create and manage simulations
- **Admins**: Full CRUD access

### Data Validation

- Server-side validation for all inputs
- GSTIN format validation
- Business logic validation
- SQL injection prevention

## Performance Considerations

### Database Optimization

- Indexed fields for fast queries
- Efficient aggregation pipelines
- Pagination for large datasets

### Frontend Optimization

- Lazy loading of components
- Debounced validation
- Efficient state management

## Future Enhancements

### Planned Features

1. **E-Way Bill Integration**: Simulate e-way bill generation
2. **Multiple Currency Support**: International transactions
3. **Advanced Reporting**: Detailed analytics and reports
4. **Mobile App**: Native mobile application
5. **Offline Support**: Work without internet connection
6. **AI-powered Hints**: Intelligent assistance system
7. **Real-time Collaboration**: Multi-user editing
8. **Integration with Tally**: Direct data import/export

### API Enhancements

1. **Bulk Operations**: Multiple invoice processing
2. **Webhook Support**: Real-time notifications
3. **Rate Limiting**: API usage controls
4. **Caching**: Improved response times

## Troubleshooting

### Common Issues

#### GSTIN Validation Errors

- Ensure correct format: 15 characters
- Check state code (first 2 digits)
- Verify PAN format (characters 3-12)

#### Tax Calculation Issues

- Verify state selection for supplier and recipient
- Check tax rates are properly set
- Ensure quantity and unit price are positive

#### E-Invoice Generation Failures

- Complete all required fields
- Validate all GSTINs
- Ensure at least one item is added

### Debug Mode

Enable debug logging by setting environment variable:

```bash
DEBUG=gst-simulation:*
```

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintainer**: Development Team
