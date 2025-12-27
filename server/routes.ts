import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertMemberSchema, 
  insertProductSchema, 
  insertOrderSchema,
  insertNewsSchema,
  insertLoanSchema,
} from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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
  
  // Career applications
  app.post("/api/careers/apply", async (req, res) => {
    try {
      const { fullName, email, phone, jobPosition } = req.body;
      
      if (!fullName || !email || !phone || !jobPosition) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      // For now, just acknowledge the application
      // In a production setup with email service, this would send an email
      res.json({ 
        success: true, 
        message: "Your career application has been received. We will contact you when opportunities become available."
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Seed initial admin (for development)
  app.post("/api/admin/seed", async (req, res) => {
    try {
      const existing = await storage.getAdminByUsername("admin");
      if (existing) {
        return res.json({ message: "Admin already exists" });
      }
      
      const passwordHash = await bcrypt.hash("admin123", 10);
      await storage.createAdmin({ username: "admin", passwordHash });
      res.json({ success: true, message: "Admin created with username: admin, password: admin123" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return httpServer;
}
