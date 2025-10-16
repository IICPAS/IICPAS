#!/bin/bash

# Deploy Individual Requests Feature to Production
# Run this script from the project root directory

set -e  # Exit on any error

echo "🚀 Starting deployment of Individual Requests feature to production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "client" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Creating backup of current production files..."

# Create backup directory with timestamp
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# List of files to deploy
BACKEND_FILES=(
    "backend/models/TrainingRequest.js"
    "backend/controllers/individualController.js"
    "backend/routes/individualRoutes.js"
    "backend/models/Employee.js"
)

FRONTEND_FILES=(
    "client/src/app/admin-dashboard/IndividualRequestsTab.tsx"
    "client/src/app/admin-dashboard/page.tsx"
)

print_status "Files to be deployed:"
echo "Backend files:"
for file in "${BACKEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        print_error "  ❌ $file (not found)"
        exit 1
    fi
done

echo "Frontend files:"
for file in "${FRONTEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        print_error "  ❌ $file (not found)"
        exit 1
    fi
done

print_status "Creating deployment package..."

# Create deployment package
mkdir -p "deployment-package/backend"
mkdir -p "deployment-package/client"

# Copy backend files
for file in "${BACKEND_FILES[@]}"; do
    cp "$file" "deployment-package/backend/"
done

# Copy frontend files
for file in "${FRONTEND_FILES[@]}"; do
    cp "$file" "deployment-package/client/"
done

# Create database update script
cat > "deployment-package/update-database.js" << 'EOF'
import mongoose from "mongoose";
import Employee from "./backend/Employee.js";
import dotenv from "dotenv";

dotenv.config();

const updatePermissions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    
    const adminUsers = await Employee.find({ role: "Admin" });
    console.log(`Found ${adminUsers.length} admin users`);
    
    for (const admin of adminUsers) {
      if (!admin.permissions["individual-requests"]) {
        admin.permissions["individual-requests"] = {
          add: true,
          read: true,
          update: true,
          delete: true,
          active: true,
        };
        await admin.save();
        console.log(`Updated permissions for: ${admin.name}`);
      } else {
        console.log(`Permissions already exist for: ${admin.name}`);
      }
    }
    
    await mongoose.connection.close();
    console.log("Admin permissions updated successfully!");
  } catch (error) {
    console.error("Error updating permissions:", error);
    process.exit(1);
  }
};

updatePermissions();
EOF

# Create deployment instructions
cat > "deployment-package/DEPLOYMENT_INSTRUCTIONS.md" << 'EOF'
# Deployment Instructions

## 1. Upload Files to Production Server

Upload the following files to your production server:

### Backend Files (to /var/www/iicpa/backend/):
- TrainingRequest.js (to models/)
- individualController.js (to controllers/)
- individualRoutes.js (to routes/)
- Employee.js (to models/)

### Frontend Files (to /var/www/iicpa/client/):
- IndividualRequestsTab.tsx (to src/app/admin-dashboard/)
- page.tsx (to src/app/admin-dashboard/)

## 2. Update Database

Run the database update script:
```bash
cd /var/www/iicpa/backend
node update-database.js
```

## 3. Install Dependencies

```bash
cd /var/www/iicpa/backend
npm install

cd /var/www/iicpa/client
npm install
```

## 4. Build Frontend

```bash
cd /var/www/iicpa/client
npm run build
```

## 5. Restart Services

```bash
# Using PM2
pm2 restart iicpa-backend
pm2 restart iicpa-frontend

# OR using systemd
sudo systemctl restart iicpa-backend
sudo systemctl restart iicpa-frontend
```

## 6. Verify Deployment

1. Go to https://iicpa.in/admin-dashboard
2. Navigate to "User Management" → "Individual Requests"
3. Verify the page loads without errors
4. Test individual user signup/login at https://iicpa.in/training/practical
EOF

print_status "Deployment package created successfully!"
print_status "Package location: deployment-package/"

echo ""
print_warning "Next steps:"
echo "1. Upload the files in 'deployment-package/' to your production server"
echo "2. Follow the instructions in 'deployment-package/DEPLOYMENT_INSTRUCTIONS.md'"
echo "3. Run the database update script on your production server"
echo "4. Restart your services"
echo ""

print_status "Deployment package ready! 🎉"
print_status "Files created:"
echo "  📁 deployment-package/backend/ - Backend files to upload"
echo "  📁 deployment-package/client/ - Frontend files to upload"
echo "  📄 deployment-package/update-database.js - Database update script"
echo "  📄 deployment-package/DEPLOYMENT_INSTRUCTIONS.md - Step-by-step instructions"

echo ""
print_warning "Remember to:"
echo "  - Backup your current production files before deploying"
echo "  - Test the deployment on a staging environment first"
echo "  - Monitor logs after deployment"
echo "  - Verify all functionality works as expected"
