# Backend Audit Integration - Triostack Audit SDK

This document describes the backend-specific integration of the `triostack-audit-sdk` package into the IICPAS project.

## Changes Made

### 1. Removed Client-Side Integration

- ❌ Removed `client/src/components/AuditProvider.jsx`
- ❌ Uninstalled `triostack-audit-sdk` from client package.json
- ❌ Removed client-side audit tracking

### 2. Backend Integration

- ✅ Installed `triostack-audit-sdk` in backend
- ✅ Added audit middleware to `backend/index.js`
- ✅ Updated audit controller to handle new data format
- ✅ Updated audit model schema for new fields

### 3. New Data Structure

The audit system now tracks:

```javascript
{
  userId: "user@example.com",
  route: "/api/users",
  method: "GET",
  statusCode: 200,
  duration: 45,
  requestSize: 1024,
  responseSize: 2048,
  ip: "192.168.1.1",
  city: "New York",
  region: "NY",
  country: "United States",
  latitude: 40.7128,
  longitude: -74.0060,
  timestamp: "2024-08-27T16:09:00.000Z",
  sessionId: "550e8400-e29b-41d4-a716-446655440000",
  userAgent: "Mozilla/5.0...",
  event: "api_request",
  metadata: {}
}
```

### 4. Automatic Request Tracking

The middleware automatically tracks:

- All HTTP requests with timing
- Request/response sizes
- Status codes
- IP geolocation
- User agents
- Session tracking

### 5. Configuration

```javascript
const auditServer = createAuditServer({
  dbUrl: `${process.env.CLIENT_URL || "http://localhost:8080"}/api/audit/track`,
  userIdHeader: "x-user-id", // Custom header for user ID
  enableGeo: true,
  onError: (err) => console.error("Audit error:", err),
});
```

### 6. Enhanced Analytics

New analytics include:

- HTTP method distribution
- Status code distribution
- Request/response size metrics
- Geolocation data
- Event-based tracking

## Usage

### Automatic Tracking

All API requests are automatically tracked when the middleware is active.

### Manual Tracking

```javascript
await auditServer.track(req, {
  userId: "user@example.com",
  route: "/api/login",
  method: "POST",
  statusCode: 200,
  duration: 150,
  event: "user_login",
  metadata: {
    loginMethod: "email",
    success: true,
  },
});
```

### API Endpoints

- `GET /api/audit/stats` - Get audit statistics
- `GET /api/audit/activities` - Get audit activities
- `POST /api/audit/track` - Manual audit tracking
- `GET /api/audit/user/:userId/summary` - User activity summary
- `GET /api/audit/ip/:ip/summary` - IP activity summary

## Testing

Run the test script to verify integration:

```bash
node test-audit-integration.js
```

## Benefits

1. **Server-Side Only**: No client-side dependencies
2. **Automatic Tracking**: All requests tracked automatically
3. **Rich Data**: Comprehensive request/response data
4. **Geolocation**: IP-based location tracking
5. **Performance**: Non-blocking async logging
6. **Flexible**: Custom events and metadata support

## Migration Notes

- Client-side audit tracking has been completely removed
- All audit data is now collected server-side
- Enhanced data structure with new fields
- Improved analytics and reporting capabilities
