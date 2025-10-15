# 🚀 Deploy Individual Requests Feature to Production

## Overview

This guide will help you deploy the new Individual Training Requests functionality to your production server at `iicpa.in`.

## 📋 Pre-Deployment Checklist

### ✅ Files Modified/Created:

- `backend/models/TrainingRequest.js` - New model
- `backend/controllers/individualController.js` - Updated with training request functions
- `backend/routes/individualRoutes.js` - Updated with new routes
- `backend/models/Employee.js` - Updated with individual-requests permissions
- `client/src/app/admin-dashboard/IndividualRequestsTab.tsx` - New admin component
- `client/src/app/admin-dashboard/page.tsx` - Updated navigation

## 🔧 Deployment Steps

### Step 1: Backup Current Production

```bash
# SSH into your production server
ssh user@your-server

# Backup current application
cd /var/www/iicpa
cp -r backend backend_backup_$(date +%Y%m%d_%H%M%S)
cp -r client client_backup_$(date +%Y%m%d_%H%M%S)
```

### Step 2: Deploy Backend Changes

```bash
# Navigate to backend directory
cd /var/www/iicpa/backend

# Pull latest changes (if using git)
git pull origin main

# OR manually upload the modified files:
# - models/TrainingRequest.js
# - controllers/individualController.js
# - routes/individualRoutes.js
# - models/Employee.js

# Install any new dependencies
npm install

# Update admin permissions in database
node -e "
import mongoose from 'mongoose';
import Employee from './models/Employee.js';
import dotenv from 'dotenv';

dotenv.config();

const updatePermissions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminUsers = await Employee.find({ role: 'Admin' });
    console.log(\`Found \${adminUsers.length} admin users\`);

    for (const admin of adminUsers) {
      if (!admin.permissions['individual-requests']) {
        admin.permissions['individual-requests'] = {
          add: true,
          read: true,
          update: true,
          delete: true,
          active: true,
        };
        await admin.save();
        console.log(\`Updated permissions for: \${admin.name}\`);
      }
    }

    await mongoose.connection.close();
    console.log('Admin permissions updated successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
};

updatePermissions();
"
```

### Step 3: Deploy Frontend Changes

```bash
# Navigate to client directory
cd /var/www/iicpa/client

# Pull latest changes (if using git)
git pull origin main

# OR manually upload the modified files:
# - src/app/admin-dashboard/IndividualRequestsTab.tsx
# - src/app/admin-dashboard/page.tsx

# Build the frontend
npm run build

# The build output will be in the .next directory
```

### Step 4: Restart Services

```bash
# Restart backend service (using PM2)
pm2 restart iicpa-backend

# OR if using systemd
sudo systemctl restart iicpa-backend

# Restart frontend service (if using PM2)
pm2 restart iicpa-frontend

# OR if using systemd
sudo systemctl restart iicpa-frontend

# Check service status
pm2 status
# OR
sudo systemctl status iicpa-backend
sudo systemctl status iicpa-frontend
```

### Step 5: Verify Deployment

```bash
# Test backend API
curl -X GET "https://iicpa.in/api/v1/individual/test" -H "Content-Type: application/json"

# Should return: {"message":"Individual routes are working!"}

# Test admin authentication
curl -X GET "https://iicpa.in/api/v1/individual/admin/training-requests" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# Should return: {"requests": []} (empty array if no requests exist)
```

## 🔍 Post-Deployment Verification

### 1. Check Admin Dashboard

1. Go to `https://iicpa.in/admin-dashboard`
2. Login with admin credentials
3. Navigate to "User Management" → "Individual Requests"
4. Verify the page loads without errors
5. Check that "No training requests found" is displayed (this is correct if no requests exist)

### 2. Test Individual User Flow

1. Go to `https://iicpa.in/training/practical`
2. Login with individual user credentials
3. Verify the training request submission form works
4. Submit a test request
5. Check that it appears in the admin dashboard

### 3. Check Database

```bash
# Connect to MongoDB
mongo your-database-name

# Check if TrainingRequest collection exists
db.trainingrequests.find().count()

# Check admin permissions
db.employees.find({role: "Admin"}, {permissions: 1})
```

## 🚨 Troubleshooting

### Issue: 401 Unauthorized Error

**Solution:** Ensure admin user has individual-requests permissions

```bash
# Run the permission update script from Step 2
```

### Issue: Frontend Not Loading

**Solution:** Check if build completed successfully

```bash
cd /var/www/iicpa/client
npm run build
# Check for any build errors
```

### Issue: Backend Not Starting

**Solution:** Check logs and dependencies

```bash
# Check PM2 logs
pm2 logs iicpa-backend

# Check if all dependencies are installed
cd /var/www/iicpa/backend
npm install
```

### Issue: Database Connection Error

**Solution:** Verify MongoDB is running and connection string is correct

```bash
# Check MongoDB status
sudo systemctl status mongodb

# Test connection
mongo --eval "db.runCommand('ping')"
```

## 📊 Monitoring

### Check Application Logs

```bash
# Backend logs
pm2 logs iicpa-backend

# Frontend logs (if using PM2)
pm2 logs iicpa-frontend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Monitor Database

```bash
# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Monitor database performance
mongo --eval "db.runCommand({serverStatus: 1})"
```

## 🔄 Rollback Plan

If something goes wrong, you can rollback:

```bash
# Stop current services
pm2 stop iicpa-backend iicpa-frontend

# Restore from backup
cd /var/www/iicpa
rm -rf backend client
mv backend_backup_YYYYMMDD_HHMMSS backend
mv client_backup_YYYYMMDD_HHMMSS client

# Restart services
pm2 start iicpa-backend iicpa-frontend
```

## ✅ Success Criteria

After deployment, you should be able to:

1. ✅ Access Individual Requests in admin dashboard
2. ✅ See "No training requests found" (correct if no data exists)
3. ✅ Individual users can submit training requests
4. ✅ Admin users can view and manage requests
5. ✅ No 401/403 errors in browser console
6. ✅ All existing functionality still works

## 📞 Support

If you encounter any issues during deployment:

1. Check the troubleshooting section above
2. Review application logs
3. Verify all files were uploaded correctly
4. Ensure database permissions are updated

---

**Deployment completed successfully!** 🎉

The Individual Training Requests feature is now live in production.
