# GST E-Invoice Simulation System

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

### 3. Access the Simulation

Navigate to: `http://localhost:3000/gst-simulation`

## 📋 Features

### ✅ **Core Functionality**

- **Realistic Portal Interface** - Mimics official e-Invoice 1 Portal
- **Step-by-step Workflow** - Supplier → Recipient → Items → Summary
- **Real-time Validation** - GSTIN, HSN codes, tax calculations
- **Tax Calculation Engine** - Automatic CGST/SGST/IGST based on transaction type
- **E-Invoice Generation** - Simulated IRN and QR code creation
- **Learning Progress Tracking** - Track student performance and time spent

### 🎯 **Transaction Types**

- **B2B (Business to Business)** - GSTIN required for both parties
- **B2C (Business to Consumer)** - GSTIN optional for recipient
- **Intrastate** - Same state (CGST + SGST)
- **Interstate** - Different states (IGST)

### 📊 **Tax Rates**

- **0%** - Essential goods
- **5%** - Common use items
- **12%** - Standard rate items
- **18%** - Most goods and services
- **28%** - Luxury items

## 🛠️ API Endpoints

### GST Simulation Management

```bash
# Create new simulation
POST /api/gst-simulations
Content-Type: application/json

{
  "chapterId": "chapter_id_here",
  "supplier": {
    "name": "Your Business Name",
    "gstin": "22AAAAA0000A1Z5",
    "address": {
      "street": "123 Business Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    }
  },
  "recipient": {
    "name": "Customer Name",
    "gstin": "29BBBBB0000B2Z6",
    "address": {
      "street": "456 Customer Street",
      "city": "Bangalore",
      "state": "Karnataka",
      "pincode": "560001"
    }
  },
  "items": [{
    "itemName": "Product Name",
    "hsnCode": "1234",
    "quantity": 1,
    "unit": "NOS",
    "unitPrice": 1000,
    "cgstRate": 9,
    "sgstRate": 9,
    "igstRate": 18
  }]
}
```

```bash
# Get all simulations
GET /api/gst-simulations?page=1&limit=10&difficulty=BEGINNER

# Get single simulation
GET /api/gst-simulations/:id

# Update simulation
PUT /api/gst-simulations/:id

# Delete simulation
DELETE /api/gst-simulations/:id
```

### Learning & Validation

```bash
# Update learning progress
PATCH /api/gst-simulations/:id/progress
{
  "completedSteps": ["supplier_details", "recipient_details"],
  "currentStep": "items",
  "score": 85,
  "timeSpent": 15,
  "attempts": 2
}

# Validate specific field
POST /api/gst-simulations/:id/validate
{
  "field": "supplier.gstin",
  "value": "22AAAAA0000A1Z5"
}

# Generate e-invoice
POST /api/gst-simulations/:id/generate-einvoice
```

### Analytics

```bash
# Get simulation statistics
GET /api/gst-simulations/stats?chapterId=xxx&createdBy=xxx
```

## 🧪 Testing

### Run Test Suite

```bash
cd backend
node scripts/testGSTSimulation.js
```

### Add Sample Data

```bash
cd backend
node scripts/addSampleGSTSimulations.js
```

## 📚 Usage Examples

### 1. Basic B2B Interstate Transaction

```javascript
const simulationData = {
  supplier: {
    name: "Tech Solutions Pvt Ltd",
    gstin: "22AAAAA0000A1Z5", // Maharashtra
    address: { state: "Maharashtra", pincode: "400001" },
  },
  recipient: {
    name: "ABC Manufacturing Ltd",
    gstin: "29BBBBB0000B2Z6", // Karnataka
    address: { state: "Karnataka", pincode: "560001" },
  },
  items: [
    {
      itemName: "Laptop Computer",
      hsnCode: "8471",
      quantity: 5,
      unitPrice: 45000,
      igstRate: 18, // Interstate = IGST
    },
  ],
};
```

### 2. B2C Intrastate Transaction

```javascript
const simulationData = {
  supplier: {
    name: "Chennai Textiles",
    gstin: "33EEEEE0000E5Z9", // Tamil Nadu
    address: { state: "Tamil Nadu", pincode: "600017" },
  },
  recipient: {
    name: "Individual Customer",
    gstin: "", // B2C - GSTIN optional
    address: { state: "Tamil Nadu", pincode: "600001" },
  },
  items: [
    {
      itemName: "Cotton Shirt",
      hsnCode: "6205",
      quantity: 2,
      unitPrice: 1200,
      cgstRate: 9, // Intrastate = CGST + SGST
      sgstRate: 9,
    },
  ],
};
```

## 🔍 Validation Rules

### GSTIN Format

- **Pattern**: `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`
- **Structure**: 2 digits (state) + 10 chars (PAN) + 1 char (entity) + 1 char (Z) + 1 char (checksum)
- **Example**: `22AAAAA0000A1Z5`

### HSN Code

- **Length**: 4-8 digits
- **Examples**: `1234`, `12345678`

### Pincode

- **Pattern**: `^[1-9][0-9]{5}$`
- **Length**: 6 digits
- **First digit**: Cannot be 0
- **Example**: `400001`

## 🧮 Tax Calculation Logic

### Interstate Transactions (Different States)

```javascript
// IGST = Taxable Amount × IGST Rate
const igstAmount = (taxableAmount * igstRate) / 100;
const cgstAmount = 0;
const sgstAmount = 0;
```

### Intrastate Transactions (Same State)

```javascript
// CGST = Taxable Amount × (CGST Rate / 2)
// SGST = Taxable Amount × (SGST Rate / 2)
const cgstAmount = (taxableAmount * cgstRate) / 100;
const sgstAmount = (taxableAmount * sgstRate) / 100;
const igstAmount = 0;
```

### CESS (if applicable)

```javascript
const cessAmount = (taxableAmount * cessRate) / 100;
```

## 🎓 Learning Features

### Progress Tracking

- **Completed Steps**: Track which form sections are completed
- **Current Step**: Current position in the workflow
- **Score**: Performance score (0-100)
- **Time Spent**: Total time in minutes
- **Attempts**: Number of attempts made

### Difficulty Levels

- **BEGINNER**: Basic scenarios with extensive hints
- **INTERMEDIATE**: Moderate complexity with limited hints
- **ADVANCED**: Complex scenarios with minimal assistance

### Hints System

```javascript
{
  "field": "supplier.gstin",
  "hint": "GSTIN format: 2 digits (state code) + 10 characters (PAN) + 1 character (entity number) + 1 character (Z) + 1 character (checksum)",
  "order": 1
}
```

## 🔐 Security & Permissions

### Role-based Access

- **Students**: Create, update, generate e-invoices
- **Teachers**: Create and manage simulations
- **Admins**: Full CRUD access

### Data Validation

- Server-side validation for all inputs
- GSTIN format validation
- Business logic validation
- SQL injection prevention

## 📊 Database Schema

### GST Simulation Model

```javascript
{
  invoiceNumber: String (auto-generated),
  invoiceDate: Date,
  supplier: {
    name: String (required),
    gstin: String (validated),
    address: { street, city, state, pincode, country },
    contact: { phone, email }
  },
  recipient: {
    name: String (required),
    gstin: String (optional for B2C),
    address: { /* same as supplier */ },
    contact: { /* same as supplier */ }
  },
  items: [{
    itemName: String (required),
    hsnCode: String (4-8 digits),
    quantity: Number (min: 0.01),
    unit: String (enum),
    unitPrice: Number (min: 0),
    // Tax rates and calculated amounts
  }],
  taxSummary: {
    totalTaxableAmount: Number,
    totalCgstAmount: Number,
    totalSgstAmount: Number,
    totalIgstAmount: Number,
    totalCessAmount: Number,
    totalTaxAmount: Number,
    grandTotal: Number
  },
  einvoiceDetails: {
    irn: String,
    qrCode: String,
    ackNo: String,
    ackDate: Date,
    status: String (enum)
  },
  simulationConfig: {
    difficulty: String (enum),
    hints: Array,
    validationRules: Object
  },
  learningProgress: {
    completedSteps: Array,
    currentStep: String,
    score: Number,
    timeSpent: Number,
    attempts: Number
  }
}
```

## 🚨 Troubleshooting

### Common Issues

#### Import Errors

```bash
# If you see middleware import errors:
# Check the export format in middleware files
# Some use default export, others use named export
```

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

```bash
DEBUG=gst-simulation:* npm start
```

## 🔄 Integration with Existing System

### Assignment/Case Study Integration

The GST simulation is integrated into the existing assignment and case study system:

```javascript
// In Assignment or CaseStudy model
simulations: [{
  type: "gst", // New type added
  title: "GST E-Invoice Practice",
  config: {
    gstConfig: {
      difficulty: "BEGINNER",
      hints: [...],
      autoCalculate: true,
      showErrors: true
    }
  }
}]
```

## 📈 Performance Optimization

### Database

- Indexed fields for fast queries
- Efficient aggregation pipelines
- Pagination for large datasets

### Frontend

- Lazy loading of components
- Debounced validation
- Efficient state management

## 🚀 Future Enhancements

### Planned Features

1. **E-Way Bill Integration** - Simulate e-way bill generation
2. **Multiple Currency Support** - International transactions
3. **Advanced Reporting** - Detailed analytics and reports
4. **Mobile App** - Native mobile application
5. **Offline Support** - Work without internet connection
6. **AI-powered Hints** - Intelligent assistance system
7. **Real-time Collaboration** - Multi-user editing
8. **Integration with Tally** - Direct data import/export

### API Enhancements

1. **Bulk Operations** - Multiple invoice processing
2. **Webhook Support** - Real-time notifications
3. **Rate Limiting** - API usage controls
4. **Caching** - Improved response times

## 📞 Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintainer**: Development Team
