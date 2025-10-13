# Environment Setup Instructions

## Backend Environment Variables

Create a file named `.env` in the `backend` folder with the following content:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/iicpa

# Server Configuration
PORT=8080
NODE_ENV=development

# Client URL
CLIENT_URL=http://localhost:3000

# Razorpay Configuration (Test Keys)
RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag
RAZORPAY_KEY_SECRET=thisisasecretkey

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

## Frontend Environment Variables

Create a file named `.env.local` in the `client` folder with the following content:

```env
# API Configuration
NEXT_PUBLIC_API_BASE=http://localhost:8080/api

# Razorpay Configuration (Test Keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag

# Other configurations
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Important Notes

1. **Razorpay Test Keys**: The keys provided above are test keys. For production, you need to:

   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Generate your own test/live API keys
   - Replace the keys in your environment files

2. **File Creation**: Since `.env` files are gitignored, you need to create them manually:

   ```bash
   # Backend
   cp backend/env-example.txt backend/.env

   # Frontend
   cp client/env-example.txt client/.env.local
   ```

3. **Restart Servers**: After creating environment files, restart both servers:

   ```bash
   # Backend
   cd backend && npm start

   # Frontend
   cd client && npm run dev
   ```

## Test the Integration

1. Visit `http://localhost:3000/test-payment`
2. Fill in the form with test data
3. Use test card: 4111 1111 1111 1111
4. Complete the payment flow

The payment gateway integration is now ready to use!
