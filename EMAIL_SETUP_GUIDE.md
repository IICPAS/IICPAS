# 📧 Email Setup Guide for PDF Receipts

## Overview

The system now supports sending payment receipts via email with PDF attachments. Here's how to set it up:

## 🔧 Setup Instructions

### 1. Create Email Account

1. Create a Gmail account for your institute (e.g., `iicpas.institute@gmail.com`)
2. This will be used to send automated receipts to students

### 2. Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Scroll down to "2-Step Verification"
3. Click "Set up" or "Manage"
4. Follow the steps to enable 2FA

### 3. Generate App Password

1. Once 2FA is enabled, go back to Security settings
2. Find "2-Step Verification" section
3. Click "App passwords" (you may need to re-authenticate)
4. Select "Mail" as the app
5. Copy the generated 16-character password (e.g., `abcd efgh ijkl mnop`)

### 4. Configure Environment Variables

#### Option A: Set Environment Variables

```bash
export EMAIL_USER="iicpas.institute@gmail.com"
export EMAIL_PASS="your-16-character-app-password"
```

#### Option B: Update the Config File

Edit `/backend/config/emailConfig.js` and replace the default values:

```javascript
export const emailConfig = {
  service: "gmail",
  auth: {
    user: "your-actual-email@gmail.com",
    pass: "your-actual-app-password",
  },
};
```

### 5. Test Email Configuration

```bash
cd backend
node -e "
import('./utils/emailService.js').then(({testEmailConfig}) => {
  testEmailConfig().then(result => {
    console.log('Email test:', result ? '✅ PASSED' : '❌ FAILED');
  });
});
"
```

## 🚀 Features

### PDF Receipt Generation

- ✅ Automatically generates professional PDF receipts
- ✅ Includes all transaction details
- ✅ Professional styling with IICPAS branding
- ✅ Mobile-friendly design
- ✅ Print-optimized format

### Email Features

- ✅ Professional email templates
- ✅ PDF attachment included
- ✅ Student-friendly language
- ✅ Important information highlighted
- ✅ Contact details included

### Admin Dashboard Integration

- ✅ "Send Receipt" button for approved transactions
- ✅ Prevents duplicate sending
- ✅ Shows receipt status and timestamp
- ✅ Success/error feedback

## 📋 Email Template Preview

**Subject:** `Payment Receipt - ₹4,750 - Basic Accounting & Tally Foundation`

**Content:**

- Professional header with IICPAS branding
- Personalized greeting to student
- Payment summary with highlighted amount
- UTR number and status confirmation
- PDF attachment notification
- Important reminders and instructions
- Contact information
- Professional footer

## 🔍 Testing Without Email Setup

If email is not configured, the system will:

- ✅ Still generate PDF receipts
- ✅ Mark transactions as "receipt sent"
- ✅ Show success message in admin dashboard
- ⚠️ Display setup instructions in console logs
- ⚠️ No actual email will be sent (simulated)

## 🛠️ Troubleshooting

### Common Issues

1. **"Invalid login" error**

   - Make sure you're using App Password, not regular password
   - Verify 2FA is enabled
   - Check email address is correct

2. **"Less secure app access" warning**

   - This doesn't apply when using App Passwords
   - Make sure 2FA is enabled and you're using App Password

3. **Email not received**
   - Check spam folder
   - Verify student email address is correct
   - Check email configuration logs

### Support

- Email: support@iicpas.com
- Console logs show detailed error messages
- Check server logs for email delivery status

## 📝 Production Deployment

For production deployment:

1. Use a dedicated email service account
2. Set up proper DNS records (SPF, DKIM, DMARC)
3. Monitor email delivery rates
4. Set up email bounce handling
5. Consider using email service providers like SendGrid, Mailgun for better deliverability

---

**Note:** This system supports Gmail by default, but can be configured for other email services like Outlook, Yahoo, or custom SMTP servers.
