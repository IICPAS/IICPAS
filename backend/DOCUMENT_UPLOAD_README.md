# Individual Document & Image Upload Feature

## Overview

This feature allows individual users to upload documents (resumes, certificates, etc.) and profile images during registration. The files are saved directly to the user's record in the database. Users can also view and manage their uploaded files through a dedicated Documents tab.

## Backend Implementation

### 1. Database Schema Update

- Added `image` field to the `Individual` model in `backend/models/Individual.js`
- Added `document` field to the `Individual` model in `backend/models/Individual.js`
- Both fields store the file paths of uploaded files

### 2. File Upload Middleware

- Created `backend/middleware/individualUpload.js` for document uploads
- Created `backend/middleware/individualImageUpload.js` for image uploads
- Handles DOCX files and image files with validation
- File size limit: 5MB for both types
- Documents stored in `uploads/individual_docs/`
- Images stored in `uploads/individual_images/`

### 3. API Endpoints

#### Signup with Image and Document Upload

```
POST /api/v1/individual/signup
Content-Type: multipart/form-data

Body: FormData with:
- 'name' field containing user name
- 'email' field containing user email
- 'phone' field containing user phone
- 'password' field containing user password
- 'confirmPassword' field containing password confirmation
- 'image' field containing image file (optional)
- 'document' field containing .docx file (optional)
```

#### Upload Image

```
POST /api/v1/individual/upload-image
Content-Type: multipart/form-data

Body: FormData with:
- 'image' field containing image file
- 'email' field containing user email
```

#### Upload Document

```
POST /api/v1/individual/upload-document
Content-Type: multipart/form-data

Body: FormData with:
- 'document' field containing .docx file
- 'email' field containing user email
```

#### Get User Documents

```
POST /api/v1/individual/documents
Content-Type: application/json

Body: { "email": "user@example.com" }
```

#### Delete Image

```
DELETE /api/v1/individual/image
Content-Type: application/json

Body: { "email": "user@example.com" }
```

#### Delete Document

```
DELETE /api/v1/individual/document
Content-Type: application/json

Body: { "email": "user@example.com" }
```

### 4. Controller Functions

- `signup`: Handles user registration with optional image and document upload
- `uploadImage`: Handles image upload and saves path to user record
- `uploadDocument`: Handles document upload and saves path to user record
- `getUserDocuments`: Retrieves all user documents and images
- `deleteImage`: Removes image reference from user record
- `deleteDocument`: Removes document reference from user record

## Frontend Implementation

### 1. IndividualAuth.jsx Updates

- Added image upload section to signup form
- Added document upload section to signup form
- File validation for both image and document formats
- Single form submission handles both user registration and file uploads
- Success/error notifications

### 2. IndividualProfile.jsx Updates

- Added Documents tab to view all uploaded files
- Grid layout displaying documents and images
- View and download functionality for each file
- Visual indicators for file types (image vs document)

### 3. DocumentManager Component

- Standalone component for document management after registration
- Accepts `email` as a prop
- Upload, download, and delete functionality
- Can be integrated into personal dashboard

## File Storage

- Documents are stored in `uploads/individual_docs/`
- Images are stored in `uploads/individual_images/`
- Files are accessible via: `http://localhost:8080/uploads/[type]/filename`
- Static file serving is configured in `backend/index.js`

## Security Features

- File type validation (DOCX for documents, images for profile pictures)
- File size limits (5MB for both types)
- Email-based user identification
- Unique file naming to prevent conflicts

## Usage Examples

### Signup with Image and Document

```javascript
const formData = new FormData();
formData.append("name", "John Doe");
formData.append("email", "john@example.com");
formData.append("phone", "1234567890");
formData.append("password", "password123");
formData.append("confirmPassword", "password123");
formData.append("image", imageFile); // Optional
formData.append("document", documentFile); // Optional

const response = await axios.post("/api/v1/individual/signup", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

### Upload Image

```javascript
const formData = new FormData();
formData.append("image", imageFile);
formData.append("email", "user@example.com");

const response = await axios.post("/api/v1/individual/upload-image", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

### Get User Documents

```javascript
const response = await axios.post("/api/v1/individual/documents", {
  email: "user@example.com",
});
```

### Download File

```javascript
const link = document.createElement("a");
link.href = `${API}/${filePath}`;
link.download = filename;
link.click();
```

## Error Handling

- Invalid file type: Returns error for unsupported file formats
- File too large: Returns error for files > 5MB
- No file uploaded: Returns error when no file is provided
- Email not provided: Returns error when email is missing
- User not found: Returns error when email doesn't match any user

## Component Usage

### Documents Tab

The Documents tab in IndividualProfile.jsx displays:

- Profile images with blue icon
- Documents with green icon
- File names and upload dates
- View and download actions for each file

### Signup Form Integration

The signup form now supports:

1. Basic user information (name, email, phone, password)
2. Optional profile image upload
3. Optional document upload
4. Single form submission for all data

## Database Structure

```javascript
// Individual Collection/Table
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  password: String (hashed),
  image: String, // File path: "uploads/individual_images/filename.jpg"
  document: String, // File path: "uploads/individual_docs/filename.docx"
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Future Enhancements

- Support for additional file formats (PDF, DOC)
- File compression
- Cloud storage integration
- Document versioning
- Document sharing capabilities
- Image cropping and resizing
- Multiple document uploads
