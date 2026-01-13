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

      // Using IP address or alternative host if DNS fails
      // mail.kabiangafcs.co.ke might not be resolving correctly in this environment
      const transporter = nodemailer.createTransport({
        host: "kabiangafcs.co.ke", // Try main domain if 'mail' subdomain fails
        port: 587,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
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
      console.error("Email error (primary):", error);
      
      // Fallback attempt with different host
      try {
        const fallbackTransporter = nodemailer.createTransport({
          host: "mail.kabiangafcs.co.ke",
          port: 465,
          secure: true,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        await fallbackTransporter.sendMail({
          from: smtpUser,
          to: "info@kabiangafcs.co.ke",
          subject: subject || "Website Notification",
          text: text || "No content provided.",
        });
        res.json({ success: true });
      } catch (fallbackError: any) {
        console.error("Email error (fallback):", fallbackError);
        res.status(500).json({ error: fallbackError.message });
      }
    }
  });

  return httpServer;
}
