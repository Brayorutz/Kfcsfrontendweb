/**
 * Email Configuration Test Script
 * Run this to verify SMTP settings are working correctly
 * 
 * Usage: npx tsx test-email.ts
 */

import nodemailer from "nodemailer";
import "dotenv/config";

async function testEmailConfig() {
  console.log("🔍 Testing Email Configuration...\n");

  // Check if SMTP environment variables are set
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM;

  console.log("📋 Current Configuration:");
  console.log(`  SMTP_HOST: ${smtpHost || "❌ NOT SET"}`);
  console.log(`  SMTP_PORT: ${process.env.SMTP_PORT || "587 (default)"}`);
  console.log(`  SMTP_USER: ${smtpUser ? `✅ ${smtpUser}` : "❌ NOT SET"}`);
  console.log(`  SMTP_PASS: ${smtpPass ? `✅ ${smtpPass.substring(0, 4)}...${smtpPass.length} chars` : "❌ NOT SET"}`);
  console.log(`  SMTP_FROM: ${smtpFrom || "❌ NOT SET"}`);

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log("\n❌ SMTP configuration incomplete!");
    console.log("Please update your .env file with:");
    console.log("  SMTP_HOST=smtp.gmail.com");
    console.log("  SMTP_PORT=587");
    console.log("  SMTP_USER=your-email@gmail.com");
    console.log("  SMTP_PASS=your-16-char-app-password");
    console.log("  SMTP_FROM=Your Name <your-email@gmail.com>");
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: false, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    // Verify connection
    console.log("\n🔄 Testing SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection successful!");

    // Send test email
    console.log("\n📧 Sending test email...");
    const info = await transporter.sendMail({
      from: smtpFrom || smtpUser,
      to: smtpUser, // Send to yourself
      subject: "KFCS Website - Email Test",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a5f2a;">✅ Email Configuration Test Successful!</h2>
          <p>This is a test email from the KFCS website.</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p>If you received this email, your SMTP configuration is working correctly.</p>
        </div>
      `,
    });

    console.log("✅ Test email sent successfully!");
    console.log(`📨 Message ID: ${info.messageId}`);
    console.log(`📬 Check your inbox at: ${smtpUser}`);
  } catch (error: any) {
    console.error("\n❌ Email test failed!");
    console.error("Error:", error.message);
    
    if (error.code === "EAUTH") {
      console.error("\n💡 Authentication failed!");
      console.error("This usually means:");
      console.error("  1. The password is incorrect");
      console.error("  2. You need to use an App Password (not regular password)");
      console.error("  3. 2-Factor Authentication is not enabled on your Gmail account");
      console.error("\n📖 Solution:");
      console.error("  1. Go to https://myaccount.google.com/security");
      console.error("  2. Enable 2-Step Verification");
      console.error("  3. Go to https://myaccount.google.com/apppasswords");
      console.error("  4. Create an App Password and use it in SMTP_PASS");
    }
  }
}

testEmailConfig();

