export const emailConfig = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "iicpas.institute@gmail.com",
    pass: process.env.EMAIL_PASS || "your-gmail-app-password",
  },
};

// You need to set up your email credentials in environment variables:
// EMAIL_USER=your-email@gmail.com
// EMAIL_PASS=your-app-password
//
// To set up Gmail App Password:
// 1. Enable 2-Factor Authentication on your Gmail account
// 2. Go to Google Account settings > Security > App passwords
// 3. Generate a new app password for "Mail"
// 4. Use that password (not your regular Gmail password) in EMAIL_PASS

export const setupEmailInstructions = () => {
  console.log(`
  📧 EMAIL SETUP REQUIRED FOR RECEIPT FUNCTIONALITY:
  
  To enable email receipts, you need to set up email credentials:
  
  1. Create a Gmail account for your institute (e.g., iicpas.institute@gmail.com)
  2. Enable 2-Factor Authentication on that account
  3. Generate an App Password:
     - Go to Google Account > Security
     - Under "2-Step Verification", click "App passwords"
     - Generate password for "Mail" application
  4. Set environment variables:
     export EMAIL_USER="iicpas.institute@gmail.com"
     export EMAIL_PASS="your-16-character-app-password"
  
  Alternative: Use other email services:
  - Outlook/Hotmail: smtp-mail.outlook.com
  - Yahoo: smtp.mail.yahoo.com
  - Custom SMTP server
  
  Current configuration will use default values if not set.
  `);
};

// Check if email is properly configured
export const isEmailConfigured = () => {
  const email = process.env.EMAIL_USER || emailConfig.auth.user;
  const pass = process.env.EMAIL_PASS || emailConfig.auth.pass;

  return (
    email !== "iicpas.institute@gmail.com" && pass !== "your-gmail-app-password"
  );
};
