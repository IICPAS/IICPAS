# Assignment Routes Summary

## Overview

This document summarizes all the available routes for managing assignments in the IICPA backend API.

## Base Route

```
/api/assignments
```

## Available Routes

### 1. Get All Assignments

- **Route**: `GET /api/assignments`
- **Description**: Retrieves all assignments with pagination, search, and sorting
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `search` (optional): Search in title and description
  - `sortBy` (optional): Sort field (default: 'createdAt')
  - `sortOrder` (optional): Sort direction 'asc' or 'desc' (default: 'desc')
- **Response**: List of assignments with pagination info

### 2. Get Assignments by Status

- **Route**: `GET /api/assignments/status/:status`
- **Description**: Retrieves assignments filtered by active/inactive status
- **Path Parameters**:
  - `status`: Either 'active' or 'inactive'
- **Query Parameters**: Same as Get All Assignments
- **Response**: Filtered assignments with pagination

### 3. Get Assignments with Advanced Filtering

- **Route**: `GET /api/assignments/filter`
- **Description**: Advanced filtering with multiple criteria
- **Query Parameters**:
  - All basic parameters (page, limit, search, sortBy, sortOrder)
  - `startDate`: Filter assignments created after this date
  - `endDate`: Filter assignments created before this date
  - `hasVideo`: Filter assignments with video content (true/false)
  - `hasSimulation`: Filter assignments with simulations (true/false)
  - `hasQuestions`: Filter assignments with question sets (true/false)
  - `minTasks`: Minimum number of tasks required
  - `maxTasks`: Maximum number of tasks allowed
- **Response**: Filtered assignments with applied filters info

### 4. Get Assignments by Chapter

- **Route**: `GET /api/assignments/chapter/:chapterId`
- **Description**: Retrieves all assignments for a specific chapter
- **Path Parameters**:
  - `chapterId`: ID of the chapter
- **Response**: List of assignments for the specified chapter

### 5. Get Single Assignment

- **Route**: `GET /api/assignments/:id`
- **Description**: Retrieves a specific assignment by ID
- **Path Parameters**:
  - `id`: Assignment ID
- **Response**: Single assignment details

### 6. Create New Assignment

- **Route**: `POST /api/assignments`
- **Description**: Creates a new assignment
- **Body Parameters**:
  - `title`: Assignment title
  - `description`: Assignment description
  - `chapterId`: ID of the chapter
  - `tasks`: Array of task objects
  - `content`: Array of content objects
  - `simulations`: Array of simulation objects
  - `questionSets`: Array of question set objects
- **Response**: Created assignment

### 7. Update Assignment

- **Route**: `PUT /api/assignments/:id`
- **Description**: Updates an existing assignment
- **Path Parameters**:
  - `id`: Assignment ID
- **Body Parameters**: Same as create, but all fields optional
- **Response**: Updated assignment

### 8. Delete Assignment

- **Route**: `DELETE /api/assignments/:id`
- **Description**: Deletes an assignment
- **Path Parameters**:
  - `id`: Assignment ID
- **Response**: Success confirmation

### 9. Add Task to Assignment

- **Route**: `POST /api/assignments/:id/tasks`
- **Description**: Adds a new task to an existing assignment
- **Path Parameters**:
  - `id`: Assignment ID
- **Body Parameters**:
  - `taskName`: Name of the task
  - `instructions`: Task instructions
- **Response**: Updated assignment with new task

### 10. Add Content to Assignment

- **Route**: `POST /api/assignments/:id/content`
- **Description**: Adds new content to an existing assignment
- **Path Parameters**:
  - `id`: Assignment ID
- **Body Parameters**:
  - `type`: Content type ('text', 'rich', 'video')
  - `videoBase64`: Base64 encoded video (if type is 'video')
  - `textContent`: Plain text content (if type is 'text')
  - `richTextContent`: Rich text content (if type is 'rich')
- **Response**: Updated assignment with new content

### 11. Add Simulation to Assignment

- **Route**: `POST /api/assignments/:id/simulations`
- **Description**: Adds a new simulation to an existing assignment
- **Path Parameters**:
  - `id`: Assignment ID
- **Body Parameters**:
  - `type`: Simulation type
  - `title`: Simulation title
  - `description`: Simulation description
  - `config`: Simulation configuration object
  - `isOptional`: Whether simulation is optional
- **Response**: Updated assignment with new simulation

### 12. Add Question Set to Assignment

- **Route**: `POST /api/assignments/:id/question-sets`
- **Description**: Adds a new question set to an existing assignment
- **Path Parameters**:
  - `id`: Assignment ID
- **Body Parameters**:
  - `name`: Question set name
  - `description`: Question set description
  - `excelBase64`: Base64 encoded Excel file
  - `questions`: Array of question objects
  - `totalQuestions`: Total number of questions
  - `timeLimit`: Time limit for the question set
  - `passingScore`: Minimum passing score
- **Response**: Updated assignment with new question set

## Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "data": [...], // or single object
  "pagination": { // if applicable
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  },
  "filters": { // for advanced filtering
    "search": "query",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }
}
```

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

## Usage Examples

### Get all assignments with pagination

```bash
GET /api/assignments?page=1&limit=20&sortBy=title&sortOrder=asc
```

### Search assignments

```bash
GET /api/assignments?search=accounting&page=1&limit=10
```

### Get active assignments only

```bash
GET /api/assignments/status/active?page=1&limit=15
```

### Advanced filtering

```bash
GET /api/assignments/filter?hasVideo=true&hasSimulation=true&startDate=2024-01-01&limit=25
```

### Get assignments for a specific chapter

```bash
GET /api/assignments/chapter/64f8a1b2c3d4e5f6a7b8c9d0
```

## Notes

- All routes support CORS and proper error handling
- Pagination is available for list endpoints
- Search is case-insensitive and supports partial matches
- Date filtering uses ISO date format (YYYY-MM-DD)
- All IDs should be valid MongoDB ObjectId format
- The `isActive` field is automatically managed for soft deletion
