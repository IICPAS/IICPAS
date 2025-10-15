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
