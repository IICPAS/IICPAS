# Kit Stock Management System

## Overview

The Kit Stock Management System allows administrators to manage inventory for various training modules and courses. This system provides comprehensive stock tracking for different delivery formats (Lab/Classroom, Recorded, and LabPlus/Live) with category-based organization and real-time statistics.

## Features

### 🎯 **Core Functionality**

- **CRUD Operations**: Create, Read, Update, Delete kits
- **Stock Management**: Track inventory across three formats (Lab, Recorded, Live)
- **Category Organization**: Organize kits by training categories
- **Status Management**: Active/Inactive status for each kit
- **Statistics Dashboard**: Real-time stock analytics and insights
- **Filtering & Sorting**: Advanced filtering by category and sorting options

### 📊 **Stock Tracking**

1. **Lab (Classroom)**: Physical classroom training materials
2. **Recorded**: Pre-recorded course materials
3. **LabPlus (Live)**: Live online training resources

### 🏷️ **Categories**

1. **Accounting**: Tally, Zoho Books, Payroll, PF & ESI
2. **Excel**: Microsoft Excel training
3. **Taxation**: Income Tax, TDS, ITR Filing
4. **GST**: GST Computation and Return Filing
5. **Office Tools**: Word, PowerPoint, PowerBI
6. **Finance**: Financial Statements, Personal Finance, Stock Market
7. **Communication**: Job Readiness, Personality Development
8. **Other**: Miscellaneous training materials

## Backend Implementation

### Database Schema (`backend/models/Kit.js`)

```javascript
{
  module: String (required),
  labClassroom: Number (default: 0, min: 0),
  recorded: Number (default: 0, min: 0),
  labPlusLive: Number (default: 0, min: 0),
  description: String,
  category: String (enum: ["accounting", "excel", "taxation", "gst", "office", "finance", "communication", "other"]),
  status: String (enum: ["active", "inactive"], default: "active"),
  price: Number (default: 0),
  supplier: String,
  lastUpdated: Date (auto-updated),
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints (`backend/routes/kitRoutes.js`)

- `GET /api/v1/kits` - Get all kits
- `GET /api/v1/kits/category/:category` - Get kits by category
- `GET /api/v1/kits/:id` - Get single kit
- `POST /api/v1/kits` - Create new kit
- `PUT /api/v1/kits/:id` - Update kit
- `DELETE /api/v1/kits/:id` - Delete kit
- `PUT /api/v1/kits/:id/toggle-status` - Toggle kit status
- `PUT /api/v1/kits/:id/stock` - Update stock quantities
- `GET /api/v1/kits/low-stock` - Get low stock kits
- `GET /api/v1/kits/stats` - Get kit statistics

### Controllers (`backend/controllers/kitController.js`)

- **getAllKits**: Fetch all kits with sorting
- **getKitsByCategory**: Filter kits by category
- **createKit**: Create new kit with validation
- **updateKit**: Update existing kit
- **deleteKit**: Remove kit
- **toggleKitStatus**: Toggle active/inactive status
- **updateStock**: Update stock quantities
- **getLowStockKits**: Find kits with low stock (< 5)
- **getKitStats**: Get comprehensive statistics

## Frontend Implementation

### Admin Dashboard Integration

- **Location**: `client/src/app/admin-dashboard/KitsTab.jsx`
- **Navigation**: Added to admin sidebar as "Kit Stock"
- **Permission**: Accessible without strict permission checks

### Key Components

#### 1. **Statistics Dashboard**

- **Total Kits**: Count of all kits in the system
- **Active Kits**: Count of active kits
- **Low Stock**: Count of kits with stock < 5
- **Total Stock**: Sum of all stock across formats

#### 2. **Filtering & Sorting**

- **Category Filter**: Filter kits by training category
- **Sort Options**: Sort by module name, category, or total stock
- **Real-time Updates**: Filters apply instantly

#### 3. **Kit Management Form**

- **Module Information**: Name, description, category
- **Stock Quantities**: Separate inputs for each format
- **Additional Details**: Price, supplier information
- **Validation**: Required fields and duplicate prevention

#### 4. **Stock Status Indicators**

- **Out of Stock**: Red indicator for zero stock
- **Low Stock**: Orange indicator for < 5 items
- **Good Stock**: Green indicator for adequate stock

## Sample Data

The system comes with 21 pre-configured sample kits:

### Accounting (5 kits)

- Basic Accounting & Tally Foundation
- Payroll or Salary Statement
- Tally Advanced
- PF & ESI Return Filing
- Zoho Books

### Taxation (5 kits)

- Income Tax Computation
- TDS Computation
- ITR Filing (Individual)
- TDS Return Filing
- Business Taxation

### GST (2 kits)

- GST Computation
- GST Return Filing

### Finance (3 kits)

- Financial Statements & MIS
- Personal Finance & Literacy
- Stock Market

### Office Tools (3 kits)

- Microsoft Word
- Microsoft PowerPoint
- PowerBI

### Communication (2 kits)

- Job Readiness Program
- Communication Skills and Personality Development

### Excel (1 kit)

- Microsoft Excel

## Usage Instructions

### For Administrators

#### Adding a New Kit

1. Navigate to "Kit Stock" in admin dashboard
2. Click "Add Kit" button
3. Fill in required fields:
   - **Module Name**: Name of the training module
   - **Category**: Select appropriate category
   - **Stock Quantities**: Set quantities for each format
   - **Price**: Set kit price
   - **Supplier**: Add supplier information
4. Add description (optional)
5. Click "Create Kit"

#### Managing Stock

- **Edit Kit**: Click edit icon to modify kit details
- **Update Stock**: Change quantities for any format
- **Toggle Status**: Click status badge to activate/deactivate
- **Delete Kit**: Remove kit with confirmation

#### Monitoring Stock

- **Statistics Cards**: View overview at the top
- **Low Stock Alerts**: Orange indicators show low stock
- **Category Filtering**: Filter by specific categories
- **Sorting**: Sort by different criteria

### Stock Management Features

#### Stock Status Tracking

- **Visual Indicators**: Color-coded stock levels
- **Low Stock Alerts**: Automatic detection of low inventory
- **Total Stock Calculation**: Automatic sum of all formats

#### Category Management

- **Organized Display**: Kits grouped by training category
- **Filter Options**: Quick filtering by category
- **Color Coding**: Each category has distinct colors

## Technical Details

### File Structure

```
backend/
├── models/Kit.js
├── controllers/kitController.js
├── routes/kitRoutes.js
└── scripts/addSampleKits.js

client/src/app/admin-dashboard/
└── KitsTab.jsx
```

### Dependencies

- **Backend**: Express.js, Mongoose, MongoDB
- **Frontend**: React, Axios, SweetAlert2, React Icons
- **Styling**: Tailwind CSS

### Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `NEXT_PUBLIC_API_URL`: Frontend API base URL

## Advanced Features

### Stock Analytics

- **Real-time Statistics**: Live updates of stock levels
- **Low Stock Monitoring**: Automatic detection and alerts
- **Category-wise Analysis**: Stock distribution by category
- **Trend Tracking**: Stock level changes over time

### Data Validation

- **Duplicate Prevention**: No duplicate module names
- **Stock Validation**: Non-negative stock quantities
- **Required Fields**: Module name is mandatory
- **Category Validation**: Predefined category options

### User Experience

- **Responsive Design**: Mobile-friendly interface
- **Loading States**: Spinner during API calls
- **Error Handling**: Comprehensive error messages
- **Success Feedback**: Confirmation messages for actions

## Future Enhancements

### Planned Features

1. **Stock Alerts**: Email notifications for low stock
2. **Bulk Operations**: Import/export multiple kits
3. **Stock History**: Track stock changes over time
4. **Supplier Management**: Dedicated supplier database
5. **Order Management**: Integration with ordering system
6. **Reports**: Detailed stock reports and analytics
7. **Barcode Integration**: QR code generation for kits
8. **Mobile App**: Kit management on mobile devices

### Integration Opportunities

- **Order System**: Connect with kit ordering
- **Inventory Management**: Advanced inventory tracking
- **Supplier Portal**: Direct supplier access
- **Analytics Dashboard**: Advanced reporting
- **Notification System**: Automated alerts

## Security Considerations

### Data Validation

- Input sanitization for all form fields
- Stock quantity validation (non-negative)
- Category validation against predefined list
- Duplicate module name prevention

### Access Control

- Admin-only access to kit management
- Role-based permissions for different operations
- Audit logging for stock changes

### Data Integrity

- Automatic timestamp updates
- Stock quantity constraints
- Status validation

## Troubleshooting

### Common Issues

1. **Kit not appearing**: Check if status is "Active"
2. **Stock not updating**: Verify API connection
3. **Duplicate module error**: Module name must be unique
4. **Permission denied**: Ensure admin access

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify API endpoints are accessible
3. Confirm database connection
4. Check user permissions and roles

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.
