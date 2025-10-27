# Production Migration Guide: Add Slugs to Group Pricing

## Overview
This guide will help you safely run the migration script on your production server to ensure all group pricing records have proper slugs.

## Prerequisites

### 1. Database Backup
**CRITICAL**: Always backup your production database before running any migration.

```bash
# MongoDB backup command (adjust connection string as needed)
mongodump --uri="your_production_mongodb_uri" --out=backup_$(date +%Y%m%d_%H%M%S)
```

### 2. Environment Variables
Ensure your production server has the correct environment variables:
- `MONGODB_URI` - Your production MongoDB connection string
- `NODE_ENV=production` - Set to production
- `ALLOW_PRODUCTION_MIGRATION=true` - Required safety flag

## Migration Steps

### Step 1: Upload Migration Script
Upload the production migration script to your server:
```bash
# Copy the script to your production server
scp backend/scripts/add-slugs-to-group-pricing-production.js user@your-server:/path/to/your/app/backend/scripts/
```

### Step 2: Set Environment Variables
On your production server, set the required environment variables:

```bash
# Add to your .env file or export directly
export NODE_ENV=production
export ALLOW_PRODUCTION_MIGRATION=true
export MONGODB_URI="your_production_mongodb_connection_string"
```

### Step 3: Run Migration Script
Navigate to your backend directory and run the migration:

```bash
cd /path/to/your/app/backend
node scripts/add-slugs-to-group-pricing-production.js
```

## Expected Output

The script will provide detailed output showing:
- Connection status
- Number of records found
- Which records need slugs
- Progress of updates
- Final summary

Example output:
```
🔗 Connecting to MongoDB...
📍 Database URI: mongodb://***:***@your-server/database
✅ Connected to MongoDB successfully
📊 Total group pricing records: 5
🔍 Records needing slugs: 2

📋 Records to be updated:
1. "GST Pro Package" (ID: 507f1f77bcf86cd799439011)
2. "Accounting Basics" (ID: 507f1f77bcf86cd799439012)

🚀 Starting migration...
✅ Updated: "GST Pro Package" -> slug: "gst-pro-package"
✅ Updated: "Accounting Basics" -> slug: "accounting-basics"

📈 Migration Summary:
   ✅ Updated: 2 records
   ⚠️  Skipped: 0 records
   📊 Total processed: 2 records

🔍 Verifying migration...
🎉 Migration verification successful! All records now have slugs.
🔌 Disconnected from MongoDB
```

## Safety Features

The production script includes several safety features:

1. **Production Environment Check**: Requires `NODE_ENV=production`
2. **Explicit Permission**: Requires `ALLOW_PRODUCTION_MIGRATION=true`
3. **Duplicate Slug Prevention**: Checks for existing slugs before creating new ones
4. **Detailed Logging**: Shows exactly what's being changed
5. **Verification**: Confirms all records have slugs after migration
6. **Graceful Error Handling**: Stops on any errors

## Rollback Plan

If something goes wrong, you can restore from your backup:

```bash
# Restore from backup
mongorestore --uri="your_production_mongodb_uri" backup_20240115_143022/
```

## Post-Migration Verification

After running the migration, verify everything works:

1. **Check API Response**: Test `/api/group-pricing` endpoint
2. **Test Frontend**: Navigate to group packages on your website
3. **Check Database**: Verify slugs exist in your database

```bash
# Quick database check
mongo your_database_name --eval "db.grouppricings.find({}, {groupName: 1, slug: 1})"
```

## Troubleshooting

### Common Issues:

1. **Connection Failed**: Check your `MONGODB_URI` environment variable
2. **Permission Denied**: Ensure `ALLOW_PRODUCTION_MIGRATION=true` is set
3. **Duplicate Slugs**: The script will skip records that would create duplicate slugs
4. **Missing groupName**: Records without groupName will be skipped

### Getting Help:

If you encounter issues, check the detailed error messages in the script output. The script provides comprehensive logging to help diagnose problems.

## Alternative: Manual Database Update

If you prefer to run the migration directly in your database:

```javascript
// MongoDB shell commands
db.grouppricings.find({slug: {$exists: false}}).forEach(function(doc) {
  if (doc.groupName) {
    var slug = doc.groupName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    db.grouppricings.updateOne(
      {_id: doc._id},
      {$set: {slug: slug}}
    );
    print("Updated: " + doc.groupName + " -> " + slug);
  }
});
```

## Next Steps

After successful migration:
1. Deploy your updated backend code with the slug generation fixes
2. Deploy your updated frontend code with the fallback navigation
3. Test the group package navigation thoroughly
4. Monitor for any issues in the first few days

The migration ensures that all existing group pricing records will have proper slugs, preventing the "Package Not Found" error.
