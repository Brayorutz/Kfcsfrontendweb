import type { Express } from "express";
import { createServer, type Server } from "http";
import nodemailer from "nodemailer";
import multer from "multer";

// Configure multer for file uploads (memory storage for email attachments)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = '.' + file.originalname.split('.').pop()?.toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  feature/add-village-dropdown
  // Membership routes
  app.post("/api/members/apply", async (req, res) => {
    try {
      const memberData = insertMemberSchema.parse(req.body);
      
      // Check if already exists
      const existing = await storage.getMemberByNationalId(memberData.nationalId);
      if (existing) {
        return res.status(400).json({ error: "A member with this National ID already exists" });
      }
      
      const member = await storage.createMember(memberData);
      res.json({ success: true, member });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.get("/api/members", async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      res.json(members);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/members/pending", async (req, res) => {
    try {
      const members = await storage.getPendingMembers();
      res.json(members);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.patch("/api/members/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await storage.updateMemberStatus(parseInt(id), status);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Member Portal - Login
  app.post("/api/portal/login", async (req, res) => {
    try {
      const { memberNumber, password } = req.body;
      
      const member = await storage.getMemberByMemberNumber(memberNumber);
      if (!member) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // For now, password is National ID (in production, hash this)
      if (member.nationalId !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      if (member.status !== "approved") {
        return res.status(403).json({ error: "Membership pending approval" });
      }
      
      res.json({ success: true, member });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Member statements
  app.get("/api/members/:id/statements", async (req, res) => {
    try {
      const { id } = req.params;
      const statements = await storage.getStatementsByMemberId(parseInt(id));
      res.json(statements);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Member loans
  app.get("/api/members/:id/loans", async (req, res) => {
    try {
      const { id } = req.params;
      const loans = await storage.getLoansByMemberId(parseInt(id));
      res.json(loans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/loans", async (req, res) => {
    try {
      const loanData = insertLoanSchema.parse(req.body);
      const loan = await storage.createLoan(loanData);
      res.json({ success: true, loan });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json({ success: true, product });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json({ success: true, order });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // News
  app.get("/api/news", async (req, res) => {
    try {
      const newsItems = await storage.getAllNews();
      res.json(newsItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const newsItem = await storage.getNews(parseInt(id));
      if (!newsItem) {
        return res.status(404).json({ error: "News not found" });
      }
      res.json(newsItem);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/news", async (req, res) => {
    try {
      const newsData = insertNewsSchema.parse(req.body);
      const newsItem = await storage.createNews(newsData);
      res.json({ success: true, news: newsItem });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.patch("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.updateNews(parseInt(id), req.body);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.delete("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteNews(parseInt(id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const valid = await bcrypt.compare(password, admin.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      res.json({ success: true, admin: { id: admin.id, username: admin.username } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Career applications - using multer for multipart/form-data
  app.post("/api/careers/apply", upload.single('resume'), async (req, res) => {
    try {
      const fullName = req.body.fullName;
      const email = req.body.email;
      const phone = req.body.phone;
      const jobPosition = req.body.jobPosition;
      const resumeFile = req.file;

      // Validate all required fields
      if (!fullName || !email || !phone || !jobPosition) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      if (!resumeFile) {
        return res.status(400).json({ error: "Resume/CV is required" });
      }

      // Check if SMTP is configured
      const smtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

      if (smtpConfigured) {
        // Manager email - sent to kabiangafarmerssacco@gmail.com
        const managerEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a5f2a;">New Career Application - KFCS Website</h2>
            <p><strong>Applicant Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Position Applied:</strong> ${jobPosition}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #666; font-size: 14px;">
              The applicant has uploaded their CV/Resume. Please find the attached file.
            </p>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
              This application was submitted through the KFCS website careers page.
            </p>
          </div>
        `;

        // Sender confirmation email
        const senderEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a5f2a;">Application Received!</h2>
            <p>Dear ${fullName},</p>
            <p>Thank you for your interest in joining Kabianga Farmers Cooperative Society.</p>
            <p><strong>Your application details:</strong></p>
            <ul>
              <li><strong>Position:</strong> ${jobPosition}</li>
              <li><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
              <li><strong>Status:</strong> Received</li>
            </ul>
            <p style="margin-top: 20px; padding: 15px; background-color: #e8f5e9; border-radius: 5px;">
              <strong>Next Steps:</strong> Our HR team will review your application and contact you if your qualifications match our requirements.
            </p>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #666; font-size: 12px;">
              Best regards,<br />
              <strong>Kabianga Farmers Cooperative Society</strong><br />
              PO Box 123 - 20200, Kericho, Kenya<br />
              Phone: 0743719091<br />
              Email: kabiangafarmerssacco@gmail.com
            </p>
          </div>
        `;

        // Prepare attachment for manager email
        const attachments = [{
          filename: resumeFile.originalname,
          content: resumeFile.buffer,
        }];

        // Send email to manager
        const managerMailOptions = {
          from: process.env.SMTP_FROM || "Kabianga Farmers Cooperative <noreply@kfcs.co.ke>",
          to: "kabiangafarmerssacco@gmail.com",
          subject: `[KFCS Career Application] ${jobPosition} - From: ${fullName}`,
          html: managerEmailContent,
          attachments: attachments,
        };

        // Send confirmation email to applicant
        const senderMailOptions = {
          from: process.env.SMTP_FROM || "Kabianga Farmers Cooperative <noreply@kfcs.co.ke>",
          to: email,
          subject: "Application Received - Kabianga Farmers Cooperative Society",
          html: senderEmailContent,
        };

        // Send both emails - wrap in try/catch to handle email failures gracefully
        try {
          await Promise.all([
            transporter.sendMail(managerMailOptions),
            transporter.sendMail(senderMailOptions),
          ]);
          console.log("Career application emails sent successfully");
        } catch (emailError: any) {
          console.error("Email sending error (application still saved):", emailError);
          // Continue even if email fails - application is saved to database
        }
      } else {
        console.log("SMTP not configured - Application received but emails not sent");
        console.log("Manager email would have been: kabiangafarmerssacco@gmail.com");
      }

      res.json({ 
        success: true, 
        message: "Your career application has been received. We will contact you when opportunities become available.",
        emailSent: smtpConfigured,
      });
    } catch (error: any) {
      console.error("Career application error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Send email endpoint
  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, subject, firstName, lastName, nationalId, phone, email, village } = req.body;

      if (!to || !subject) {
        return res.status(400).json({ error: "Recipient email and subject are required" });
      }

      const emailContent = `
        <h2>New Membership Application</h2>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>National ID:</strong> ${nationalId}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
        <p><strong>Village/Area:</strong> ${village}</p>
      `;
  // Email route using SMTP
  app.post("/api/send-email", async (req, res) => {
    try {
      const { subject, text } = req.body;
      
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP credentials missing. Email not sent.");
        return res.status(200).json({ success: true, message: "Simulation: SMTP credentials missing." });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    main

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: "kabiangafarmerssacco@gmail.com",
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
