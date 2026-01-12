import type { Express } from "express";
import { createServer, type Server } from "http";
import nodemailer from "nodemailer";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Email route using SMTP
  app.post("/api/send-email", async (req, res) => {
    try {
      const { subject, text } = req.body;
      
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (!smtpUser || !smtpPass) {
        console.warn("SMTP credentials missing. Email not sent.");
        return res.status(200).json({ success: true, message: "Simulation: SMTP credentials missing." });
      }

      // Updated configuration for a more robust connection
      const transporter = nodemailer.createTransport({
        host: "mail.kabiangafcs.co.ke",
        port: 465,
        secure: true, // Use SSL
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          // Do not fail on invalid certs (common for mail servers)
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: smtpUser,
        to: "info@kabiangafcs.co.ke",
        subject: subject || "Website Notification",
        text: text || "No content provided.",
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Email error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
