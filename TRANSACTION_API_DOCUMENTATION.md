# Transaction API Documentation

This document outlines the transaction-related API endpoints that have been implemented for the LMS system.

## Base URL
```
http://localhost:8080/api/payments
```

## Endpoints

### 1. Get All Transactions
**GET** `/all-transactions`

Returns all transactions in the system (for admin purposes).

**Response:**
```json
[
  {
    "_id": "transaction_id",
    "email": "user@example.com",
    "amount": 1000,
    "for": "Training Title",
    "razorpay_order_id": "order_xxx",
    "razorpay_payment_id": "pay_xxx",
    "bookingId": "booking_id",
    "status": "success",
    "receiptLink": "/uploads/receipts/receipt_xxx.pdf",
    "createdAt": "2025-08-03T17:54:49.858Z"
  }
]
```

### 2. Get Transactions by Email
**GET** `/transactions-by-email/:email`

Returns all transactions for a specific user email.

**Parameters:**
- `email` (path parameter): User's email address

**Response:**
```json
[
  {
    "_id": "transaction_id",
    "email": "user@example.com",
    "amount": 1000,
    "for": "Training Title",
    "status": "success",
    "createdAt": "2025-08-03T17:54:49.858Z"
  }
]
```

### 3. Get Transaction by ID
**GET** `/transaction/:id`

Returns a specific transaction by its ID.

**Parameters:**
- `id` (path parameter): Transaction ID

**Response:**
```json
{
  "_id": "transaction_id",
  "email": "user@example.com",
  "amount": 1000,
  "for": "Training Title",
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "status": "success",
  "receiptLink": "/uploads/receipts/receipt_xxx.pdf",
  "createdAt": "2025-08-03T17:54:49.858Z"
}
```

### 4. Get Total Spent by Email
**GET** `/total-spent/:email`

Returns the total amount spent by a user and their transaction details.

**Parameters:**
- `email` (path parameter): User's email address

**Response:**
```json
{
  "totalSpent": 5000,
  "transactionCount": 5,
  "transactions": [
    {
      "_id": "transaction_id",
      "email": "user@example.com",
      "amount": 1000,
      "for": "Training Title",
      "status": "success",
      "createdAt": "2025-08-03T17:54:49.858Z"
    }
  ]
}
```

## Dashboard Integration

The DashboardOverview component has been updated to:

1. **Fetch Total Spent**: Calls `/total-spent/:email` to calculate and display the total amount spent
2. **Display Transaction History**: Shows recent transactions in a dedicated section
3. **Real-time Updates**: Updates the "Total Spent" metric card with the calculated amount

### Features Added to Dashboard:

- **Total Spent Metric Card**: Shows the total amount spent by the user
- **Transaction History Section**: Displays the 5 most recent transactions
- **Error Handling**: Gracefully handles cases where no transactions exist
- **Loading States**: Proper loading indicators while fetching data

## Transaction Model Schema

```javascript
{
  email: { type: String, required: true },
  name: { type: String },
  amount: { type: Number, required: true },
  for: { type: String, required: true }, // e.g. training title
  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },
  bookingId: { type: String }, // Store the booking ID
  status: { type: String, default: "success" },
  receiptLink: { type: String },
  createdAt: { type: Date, default: Date.now },
}
```

## Usage Examples

### Frontend Integration
```javascript
// Fetch total spent
const fetchTotalSpent = async (email) => {
  const res = await axios.get(`${API}/payments/total-spent/${email}`);
  const { totalSpent } = res.data;
  return totalSpent;
};

// Fetch transaction history
const fetchTransactions = async (email) => {
  const res = await axios.get(`${API}/payments/transactions-by-email/${email}`);
  return res.data;
};
```

### Testing Endpoints
```bash
# Get all transactions
curl -X GET http://localhost:8080/api/payments/all-transactions

# Get transactions by email
curl -X GET http://localhost:8080/api/payments/transactions-by-email/user@example.com

# Get total spent by email
curl -X GET http://localhost:8080/api/payments/total-spent/user@example.com

# Get specific transaction
curl -X GET http://localhost:8080/api/payments/transaction/transaction_id
```

## Error Handling

All endpoints include proper error handling:
- 400 Bad Request: Missing required parameters
- 404 Not Found: Transaction not found
- 500 Internal Server Error: Server-side errors

The frontend gracefully handles these errors and displays appropriate fallback values (e.g., ₹0 for total spent when no transactions exist). 