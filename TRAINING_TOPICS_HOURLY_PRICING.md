# Training Topics Hourly Pricing Implementation

## Overview

This document outlines the changes made to implement hourly pricing for training topics instead of fixed pricing.

## Changes Made

### Backend Changes

#### 1. Model Updates (`backend/models/Trainings/TopicsTraining.js`)

- Added `pricePerHour` field to the schema
- Kept `price` field for backward compatibility
- Both fields are required

#### 2. Controller Updates (`backend/controllers/Topics/TopicControllers.js`)

- Updated `createTopic` function to handle `pricePerHour` field
- Added validation for positive hourly pricing
- Set `price` field to `pricePerHour` value for backward compatibility

#### 3. Migration Script (`backend/scripts/migrateTrainingTopicsToHourly.js`)

- Created migration script to update existing training topics
- Sets `pricePerHour` to existing `price` value for all topics
- Maintains backward compatibility

### Frontend Changes

#### 1. Admin Dashboard Forms

- **TopicsManager.jsx**: Updated form to include `pricePerHour` field
- **EditTopics.jsx**: Updated edit form to handle hourly pricing
- **ViewTrainingsTab.jsx**: Updated display to show "Price/Hour" and hourly rates

#### 2. Booking Forms

- **College Dashboard (BookingTab.jsx)**: Updated to show hourly pricing and calculate total
- **Company Dashboard (ScheduleBookingTab.jsx)**: Updated to show hourly pricing and calculate total
- **Personal Dashboard (BookingCalendar.jsx)**: Updated to show hourly pricing and calculate total

#### 3. Payment Calculation

- All booking forms now calculate total price as: `pricePerHour × hours`
- Payment orders are created with the calculated total price

## Database Schema

```javascript
{
  title: String (required),
  description: String (required),
  price: Number (required, for backward compatibility),
  pricePerHour: Number (required, new hourly pricing),
  status: String (enum: ["active", "inactive"], default: "active")
}
```

## API Endpoints

All existing endpoints remain unchanged:

- `GET /api/v1/topics-trainings` - List all topics
- `POST /api/v1/topics-trainings` - Create new topic (now requires `pricePerHour`)
- `PUT /api/v1/topics-trainings/:id` - Update topic
- `DELETE /api/v1/topics-trainings/:id` - Delete topic
- `PUT /api/v1/topics-trainings/:id/toggle-status` - Toggle status

## Migration

The migration script has been run and existing data has been updated:

- All existing training topics now have `pricePerHour` field
- Existing `price` values have been copied to `pricePerHour`
- Backward compatibility is maintained

## User Experience Changes

### Admin Dashboard

- Form fields now show "Price per Hour (₹)" instead of "Price (₹)"
- Table header shows "Price/Hour" instead of "Price"
- Price display shows "₹X/hour" format

### Booking Forms

- Price display shows both hourly rate and total calculation
- Format: "Price per Hour: ₹X" and "Total for Y hour(s): ₹Z"
- Payment calculation automatically uses hourly rate × hours

## Validation

- `pricePerHour` must be greater than 0
- All required fields (title, description, pricePerHour) must be provided
- Hours field in booking forms must be between 1-8 hours

## Backward Compatibility

- Existing `price` field is maintained for any legacy integrations
- API responses include both `price` and `pricePerHour` fields
- Existing booking data remains unchanged
