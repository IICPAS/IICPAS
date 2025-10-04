# GST Simulations Portal Documentation

## 🎯 Overview

The GST Simulations Portal is a comprehensive educational platform that replicates the official GST portal experience, helping students learn GST compliance, return filing, e-invoice generation, and other GST-related procedures through hands-on practice with realistic scenarios.

## 🚀 Features

### **Core Simulations**

1. **GSTR-1A Return Filing**

   - Amendment of outward supplies for current tax period
   - 12 record detail categories matching official portal
   - Interactive grid with completion tracking
   - File Returns section with period selection

2. **GSTR-3B Return Filing**

   - Monthly summary return with tax payment
   - Tax liability calculations
   - Input Tax Credit reversal tracking
   - Comprehensive return filing process

3. **E-Invoice Portal**

   - Complete invoice generation with IRN
   - QR code generation
   - Bulk upload functionality
   - Search and download features

4. **E-Way Bill**

   - E-way bill generation for transportation
   - Distance calculation
   - Location tracking
   - Bill management features

5. **GST Registration**

   - Complete registration process
   - Document upload workflow
   - Verification and GSTIN generation
   - Amendment process

6. **GST Search Portal**
   - Taxpayer search by GSTIN/PAN
   - Return status checking
   - Compliance verification
   - Certificate verification

### **Learning Features**

- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **Progress Tracking**: Score, time spent, attempts
- **Hints System**: Field-specific guidance
- **Real-time Validation**: GSTIN, HSN code validation
- **Statistics**: Performance analytics and completion rates

## 🏗️ Architecture

### **Frontend Structure**

```
client/src/app/gst-simulations/
├── page.tsx                    # Main dashboard
├── gstr-1a/
│   └── page.tsx               # GSTR-1A simulation
├── gstr-3b/
│   └── page.tsx               # GSTR-3B simulation
├── einvoice/
│   └── page.tsx               # E-Invoice simulation
├── eway-bill/
│   └── page.tsx               # E-Way Bill simulation
├── registration/
│   └── page.tsx               # GST Registration simulation
└── search/
    └── page.tsx               # GST Search simulation
```

### **Components**

```
client/src/app/components/
├── GSTR1ASimulation.tsx       # GSTR-1A component
├── GSTR3BSimulation.tsx       # GSTR-3B component
├── EInvoiceSimulation.tsx     # E-Invoice component
├── EWayBillSimulation.tsx     # E-Way Bill component
├── GSTRegistrationSimulation.tsx # GST Registration component
└── GSTSearchSimulation.tsx    # GST Search component
```

### **Backend Structure**

```
backend/
├── models/
│   ├── GSTReturn.js           # GST Return model
│   └── GSTSimulation.js       # GST Simulation model
├── controllers/
│   └── gstReturnController.js # GST Return controller
├── routes/
│   └── gstReturnRoutes.js    # GST Return routes
└── scripts/
    └── seedGSTSimulationData.js # Sample data generator
```

## 📊 Database Schema

### **GST Return Schema**

```javascript
{
  // Basic Details
  returnType: String,           // GSTR-1A, GSTR-3B, etc.
  financialYear: String,       // 2024-25
  quarter: String,             // Quarter 1 (Apr - Jun)
  period: String,              // April
  gstin: String,               // GSTIN number

  // Record Details (GSTR-1A)
  recordDetails: {
    b2bInvoices: { count, taxableValue, taxAmount, isCompleted },
    b2cLargeInvoices: { count, taxableValue, taxAmount, isCompleted },
    exportInvoices: { count, taxableValue, taxAmount, isCompleted },
    b2cOthers: { count, taxableValue, taxAmount, isCompleted },
    nilRatedSupplies: { count, taxableValue, isCompleted },
    creditDebitNotesRegistered: { count, taxableValue, taxAmount, isCompleted },
    creditDebitNotesUnregistered: { count, taxableValue, taxAmount, isCompleted },
    taxLiabilityAdvances: { count, taxableValue, taxAmount, isCompleted },
    adjustmentAdvances: { count, taxableValue, taxAmount, isCompleted },
    hsnSummary: { count, taxableValue, taxAmount, isCompleted },
    documentsIssued: { count, taxableValue, taxAmount, isCompleted },
    ecoSupplies: { count, taxableValue, taxAmount, isCompleted }
  },

  // Tax Summary
  taxSummary: {
    totalTaxableValue: Number,
    totalCgstAmount: Number,
    totalSgstAmount: Number,
    totalIgstAmount: Number,
    totalCessAmount: Number,
    totalTaxAmount: Number,
    grandTotal: Number
  },

  // Return Status
  returnStatus: String,        // DRAFT, SUBMITTED, FILED, etc.
  filingDate: Date,
  acknowledgmentNumber: String,

  // Simulation Configuration
  simulationConfig: {
    isSimulation: Boolean,
    difficulty: String,         // BEGINNER, INTERMEDIATE, ADVANCED
    hints: [{ field, hint, order }],
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
    score: Number,             // 0-100
    timeSpent: Number,         // minutes
    attempts: Number
  }
}
```

## 🔌 API Endpoints

### **GST Return Management**

```bash
# Create new GST return
POST /api/gst-returns
Content-Type: application/json

{
  "returnType": "GSTR-1A",
  "financialYear": "2024-25",
  "quarter": "Quarter 1 (Apr - Jun)",
  "period": "April",
  "gstin": "07GDLCF7228G1YK",
  "simulationConfig": {
    "difficulty": "INTERMEDIATE",
    "hints": [],
    "validationRules": {
      "requiredFields": ["gstin", "financialYear", "quarter", "period"]
    }
  }
}

# Get all GST returns
GET /api/gst-returns?returnType=GSTR-1A&difficulty=INTERMEDIATE&page=1&limit=10

# Get single GST return
GET /api/gst-returns/:id

# Update GST return
PUT /api/gst-returns/:id
Content-Type: application/json

{
  "recordDetails": { ... },
  "taxSummary": { ... },
  "returnStatus": "SUBMITTED"
}

# Delete GST return
DELETE /api/gst-returns/:id
```

### **Learning & Progress**

```bash
# Update learning progress
PATCH /api/gst-returns/:id/progress
Content-Type: application/json

{
  "completedSteps": ["record-details"],
  "currentStep": "tax-calculation",
  "score": 75,
  "timeSpent": 30,
  "attempts": 1
}

# Validate GST return
POST /api/gst-returns/:id/validate
Content-Type: application/json

{
  "field": "gstin",
  "value": "07GDLCF7228G1YK"
}

# Submit GST return
POST /api/gst-returns/:id/submit

# Get simulation statistics
GET /api/gst-returns/stats
```

## 🎮 Usage Guide

### **1. Accessing Simulations**

Navigate to `/gst-simulations` to access the main dashboard with all available simulations.

### **2. Starting a Simulation**

1. Click on any simulation card
2. Select difficulty level (Beginner/Intermediate/Advanced)
3. Click "Start Simulation"
4. Follow the step-by-step process

### **3. GSTR-1A Simulation**

1. **File Returns Section**: Select financial year, quarter, and period
2. **Record Details**: Complete all 12 record categories
3. **Start Experiment**: Click the blue "Start Experiment" button
4. **Progress Tracking**: Monitor completion status

### **4. E-Invoice Simulation**

1. **Dashboard**: View invoice statistics
2. **Invoice Creation**: Fill supplier and recipient details
3. **Add Items**: Add invoice items with HSN codes
4. **Tax Calculation**: Automatic CGST/SGST/IGST calculation
5. **Generate E-Invoice**: Create IRN and QR code

### **5. Learning Progress**

- **Score Tracking**: Monitor performance (0-100)
- **Time Spent**: Track learning duration
- **Attempts**: Count simulation attempts
- **Completed Steps**: Track progress through steps

## 🛠️ Development Setup

### **Prerequisites**

- Node.js 16+
- MongoDB
- npm or yarn

### **Installation**

```bash
# Clone repository
git clone <repository-url>
cd IICPAS

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

### **Environment Setup**

Create `.env` file in backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/iicpas
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### **Running the Application**

```bash
# Start backend server
cd backend
npm start

# Start frontend development server
cd client
npm run dev
```

### **Seeding Sample Data**

```bash
# Run sample data generator
cd backend
node scripts/seedGSTSimulationData.js
```

## 🧪 Testing

### **Manual Testing**

1. **GSTR-1A Simulation**:

   - Test all 12 record categories
   - Verify tax calculations
   - Check progress tracking

2. **E-Invoice Simulation**:

   - Test invoice creation
   - Verify GSTIN validation
   - Check IRN generation

3. **API Testing**:
   - Test all CRUD operations
   - Verify validation endpoints
   - Check progress tracking

### **Sample Test Cases**

```javascript
// Test GSTIN validation
const validGSTIN = "07GDLCF7228G1YK";
const invalidGSTIN = "123456789012345";

// Test tax calculation
const taxableAmount = 100000;
const cgstRate = 9;
const sgstRate = 9;
const expectedCGST = 9000;
const expectedSGST = 9000;
```

## 📈 Performance Considerations

### **Frontend Optimization**

- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Code Splitting**: Route-based code splitting

### **Backend Optimization**

- **Database Indexing**: Optimized queries
- **Caching**: Redis for frequently accessed data
- **Pagination**: Efficient data loading

### **Scalability**

- **Horizontal Scaling**: Multiple server instances
- **Database Sharding**: Partition data by user/region
- **CDN**: Static asset delivery

## 🔒 Security Features

### **Authentication**

- JWT-based authentication
- Role-based access control
- Session management

### **Data Validation**

- Input sanitization
- GSTIN format validation
- HSN code validation
- Tax calculation validation

### **API Security**

- Rate limiting
- CORS configuration
- Request validation
- Error handling

## 🚀 Deployment

### **Production Build**

```bash
# Build frontend
cd client
npm run build

# Start production server
cd backend
npm start
```

### **Docker Deployment**

```dockerfile
# Dockerfile for backend
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### **Environment Variables**

```env
NODE_ENV=production
MONGODB_URI=mongodb://production-db:27017/iicpas
JWT_SECRET=production_jwt_secret
CLIENT_URL=https://your-domain.com
```

## 📚 Learning Resources

### **GST Documentation**

- [GST Portal Official](https://www.gst.gov.in/)
- [E-Invoice Portal](https://einvoice1.gst.gov.in/)
- [E-Way Bill Portal](https://ewaybillgst.gov.in/)

### **Technical Documentation**

- [React Documentation](https://reactjs.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

### **Development Guidelines**

1. Follow ESLint configuration
2. Write comprehensive tests
3. Document new features
4. Follow Git flow

### **Code Style**

- Use TypeScript for type safety
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic

## 📞 Support

For technical support or questions:

- **Email**: support@iicpa.in
- **Documentation**: [Internal Wiki]
- **Issues**: [GitHub Issues]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Maintainer**: IICPA Development Team
