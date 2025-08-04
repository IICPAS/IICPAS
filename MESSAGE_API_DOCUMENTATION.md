# Message API Documentation

This document outlines the message-related API endpoints that have been implemented for the LMS system.

## Base URL
```
http://localhost:8080/api/messages
```

## Message Model Schema

```javascript
{
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  adminReply: { type: String, default: null },
  adminRepliedAt: { type: Date, default: null },
  adminRepliedBy: { type: String, default: null },
  status: { type: String, enum: ['pending', 'replied'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
}
```

## Endpoints

### 1. Create Message

**POST** `/`

Creates a new message.

**Request Body:**

```json
{
  "email": "user@example.com",
  "phone": "1234567890",
  "message": "Your message content here"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "_id": "message_id",
    "email": "user@example.com",
    "phone": "1234567890",
    "message": "Your message content here",
    "createdAt": "2025-08-04T03:27:49.968Z"
  }
}
```

### 2. Get All Messages

**GET** `/all`

Returns all messages in the system (for admin purposes).

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "message_id",
      "email": "user@example.com",
      "phone": "1234567890",
      "message": "Your message content here",
      "createdAt": "2025-08-04T03:27:49.968Z"
    }
  ]
}
```

### 3. Get Messages by Email

**GET** `/by-email/:email`

Returns all messages for a specific user email.

**Parameters:**

- `email` (path parameter): User's email address

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "message_id",
      "email": "user@example.com",
      "phone": "1234567890",
      "message": "Your message content here",
      "createdAt": "2025-08-04T03:27:49.968Z"
    }
  ]
}
```

### 4. Get Message by ID

**GET** `/:id`

Returns a specific message by its ID.

**Parameters:**

- `id` (path parameter): Message ID

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "message_id",
    "email": "user@example.com",
    "phone": "1234567890",
    "message": "Your message content here",
    "createdAt": "2025-08-04T03:27:49.968Z"
  }
}
```

### 5. Admin Reply to Message

**PUT** `/admin-reply/:id`

Allows admins to reply to a user message.

**Parameters:**

- `id` (path parameter): Message ID

**Request Body:**

```json
{
  "adminReply": "Admin response message",
  "adminRepliedBy": "admin@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Admin reply sent successfully",
  "data": {
    "_id": "message_id",
    "email": "user@example.com",
    "phone": "1234567890",
    "message": "Your message content here",
    "adminReply": "Admin response message",
    "adminRepliedBy": "admin@example.com",
    "adminRepliedAt": "2025-08-04T03:34:26.266Z",
    "status": "replied",
    "createdAt": "2025-08-04T03:27:49.968Z"
  }
}
```

### 6. Delete Message

**DELETE** `/:id`

Deletes a specific message by its ID.

**Parameters:**

- `id` (path parameter): Message ID

**Response:**

```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

## Frontend Integration

The IndividualTicketRaiseAndList component has been updated to use messages instead of tickets:

### Key Changes:

1. **API Endpoints**: Changed from `/tickets` to `/messages`
2. **Form Fields**: Removed name field, kept email, phone, and message
3. **Functionality**: Simplified to focus on sending and viewing messages
4. **UI Updates**: Updated labels and icons to reflect message functionality
5. **Admin Reply**: Added admin reply functionality with status tracking

### Features:

- **Send Messages**: Users can send messages with their email, phone, and message content
- **View Message History**: Users can see all their sent messages
- **Message Details**: Click on any message to view full details
- **Real-time Updates**: Messages are fetched and displayed immediately after sending
- **Admin Reply System**: Admins can reply to user messages
- **Status Tracking**: Messages show pending/replied status
- **Admin Mode**: Special interface for admin users to reply to messages

### Admin Features:

- **Admin Detection**: Automatically detects admin users based on email
- **Reply Interface**: Admin-only reply form for pending messages
- **Status Management**: Updates message status when admin replies
- **Reply History**: Shows admin reply with timestamp and admin name

## Usage Examples

### Frontend Integration

```javascript
// Send a message
const sendMessage = async (email, phone, message) => {
  const res = await axios.post(`${API}/messages`, {
    email,
    phone,
    message,
  });
  return res.data;
};

// Fetch user's messages
const fetchUserMessages = async (email) => {
  const res = await axios.get(`${API}/messages/by-email/${email}`);
  return res.data.data;
};

// Admin reply to message
const adminReply = async (messageId, adminReply, adminRepliedBy) => {
  const res = await axios.put(`${API}/messages/admin-reply/${messageId}`, {
    adminReply,
    adminRepliedBy,
  });
  return res.data;
};
```

### Testing Endpoints

```bash
# Create a message
curl -X POST http://localhost:8080/api/messages \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","phone":"1234567890","message":"Test message"}'

# Get all messages
curl -X GET http://localhost:8080/api/messages/all

# Get messages by email
curl -X GET http://localhost:8080/api/messages/by-email/user@example.com

# Get specific message
curl -X GET http://localhost:8080/api/messages/message_id

# Admin reply to message
curl -X PUT http://localhost:8080/api/messages/admin-reply/message_id \
  -H "Content-Type: application/json" \
  -d '{"adminReply":"Thank you for your message","adminRepliedBy":"admin@example.com"}'

# Delete message
curl -X DELETE http://localhost:8080/api/messages/message_id
```

## Error Handling

All endpoints include proper error handling:

- 400 Bad Request: Missing required fields (email, phone, message, adminReply, adminRepliedBy)
- 404 Not Found: Message not found
- 500 Internal Server Error: Server-side errors

The frontend gracefully handles these errors and displays appropriate toast notifications.

## Migration from Tickets

The system has been migrated from tickets to messages:

- **Removed**: Ticket-specific fields like `name`, `resolve`, status tracking
- **Simplified**: Focus on basic messaging functionality
- **Enhanced**: Better error handling and user feedback
- **Maintained**: Same UI/UX patterns for consistency
- **Added**: Admin reply system with status tracking
