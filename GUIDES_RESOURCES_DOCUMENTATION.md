# Guides & Resources Management System

## Overview
The Guides & Resources management system allows administrators to create, manage, and organize various types of resources for centers and staff. This system provides a comprehensive interface for managing documents, videos, templates, and external links.

## Features

### 🎯 **Core Functionality**
- **CRUD Operations**: Create, Read, Update, Delete guides
- **Category Management**: Organize resources by purpose (Marketing, Counselling, Sales, General)
- **Type Classification**: Support for documents, videos, templates, links, and training materials
- **Action Buttons**: Customizable buttons for different actions (Download, View, Watch, Visit, Start)
- **Status Management**: Active/Inactive status for each guide
- **Ordering System**: Control the display order of resources

### 📁 **Resource Types**
1. **Document**: PDFs, Word docs, presentations
2. **Video**: Training videos, promotional content
3. **Template**: Design templates, forms
4. **Link**: External websites, tools
5. **Training**: Educational materials

### 🏷️ **Categories**
1. **Marketing & Creative Resources**: Brochures, design templates, marketing guides
2. **For Counsellors & Sales Teams**: Scripts, admin kits, price lists
3. **Sales Resources**: Sales materials and tools
4. **General Resources**: Miscellaneous resources

## Backend Implementation

### Database Schema (`backend/models/Guide.js`)
```javascript
{
  title: String (required),
  description: String (required),
  category: String (enum: ["marketing", "counselling", "sales", "general"]),
  type: String (enum: ["document", "video", "template", "link", "training"]),
  icon: String (visual representation),
  fileUrl: String (for downloadable files),
  externalUrl: String (for external links),
  actionButtons: Array (custom action buttons),
  status: String (enum: ["active", "inactive"]),
  order: Number (display order),
  fileSize: Number (in bytes),
  fileType: String,
  downloads: Number (download count),
  views: Number (view count),
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints (`backend/routes/guideRoutes.js`)
- `GET /api/v1/guides` - Get all guides
- `GET /api/v1/guides/category/:category` - Get guides by category
- `GET /api/v1/guides/:id` - Get single guide
- `POST /api/v1/guides` - Create new guide
- `PUT /api/v1/guides/:id` - Update guide
- `DELETE /api/v1/guides/:id` - Delete guide
- `PUT /api/v1/guides/:id/toggle-status` - Toggle guide status
- `PUT /api/v1/guides/order/update` - Update guide order
- `PUT /api/v1/guides/:id/increment-downloads` - Increment download count
- `PUT /api/v1/guides/:id/increment-views` - Increment view count

### Controllers (`backend/controllers/guideController.js`)
- **getAllGuides**: Fetch all guides with sorting
- **getGuidesByCategory**: Filter guides by category
- **createGuide**: Create new guide with validation
- **updateGuide**: Update existing guide
- **deleteGuide**: Remove guide
- **toggleGuideStatus**: Toggle active/inactive status
- **updateGuideOrder**: Reorder guides
- **incrementDownloads/Views**: Track usage statistics

## Frontend Implementation

### Admin Dashboard Integration
- **Location**: `client/src/app/admin-dashboard/GuidesTab.jsx`
- **Navigation**: Added to admin sidebar as "Guides & Resources"
- **Permission**: Requires `canAccess("guides")` permission

### Key Components

#### 1. **GuidesTab Component**
- **State Management**: React hooks for guides, loading, form data
- **CRUD Operations**: Full create, read, update, delete functionality
- **Form Validation**: Required field validation and error handling
- **Modal Interface**: Popup form for adding/editing guides

#### 2. **Form Features**
- **Dynamic Action Buttons**: Add/remove custom action buttons
- **Icon Selection**: Choose from predefined icons
- **Category/Type Selection**: Dropdown menus for classification
- **URL Management**: Support for both file URLs and external links

#### 3. **Table Display**
- **Responsive Design**: Mobile-friendly table layout
- **Status Toggle**: Click to toggle active/inactive status
- **Action Buttons**: Edit and delete actions for each guide
- **Visual Indicators**: Icons, status badges, category labels

## Sample Data

The system comes with 11 pre-configured sample guides:

### Marketing & Creative Resources
1. **Student Brochure (All)** - Comprehensive student brochure
2. **Design Templates** - Professional design templates
3. **Video Templates** - Video templates for promotional content
4. **Digital Marketing Guide** - Complete digital marketing strategies
5. **Editing & Marketing Training** - Training videos for editing skills
6. **Online Photo Editor** - Professional photo editing tool

### For Counsellors & Sales Teams
1. **Admin Kit** - Complete administrative toolkit
2. **Script for Counselling** - Professional counselling scripts
3. **Price List** - Current pricing for all programs
4. **Training Videos** - Comprehensive staff training videos
5. **Lead Conversion Chart** - Lead conversion metrics and strategies

## Usage Instructions

### For Administrators

#### Adding a New Guide
1. Navigate to "Guides & Resources" in admin dashboard
2. Click "Add Guide" button
3. Fill in required fields:
   - **Title**: Name of the resource
   - **Description**: Brief description
   - **Category**: Select appropriate category
   - **Type**: Choose resource type
   - **Icon**: Select visual icon
4. Add URLs (File URL or External URL)
5. Configure action buttons as needed
6. Set order for display priority
7. Click "Create Guide"

#### Editing a Guide
1. Click the edit icon (pencil) next to any guide
2. Modify fields as needed
3. Click "Update Guide" to save changes

#### Managing Status
- Click the status badge to toggle between Active/Inactive
- Inactive guides won't be visible to centers

#### Deleting a Guide
1. Click the delete icon (trash) next to the guide
2. Confirm deletion in the popup dialog

### For Centers (Future Implementation)
- Centers will access guides through their dashboard
- Resources will be filtered by category and status
- Action buttons will provide direct access to resources
- Download/view statistics will be tracked

## Technical Details

### File Structure
```
backend/
├── models/Guide.js
├── controllers/guideController.js
├── routes/guideRoutes.js
└── scripts/addSampleGuides.js

client/src/app/admin-dashboard/
└── GuidesTab.jsx
```

### Dependencies
- **Backend**: Express.js, Mongoose, MongoDB
- **Frontend**: React, Axios, SweetAlert2, React Icons
- **Styling**: Tailwind CSS

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `NEXT_PUBLIC_API_BASE`: Frontend API base URL

## Future Enhancements

### Planned Features
1. **File Upload**: Direct file upload functionality
2. **Version Control**: Track changes and versions
3. **Search & Filter**: Advanced search capabilities
4. **Analytics Dashboard**: Usage statistics and insights
5. **Bulk Operations**: Import/export multiple guides
6. **Access Control**: Role-based access to specific guides
7. **Notifications**: Alert centers about new resources

### Integration Opportunities
- **Center Dashboard**: Display guides to centers
- **Mobile App**: Access guides on mobile devices
- **Email Integration**: Send guide updates via email
- **Analytics**: Track guide usage and effectiveness

## Security Considerations

### Data Validation
- Input sanitization for all form fields
- URL validation for external links
- File type restrictions for uploads
- XSS prevention in descriptions

### Access Control
- Permission-based access to admin features
- Role-based visibility for different guide categories
- Audit logging for guide modifications

### File Security
- Secure file storage and access
- Virus scanning for uploaded files
- Access token generation for secure downloads

## Troubleshooting

### Common Issues
1. **Guide not appearing**: Check if status is "Active"
2. **Action buttons not working**: Verify URLs are correct
3. **Permission denied**: Ensure user has proper permissions
4. **Form validation errors**: Check required fields

### Debug Steps
1. Check browser console for JavaScript errors
2. Verify API endpoints are accessible
3. Confirm database connection
4. Check user permissions and roles

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.
