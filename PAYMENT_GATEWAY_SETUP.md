# Payment Gateway Integration Setup

This document provides complete setup instructions for the Razorpay payment gateway integration.

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install razorpay
```

### 2. Environment Variables

Copy the contents from `backend/env-example.txt` to `backend/.env` and update with your actual values:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/iicpa

# Server Configuration
PORT=8080
NODE_ENV=development

# Client URL
CLIENT_URL=http://localhost:3000

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Email Configuration (if needed)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Other configurations
API_BASE_URL=http://localhost:8080/api
```

### 3. Razorpay Account Setup

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Create an account or login
3. Go to Settings > API Keys
4. Generate Test API Keys
5. Copy the Key ID and Key Secret to your `.env` file

## Frontend Setup

### 1. Environment Variables

Copy the contents from `client/env-example.txt` to `client/.env.local` and update with your actual values:

```env
# API Configuration
NEXT_PUBLIC_API_BASE=http://localhost:8080/api

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id_here

# Other configurations
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## API Endpoints

### Backend Endpoints

#### 1. Create Order

```
POST /api/test-payment/create-order
```

**Body:**

```json
{
  "amount": 100,
  "currency": "INR",
  "receipt": "receipt_123"
}
```

#### 2. Verify Payment

```
POST /api/test-payment/verify-payment
```

**Body:**

```json
{
  "orderId": "order_id",
  "paymentId": "payment_id",
  "signature": "signature"
}
```

#### 3. Get Payment Details

```
GET /api/test-payment/payment/:paymentId
```

#### 4. Process Refund

```
POST /api/test-payment/refund
```

**Body:**

```json
{
  "paymentId": "payment_id",
  "amount": 50,
  "notes": {
    "reason": "Customer requested refund"
  }
}
```

## Test Payment Page

Visit `http://localhost:3000/test-payment` to test the payment integration.

### Test Card Details

- **Card Number:** 4111 1111 1111 1111
- **Expiry:** Any future date
- **CVV:** Any 3 digits
- **Name:** Any name

## Features Included

1. **Order Creation** - Create payment orders
2. **Payment Processing** - Handle Razorpay checkout
3. **Payment Verification** - Verify payment signatures
4. **Refund Processing** - Process refunds
5. **Error Handling** - Comprehensive error handling
6. **Test Interface** - Complete test page with form

## Security Notes

1. Never expose your Razorpay Key Secret in frontend code
2. Always verify payment signatures on the backend
3. Use HTTPS in production
4. Implement proper logging for payment transactions
5. Store payment details securely in your database

## Production Deployment

1. Switch to Live API Keys from Razorpay Dashboard
2. Update environment variables for production
3. Enable webhook verification
4. Implement proper error monitoring
5. Set up payment analytics

## Troubleshooting

### Common Issues

1. **"Razorpay script failed to load"**

   - Check internet connection
   - Verify Razorpay Key ID is correct

2. **"Order creation failed"**

   - Check Razorpay Key ID and Secret
   - Verify backend is running
   - Check API endpoint

3. **"Payment verification failed"**

   - Check signature verification logic
   - Verify Razorpay Key Secret

4. **CORS errors**
   - Update CORS configuration in backend
   - Add your domain to allowed origins

## Support

For Razorpay-specific issues, refer to:

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)

## Files Created

### Backend

- `backend/routes/payment.js` - Payment routes
- `backend/env-example.txt` - Environment variables template

### Frontend

- `client/src/app/test-payment/page.tsx` - Test payment page
- `client/env-example.txt` - Environment variables template

### Documentation

- `PAYMENT_GATEWAY_SETUP.md` - This setup guide
